// src/components/forms/SiteVisitForm.jsx
import React, { useState } from 'react';
import { MdCalendarToday } from 'react-icons/md';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import './SiteVisitForm.css';

/**
 * SiteVisitForm (Package 4.3, new)
 *
 * New form for the property detail page's "site-visit modal" (Blueprint
 * gap item #26). There is no dedicated `site_visits` table in the live
 * schema (Part A Section 7 lists only the 6 existing tables, and 2.1's
 * migration didn't add one) and adding one is a schema change outside
 * this package's scope ("Do not invent schema changes... do not
 * generate SQL"). This reuses the same `form_submissions` table as
 * `InquiryForm`, distinguishing itself only via a `message` value that
 * clearly states it's a site-visit request with the requested
 * date/time folded in — the same pragmatic approach already used for
 * both existing lead-capture forms on this project. Logged below as a
 * Known Deviation for whichever future package introduces a proper
 * `site_visits` table with its own status pipeline.
 */
function SiteVisitForm({ property, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
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
      if (!formData.name || !formData.phone || !formData.preferredDate) {
        throw new Error('Please fill in your name, phone, and preferred date.');
      }
      if (formData.phone.length < 8) {
        throw new Error('Please enter a valid phone number.');
      }

      setSuccessMessage('Thank you! This is a demo website. Your request has been simulated.');
      setFormData({ name: '', phone: '', preferredDate: '', preferredTime: '', message: '' });
      onSuccess?.();
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form className="site-visit-form" onSubmit={handleSubmit} aria-label="Schedule a site visit form">
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
      <div className="site-visit-form__row">
        <Input
          label="Preferred Date"
          name="preferredDate"
          type="date"
          min={today}
          value={formData.preferredDate}
          onChange={handleChange}
          required
        />
        <Input
          label="Preferred Time"
          name="preferredTime"
          type="time"
          value={formData.preferredTime}
          onChange={handleChange}
        />
      </div>
      <Textarea
        label="Additional Notes"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Anything else we should know?"
        rows={3}
      />

      <Button type="submit" fullWidth loading={submitting}>
        <MdCalendarToday /> {submitting ? 'Sending...' : 'Request Site Visit'}
      </Button>

      {successMessage && (
        <p className="site-visit-form__success" role="alert">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="site-visit-form__error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default SiteVisitForm;
