import React, { useId } from 'react';
import './Textarea.css';

/**
 * Textarea — shared labeled multi-line text primitive.
 * Sibling of `Input`; same label/error/helper-text contract.
 */
function Textarea({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  rows = 4,
  className = '',
  textareaClassName = '',
  ...rest
}) {
  const generatedId = useId();
  const textareaId = id || name || generatedId;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
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
        <label htmlFor={textareaId} className="ui-field__label">
          {label}
          {required && <span className="ui-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`ui-field__input ui-field__textarea ${textareaClassName}`}
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

export default Textarea;
