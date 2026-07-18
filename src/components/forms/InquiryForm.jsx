// src/components/forms/InquiryForm.jsx
import React, { useState } from 'react';
import { MdSend } from 'react-icons/md';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import './InquiryForm.css';

/**
 * InquiryForm (Package 4.3)
 *
 * Relocated + rebuilt from `components/PropertyPriceForm.jsx` (Blueprint
 * Section 13, row 28: "Becomes components/forms/InquiryForm.jsx under
 * the new structure | Replace (relocate + rebuild)"). Rebuilt on the
 * shared `ui/Input`, `ui/Textarea`, `ui/Button` primitives (1.3) instead
 * of raw form markup, matching the equalization goal flagged in Part A
 * Section 9F. The submit logic (validation rules, success/error
 * messaging, `form_submissions` insert shape) is carried over unchanged
 * from `PropertyPriceForm.jsx` — this package doesn't touch the
 * `form_submissions` table-name/shape known deviation, only the form's
 * own markup and component composition.
 */
function InquiryForm({ property }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: `I'm interested in ${property?.name || 'this property'}. Please share price details.`,
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!formData.name || !formData.phone) {
        throw new Error('Please fill in all required fields.');
      }
      if (formData.phone.length < 8) {
        throw new Error('Please enter a valid phone number.');
      }

      setSuccessMessage('Thank you! This is a demo website. Your request has been simulated.');
      setFormData({
        name: '',
        phone: '',
        message: `I'm interested in ${property?.name || 'this property'}. Please share price details.`,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="inquiry-form" onSubmit={handleSubmit} aria-label="Property price inquiry form">
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your full name"
        required
      />
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Your phone number"
        required
      />
      <Textarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Your message"
        rows={3}
      />

      <Button type="submit" fullWidth loading={submitting}>
        <MdSend /> {submitting ? 'Sending...' : 'Request Price Details'}
      </Button>

      {successMessage && (
        <p className="inquiry-form__success" role="alert">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="inquiry-form__error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default InquiryForm;
