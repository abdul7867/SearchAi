import React from 'react';
import { BookOpen, Newspaper, Code, Globe } from 'lucide-react';

const SegmentedControl = ({ 
  options = [], 
  value, 
  onChange, 
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-1.5 text-base',
    lg: 'p-2 text-lg'
  };

  const buttonSizeClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variantClasses = {
    default: 'bg-muted/30 border border-border',
    elevated: 'bg-card border border-border shadow-sm',
    minimal: 'bg-transparent border-b border-border'
  };

  const getFocusModeIcon = (mode) => {
    switch (mode) {
      case 'academic':
        return BookOpen;
      case 'news':
        return Newspaper;
      case 'technical':
        return Code;
      case 'general':
      default:
        return Globe;
    }
  };

  const getFocusModeColor = (mode) => {
    switch (mode) {
      case 'academic':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'news':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'technical':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'general':
      default:
        return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const handleOptionClick = (optionValue) => {
    if (onChange && optionValue !== value) {
      onChange(optionValue);
    }
  };

  return (
    <div className={`inline-flex rounded-xl transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon || getFocusModeIcon(option.value);
        const focusModeColor = getFocusModeColor(option.value);
        
        return (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`relative flex items-center gap-2 ${buttonSizeClasses[size]} rounded-lg font-medium transition-all duration-200 ease-out ${
              isSelected
                ? `bg-card border border-border shadow-sm scale-105 ${focusModeColor}`
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105'
            }`}
            title={option.description || option.label}
          >
            {Icon && (
              <Icon className={`${iconSizeClasses[size]} flex-shrink-0 ${
                isSelected ? 'text-current' : 'text-muted-foreground'
              }`} />
            )}
            <span className="whitespace-nowrap">{option.label}</span>
            
            {/* Selection Indicator */}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
