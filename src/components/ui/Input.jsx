import React, { useId } from 'react';
import './Input.css';

/**
 * Input — shared labeled text-input primitive.
 *
 * Replaces the ad-hoc, per-form input markup found across ContactUs,
 * AboutUs, AdminLogin, AdminRegister, PropertyPriceForm, and the admin
 * modules' add/edit forms (Section 9F).
 */
function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  className = '',
  inputClassName = '',
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  const wrapperClassNames = [
    'ui-field',
    fullWidth ? 'ui-field--full' : '',
    error ? 'ui-field--error' : '',
    disabled ? 'ui-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassNames}>
      {label && (
        <label htmlFor={inputId} className="ui-field__label">
          {label}
          {required && <span className="ui-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`ui-field__input ${inputClassName}`}
        {...rest}
      />
      {helperText && !error && (
        <p id={helperId} className="ui-field__helper">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="ui-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
