import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`glass-card rounded-xl p-md shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
