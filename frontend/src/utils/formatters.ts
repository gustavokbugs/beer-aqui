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
