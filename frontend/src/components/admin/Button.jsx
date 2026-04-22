import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles =
    'font-medium rounded-lg transition-all flex items-center justify-center space-x-2 active:scale-95';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-primary-500/20 hover:bg-primary-500/30 text-primary-400',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
    success: 'bg-green-500/20 hover:bg-green-500/30 text-green-400',
    outline: 'border border-primary-500/50 text-primary-400 hover:bg-primary-500/10',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && <Icon size={16} />}
      <span>{children}</span>
    </motion.button>
  );
}
