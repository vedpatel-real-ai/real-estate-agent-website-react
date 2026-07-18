import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Modal — shared dialog primitive.
 *
 * Unifies the two independent modal implementations previously found in
 * `PropertyModule` (`.modal-overlay`/`.modal-card` edit modal) and
 * `PropertyDetail` (contact-form modal) — see Section 9F. Closes on
 * overlay click and Escape, and restores focus to the previously
 * focused element on close.
 *
 * Sizes: small | medium | large
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  className = '',
}) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // Keep the latest onClose in a ref instead of the effect's dependency
  // array. Callers (e.g. TestimonialsModule/PropertyModule/etc.) define
  // their close handler inline in the component body, so it's a new
  // function reference on every parent re-render (including every
  // keystroke in an open modal's form). If `onClose` stayed in the
  // effect's deps below, that would tear down and re-run the
  // focus-management effect on every keystroke — restoring focus to the
  // pre-open element and then re-focusing the dialog container, which is
  // what was stealing focus from form inputs after each typed character.
  // Depending only on `isOpen` means this effect now runs solely on
  // open/close, not on every render of the parent.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return createPortal(
    <div className="ui-modal-overlay" onMouseDown={handleOverlayClick}>
      <div
        className={`ui-modal ui-modal--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="ui-modal__header">
          {title && (
            <h2 id={titleId} className="ui-modal__title">
              {title}
            </h2>
          )}
          <button
            type="button"
            className="ui-modal__close"
            onClick={() => onClose?.()}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        <div className="ui-modal__body">{children}</div>
        {footer && <div className="ui-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
