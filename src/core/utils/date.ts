type DateOptions = {
    isShort?: boolean;
}

export const formatDate = (date: string | Date, options?: DateOptions) => {
    let dateLocaleOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
    if (options?.isShort) {
        dateLocaleOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }
    }
  return new Date(date).toLocaleDateString('ru-RU', dateLocaleOptions);
};