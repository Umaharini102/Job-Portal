import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variantStyles = {
    default: 'bg-beige-100 text-charcoal-700 border-charcoal-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-coral-50 text-coral-700 border-coral-200',
    purple: 'bg-lavender-50 text-lavender-700 border-lavender-200',
    indigo: 'bg-lavender-100 text-lavender-700 border-lavender-200',
    // Status specific
    Applied: 'bg-lavender-50 text-lavender-700 border-lavender-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Shortlisted: 'bg-lavender-100 text-lavender-800 border-lavender-300',
    Interview: 'bg-brand-50 text-brand-700 border-brand-200',
    Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Rejected: 'bg-coral-50 text-coral-700 border-coral-200',
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Closed: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200',
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${style} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
