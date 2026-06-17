import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
  label: string;
}

export function Button({
  variant = 'primary',
  label,
  className,
  ...rest
}: ButtonProps) {
  const buttonClasses = `btn btn-${variant} ${className ?? ''}`.trim();
  return (
    <button className={buttonClasses} {...rest}>
      {label}
    </button>
  );
}
