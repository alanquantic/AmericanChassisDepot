import { useState, useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRule {
  id: string;
  label: string;
  labelEs: string;
  test: (password: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    labelEs: 'Al menos 8 caracteres',
    test: (pwd) => pwd.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter (A-Z)',
    labelEs: 'Una letra mayúscula (A-Z)',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter (a-z)',
    labelEs: 'Una letra minúscula (a-z)',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: 'number',
    label: 'One number (0-9)',
    labelEs: 'Un número (0-9)',
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    id: 'special',
    label: 'One special character (!@#$%^&*)',
    labelEs: 'Un carácter especial (!@#$%^&*)',
    test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  },
];

interface PasswordStrengthIndicatorProps {
  password: string;
  language?: 'en' | 'es';
  onStrengthChange?: (isStrong: boolean, score: number) => void;
  showRules?: boolean;
  minScore?: number;
}

export function PasswordStrengthIndicator({
  password,
  language = 'en',
  onStrengthChange,
  showRules = true,
  minScore = 4, // Minimum rules to pass for "strong" password
}: PasswordStrengthIndicatorProps) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const passedRules = passwordRules.filter((rule) => rule.test(password)).length;
    setScore(passedRules);
    onStrengthChange?.(passedRules >= minScore, passedRules);
  }, [password, minScore, onStrengthChange]);

  const getStrengthLabel = () => {
    if (!password) return '';
    if (score <= 1) return language === 'es' ? 'Muy débil' : 'Very Weak';
    if (score === 2) return language === 'es' ? 'Débil' : 'Weak';
    if (score === 3) return language === 'es' ? 'Regular' : 'Fair';
    if (score === 4) return language === 'es' ? 'Fuerte' : 'Strong';
    return language === 'es' ? 'Muy fuerte' : 'Very Strong';
  };

  const getStrengthColor = () => {
    if (!password) return 'bg-gray-200';
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-orange-500';
    if (score === 3) return 'bg-yellow-500';
    if (score === 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getTextColor = () => {
    if (!password) return 'text-gray-400';
    if (score <= 1) return 'text-red-500';
    if (score === 2) return 'text-orange-500';
    if (score === 3) return 'text-yellow-600';
    if (score === 4) return 'text-green-500';
    return 'text-emerald-500';
  };

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      {password && (
        <div className="space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all duration-300',
                  score >= level ? getStrengthColor() : 'bg-gray-200'
                )}
              />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className={cn('text-xs font-medium', getTextColor())}>
              {getStrengthLabel()}
            </span>
            {score < minScore && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {language === 'es' ? 'Necesita ser más segura' : 'Needs to be stronger'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rules Checklist */}
      {showRules && password && (
        <div className="space-y-1.5 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-600 mb-2">
            {language === 'es' ? 'Requisitos de contraseña:' : 'Password requirements:'}
          </p>
          {passwordRules.map((rule) => {
            const passed = rule.test(password);
            return (
              <div
                key={rule.id}
                className={cn(
                  'flex items-center gap-2 text-xs transition-colors',
                  passed ? 'text-green-600' : 'text-gray-400'
                )}
              >
                {passed ? (
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span>{language === 'es' ? rule.labelEs : rule.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Hook to validate password strength
 */
export function usePasswordStrength(password: string, minScore = 4) {
  const [isStrong, setIsStrong] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const passedRules = passwordRules.filter((rule) => rule.test(password)).length;
    setScore(passedRules);
    setIsStrong(passedRules >= minScore);
  }, [password, minScore]);

  return { isStrong, score, maxScore: passwordRules.length };
}

/**
 * Validates password strength
 * Returns array of failed rules
 */
export function validatePassword(password: string): { isValid: boolean; failedRules: string[] } {
  const failedRules = passwordRules
    .filter((rule) => !rule.test(password))
    .map((rule) => rule.label);

  return {
    isValid: failedRules.length === 0,
    failedRules,
  };
}

export default PasswordStrengthIndicator;
