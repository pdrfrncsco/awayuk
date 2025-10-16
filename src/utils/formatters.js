// Utilitários de formatação para UI

export const formatApiError = (err, fallback) => {
  try {
    const data = err?.data ?? err?.response?.data;
    if (data) {
      if (typeof data === 'string') return data;
      if (data.detail) return data.detail;
      const entries = Object.entries(data);
      const fieldMessages = entries
        .filter(([_, v]) => Array.isArray(v) || typeof v === 'string')
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
      if (fieldMessages.length) return fieldMessages.join(' • ');
    }
  } catch (_) {}
  return err?.message || fallback || 'Ocorreu um erro inesperado.';
};

export default {
  formatApiError,
};