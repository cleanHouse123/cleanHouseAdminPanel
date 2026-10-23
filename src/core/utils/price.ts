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


/**
 * Форматирует сумму в копейках для показа человеку: копейки выводятся только
 * когда они есть. 15920 → «159,20 ₽», 19900 → «199 ₽».
 * Нужно там, где сумма может быть нецелой — например после скидки по промокоду
 * или частичного возврата.
 */
export const formatKopecks = (priceInKopecks: string | number): string => {
  const num =
    typeof priceInKopecks === 'string'
      ? parseFloat(priceInKopecks)
      : priceInKopecks;
  const rubles = num / 100;
  const hasKopecks = Math.round(num) % 100 !== 0;

  return `${rubles.toLocaleString('ru-RU', {
    minimumFractionDigits: hasKopecks ? 2 : 0,
    maximumFractionDigits: 2,
  })} ₽`;
};
