import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  shake?: boolean;
  ariaLabel?: string;
}

interface TokenInputInternalProps extends TokenInputProps {
  isDarkMode?: boolean;
}

export const TokenInput = React.memo(({ value, onChange, onComplete, disabled, error, shake, ariaLabel, isDarkMode = true }: TokenInputInternalProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focused, setFocused] = useState<number>(-1);

  useEffect(() => {
    // Auto-focus first empty box on mount
    if (!disabled) {
      const firstEmptyIndex = value.length;
      if (firstEmptyIndex < 6 && inputRefs.current[firstEmptyIndex]) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  }, [disabled, value.length]);

  const handleChange = useCallback((index: number, digit: string) => {
    if (disabled) return;

    // Only allow digits
    const sanitized = digit.replace(/[^0-9]/g, '');
    
    if (sanitized.length === 0) {
      // Handle backspace/delete
      const newValue = value.substring(0, index) + value.substring(index + 1);
      onChange(newValue);
      return;
    }

    if (sanitized.length === 1) {
      // Single digit entry
      const newValue = value.substring(0, index) + sanitized + value.substring(index + 1);
      onChange(newValue);
      
      // Auto-advance to next box
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if complete
      if (newValue.length === 6 && onComplete) {
        onComplete(newValue);
      }
    } else if (sanitized.length === 6) {
      // Handle paste of full 6 digits
      onChange(sanitized);
      inputRefs.current[5]?.focus();
      if (onComplete) {
        onComplete(sanitized);
      }
    }
  }, [disabled, value, onChange, onComplete]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous box on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [disabled, value]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/[^0-9]/g, '').substring(0, 6);
    
    if (digits.length === 6) {
      onChange(digits);
      inputRefs.current[5]?.focus();
      if (onComplete) {
        onComplete(digits);
      }
    }
  }, [onChange, onComplete]);

  const handleFocus = useCallback((index: number) => setFocused(index), []);
  const handleBlur = useCallback(() => setFocused(-1), []);

  return (
    <motion.div 
      className="flex gap-2 justify-center"
      role="group"
      aria-label={ariaLabel || "Enter 6 digits"}
      animate={shake ? {
        x: [0, -10, 10, -10, 10, 0],
      } : {}}
      transition={{ duration: 0.4 }}
    >
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <motion.input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          disabled={disabled}
          className="text-center"
          style={{
            width: '52px',
            height: '60px',
            fontSize: '26px',
            fontWeight: '700',
            borderRadius: '12px',
            border: 'none',
            outline: 'none',
            backgroundColor: disabled 
              ? (isDarkMode ? 'rgba(12, 28, 43, 0.4)' : 'rgba(243, 244, 246, 0.7)')
              : (isDarkMode ? 'rgba(12, 28, 43, 0.7)' : 'rgba(255, 255, 255, 0.85)'),
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: error 
              ? (isDarkMode 
                  ? '0 0 16px rgba(239, 68, 68, 0.4), 0 0 0 2px #ef4444'
                  : '0 0 16px rgba(239, 68, 68, 0.5), 0 0 0 2px #ef4444')
              : focused === index
                ? (isDarkMode 
                    ? '0 0 18px rgba(0, 184, 217, 0.35), 0 0 0 2px #00B8D9, inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                    : '0 0 18px rgba(30, 136, 229, 0.35), 0 0 0 2px #1E88E5, inset 0 2px 4px rgba(0, 0, 0, 0.05)')
                : (isDarkMode
                    ? '0 0 0 1px rgba(0, 184, 217, 0.25), inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                    : '0 0 0 1px rgba(30, 136, 229, 0.25), inset 0 2px 4px rgba(0, 0, 0, 0.05)'),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: disabled 
              ? (isDarkMode ? '#6B7280' : '#9ca3af')
              : (isDarkMode ? '#00B8D9' : '#1E88E5'),
            cursor: disabled ? 'not-allowed' : 'text',
            willChange: 'box-shadow, transform',
            fontFamily: "'Inter', 'Roboto', monospace",
          }}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={error}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        />
      ))}
    </motion.div>
  );
});

TokenInput.displayName = 'TokenInput';
