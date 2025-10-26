/**
 * Конвертирует цену из копеек в рубли и возвращает число
 * @param priceInKopecks - цена в копейках (может быть string или number)
 * @returns цена в рублях
 */
export const kopecksToRubles = (priceInKopecks: string | number): number => {
  const num = typeof priceInKopecks === 'string' ? parseFloat(priceInKopecks) : priceInKopecks;
  return Math.round(num / 100);
};

/**
 * Конвертирует цену из копеек в рубли и возвращает строку с символом рубля
 * @param priceInKopecks - цена в копейках (может быть string или number)
 * @returns строка с ценой в рублях
 */
export const kopecksToRublesString = (priceInKopecks: string | number): string => {
  const num = typeof priceInKopecks === 'string' ? parseFloat(priceInKopecks) : priceInKopecks;
  return `${Math.round(num / 100)} ₽`;
};

