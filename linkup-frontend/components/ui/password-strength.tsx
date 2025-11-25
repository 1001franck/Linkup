import React from "react";
import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface ValidationRule {
  label: string;
  test: (password: string) => boolean;
}

const validationRules: ValidationRule[] = [
  {
    label: "Au moins 8 caractères",
    test: (password) => password.length >= 8,
  },
  {
    label: "Une majuscule",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Une minuscule",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Un chiffre",
    test: (password) => /\d/.test(password),
  },
  {
    label: "Un caractère spécial",
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export function PasswordStrength({ password, className = "" }: PasswordStrengthProps) {
  if (!password) return null;

  const getStrengthLevel = (password: string) => {
    const validRules = validationRules.filter(rule => rule.test(password));
    const percentage = (validRules.length / validationRules.length) * 100;
    
    if (percentage < 40) return { level: "weak", color: "text-red-600", bgColor: "bg-red-600" };
    if (percentage < 80) return { level: "medium", color: "text-yellow-600", bgColor: "bg-yellow-600" };
    return { level: "strong", color: "text-green-600", bgColor: "bg-green-600" };
  };

  const strength = getStrengthLevel(password);
  const validRules = validationRules.filter(rule => rule.test(password));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className={`space-y-3 ${className}`}
    >
      {/* Barre de force du mot de passe */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Force du mot de passe</span>
          <span className={`font-medium ${strength.color}`}>
            {strength.level === "weak" && "Faible"}
            {strength.level === "medium" && "Moyen"}
            {strength.level === "strong" && "Fort"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(validRules.length / validationRules.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className={`h-2 rounded-full ${strength.bgColor}`}
          />
        </div>
      </div>

      {/* Liste des critères */}
      <div className="space-y-1">
        {validationRules.map((rule, index) => {
          const isValid = rule.test(password);
          return (
            <motion.div
              key={rule.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center space-x-2 text-xs transition-colors ${
                isValid ? "text-green-600" : "text-gray-400"
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 + 0.1 }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isValid ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <span>{rule.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
