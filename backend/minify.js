const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Função para encontrar todos os arquivos .js recursivamente
function findJsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findJsFiles(fullPath));
    } else if (item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Função para minificar um arquivo
async function minifyFile(filePath) {
  try {
    console.log(`Minificando: ${filePath}`);
    const code = fs.readFileSync(filePath, 'utf8');
    const result = await minify(code, {
      compress: true,
      mangle: true
    });
    
    if (result.code) {
      fs.writeFileSync(filePath, result.code);
      console.log(`✅ Minificado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao minificar ${filePath}:`, error.message);
  }
}

// Função principal
async function main() {
  const distDir = path.join(__dirname, 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Pasta dist não encontrada. Execute npm run build primeiro.');
    process.exit(1);
  }
  
  const jsFiles = findJsFiles(distDir);
  console.log(`📁 Encontrados ${jsFiles.length} arquivos JavaScript para minificar`);
  
  for (const file of jsFiles) {
    await minifyFile(file);
  }
  
  console.log('🎉 Minificação concluída!');
}

main().catch(console.error);
