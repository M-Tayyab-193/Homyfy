import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  icon: Icon,
  helperText,
  autoComplete,
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}

        {/* Input Field */}
        <motion.input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          className={`
            w-full px-4 py-3 rounded-lg border transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
              : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-[#0F1520]'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            focus:outline-none
          `}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        />

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F1520] rounded p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}

        {/* Focus Ring Animation */}
        {isFocused && !error && (
          <motion.div
            layoutId="focus-ring"
            className="absolute inset-0 rounded-lg border-2 border-[#0F1520] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <motion.p
          id={`${name}-error`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <span className="text-red-500">⚠</span>
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default FormInput
