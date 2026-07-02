export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const calculateExp = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  
  if (months < 0) return years - 1;
  return years;
};

const isOptimizableImage = (src) => {
  if (!src || typeof src !== 'string') {
    return false;
  }

  try {
    const url = new URL(src);
    return url.hostname.endsWith('unsplash.com');
  } catch (error) {
    return false;
  }
};

export const getOptimizedImageUrl = (src, options = {}) => {
  if (!isOptimizableImage(src)) {
    return src;
  }

  const { width, quality = 70 } = options;
  const url = new URL(src);

  if (width) {
    url.searchParams.set('w', String(width));
  }

  if (!url.searchParams.get('auto')) {
    url.searchParams.set('auto', 'format');
  }

  if (!url.searchParams.get('fit')) {
    url.searchParams.set('fit', 'crop');
  }

  url.searchParams.set('q', String(quality));

  return url.toString();
};

export const getOptimizedSrcSet = (src, widths = [], quality = 70) => {
  if (!isOptimizableImage(src) || widths.length === 0) {
    return undefined;
  }

  return widths
    .map((width) => `${getOptimizedImageUrl(src, { width, quality })} ${width}w`)
    .join(', ');
};
