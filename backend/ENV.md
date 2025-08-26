# 🔧 Configuração de Ambiente

## 📋 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:

### **Banco de Dados**
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=clinical_care_db
```

### **Segurança**
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### **Ambiente**
```env
NODE_ENV=development  # development | production
PORT=3000
```

### **CORS**
```env
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Ambientes Disponíveis

### **Desenvolvimento (`NODE_ENV=development`)**
- ✅ Logs detalhados habilitados
- ✅ Console.log visível
- ✅ Source maps habilitados
- ✅ Hot reload ativo

### **Produção (`NODE_ENV=production`)**
- ❌ Logs de debug desabilitados
- ❌ Console.log oculto (obfuscação)
- ❌ Source maps desabilitados
- ✅ Código minificado e obfuscado

## 📝 Exemplo de Configuração

```env
# Desenvolvimento
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=clinical_care_dev
JWT_SECRET=dev_secret_key
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Produção
NODE_ENV=production
DB_HOST=production-db-host
DB_USER=prod_user
DB_PASS=prod_password
DB_NAME=clinical_care_prod
JWT_SECRET=super_secure_production_key
PORT=3000
CORS_ORIGIN=https://yourdomain.com
```

## 🔒 Segurança

### **Importante:**
- **NUNCA** commite o arquivo `.env` no Git
- Use chaves JWT diferentes para cada ambiente
- Em produção, use senhas fortes e únicas
- Configure CORS adequadamente para produção

## 🚀 Scripts por Ambiente

### **Desenvolvimento:**
```bash
npm run dev          # Hot reload com logs
npm run build:dev    # Build com source maps
```

### **Produção:**
```bash
npm run build:secure # Build minificado e obfuscado
npm start           # Executa código de produção
```
