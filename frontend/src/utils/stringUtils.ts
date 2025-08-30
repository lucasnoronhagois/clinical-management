// Função para remover acentos de uma string
export const removerAcentos = (texto: string): string => {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

// Função para verificar se um texto contém outro, ignorando acentos e maiúsculas
export const contemTexto = (texto: string, busca: string): boolean => {
  if (!busca) return true;
  if (!texto) return false;
  
  const textoNormalizado = removerAcentos(texto);
  const buscaNormalizada = removerAcentos(busca);
  
  return textoNormalizado.includes(buscaNormalizada);
};
