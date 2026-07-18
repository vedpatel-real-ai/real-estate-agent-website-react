// src/components/forms/ContactForm.jsx
import React, { useState } from 'react';
import { MdSend } from 'react-icons/md';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import './ContactForm.css';

/**
 * ContactForm (Package 4.5)
 *
 * Single shared contact-form component, replacing the two independent,
 * drifted copies previously hand-rolled in `pages/ContactUs.jsx` and
 * `pages/AboutUs.jsx` (Blueprint Section 13, row 4.5: "Duplicate
 * contact form removed from About" — the fix for this criterion is to
 * delete About's own form entirely and have both pages that still need
 * a contact form share this one component, matching the Section 9F
 * equalization goal already applied to `InquiryForm` in 4.3).
 *
 * Rebuilt on the shared `ui/Input`, `ui/Textarea`, `ui/Button`
 * primitives (1.3) — `ui/Input`'s own header comment explicitly lists
 * "ContactUs, AboutUs" among the ad-hoc forms it was built to replace.
 *
 * Submits to the same `form_submissions` table already used by
 * `InquiryForm` and `SiteVisitForm`, using the columns already present
 * in the live schema (`name`, `email`, `phone`, `subject`, `message`).
 * No new column added, no `form_submissions`-shape deviation touched
 * (that known deviation belongs to Package 2.1, not this package).
 */
function ContactForm({
  defaultSubject = '',
  heading = 'Get in Touch',
  description = 'Have questions about listings, property viewings, or partnerships? Send us a message below.',
  className = '',
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: defaultSubject,
    message: '',
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
      if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        throw new Error('Please fill in all required fields.');
      }

      setSuccessMessage('Thank you! This is a demo website. Your request has been simulated.');
      setFormData({ name: '', email: '', phone: '', subject: defaultSubject, message: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`contact-form-card ${className}`}>
      {heading && <h2 className="contact-form-card__heading">{heading}</h2>}
      {description && <p className="contact-form-card__description">{description}</p>}

      <form className="contact-form-card__form" onSubmit={handleSubmit} aria-label="Contact form">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 1234567890"
          required
        />
        <Input
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Brief subject"
        />
        <Textarea
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          rows={5}
          required
        />

        <Button type="submit" fullWidth loading={submitting}>
          <MdSend /> {submitting ? 'Sending...' : 'Send Message'}
        </Button>

        {successMessage && (
          <p className="contact-form-card__success" role="alert">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="contact-form-card__error" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}

export default ContactForm;
