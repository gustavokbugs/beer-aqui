/**
 * Format price to Brazilian Real currency
 * @param value - The price value in cents or decimal
 * @returns Formatted price string (e.g., "R$ 10,50")
 */
export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Format distance to human-readable format
 * @param meters - Distance in meters
 * @returns Formatted distance string (e.g., "1,5 km" or "500 m")
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
};

/**
 * Format volume to human-readable format
 * @param ml - Volume in milliliters
 * @returns Formatted volume string (e.g., "350ml" or "1L")
 */
export const formatVolume = (ml: number): string => {
  if (ml < 1000) {
    return `${ml}ml`;
  }
  return `${(ml / 1000).toFixed(1).replace('.', ',')}L`;
};

/**
 * Calculate price per liter
 * @param price - Price in BRL
 * @param volumeMl - Volume in milliliters
 * @returns Price per liter
 */
export const calculatePricePerLiter = (price: number, volumeMl: number): number => {
  return (price / volumeMl) * 1000;
};

/**
 * Format phone number to Brazilian format
 * @param phone - Phone number string
 * @returns Formatted phone (e.g., "(11) 98765-4321")
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get volumeMl from Product (handles both 'volume' and 'volumeMl' fields)
 * @param product - Product object
 * @returns Volume in milliliters
 */
export const getProductVolume = (product: { volume?: number; volumeMl?: number }): number => {
  return product.volumeMl || product.volume || 0;
};

/**
 * Format CNPJ to Brazilian format
 * @param cnpj - CNPJ string
 * @returns Formatted CNPJ (e.g., "12.345.678/0001-90")
 */
export const formatCNPJ = (cnpj: string): string => {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length <= 14) {
    return cleaned
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  return cnpj;
};

/**
 * Validate CNPJ using verification digits
 * @param cnpj - CNPJ string (with or without formatting)
 * @returns true if valid, false otherwise
 */
export const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');

  // CNPJ must have 14 digits
  if (cleaned.length !== 14) {
    return false;
  }

  // Check for known invalid CNPJs (all same digits)
  if (/^(\d)\1{13}$/.test(cleaned)) {
    return false;
  }

  // Validate first verification digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cleaned.charAt(12)) !== digit1) {
    return false;
  }

  // Validate second verification digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cleaned.charAt(13)) !== digit2) {
    return false;
  }

  return true;
};
