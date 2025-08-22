/**
 * Remove acentos de uma string
 * @param {string} texto - Texto com ou sem acentos
 * @returns {string} Texto sem acentos
 */
export const removerAcentos = (texto) => {
  if (!texto) return '';
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Converte texto para lowercase e remove acentos
 * @param {string} texto - Texto a ser normalizado
 * @returns {string} Texto normalizado
 */
export const normalizarTexto = (texto) => {
  if (!texto) return '';
  return removerAcentos(texto.toLowerCase());
};

/**
 * Verifica se um texto contém outro texto (ignorando acentos e case)
 * @param {string} texto - Texto onde buscar
 * @param {string} busca - Texto a ser buscado
 * @returns {boolean} True se contém, false caso contrário
 */
export const contemTexto = (texto, busca) => {
  if (!texto || !busca) return false;
  const textoNormalizado = normalizarTexto(texto);
  const buscaNormalizada = normalizarTexto(busca);
  return textoNormalizado.includes(buscaNormalizada);
};

/**
 * Formata CPF com pontos e hífen
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado
 */
export const formatarCPF = (cpf) => {
  if (!cpf) return '';
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata telefone brasileiro
 * @param {string} telefone - Telefone sem formatação
 * @returns {string} Telefone formatado
 */
export const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  const telLimpo = telefone.replace(/\D/g, '');
  
  if (telLimpo.length === 11) {
    return telLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (telLimpo.length === 10) {
    return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
}; 