// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Input from './ui/Input';
import Button from './ui/Button';
import './Footer.css';

// Same temporary hardcoded number used in NavigationBar.jsx — see the
// comment there. Duplicated locally rather than factored into a shared
// file, since Package 3.1 has no "Files to Create" in its Blueprint
// scope; a shared constant belongs with the site_settings-backed
// WhatsApp infrastructure landing in Packages 3.3/4.1.
const WHATSAPP_NUMBER = '919876543210';
const WHATSAPP_MESSAGE = "Hi, I'm interested in DreamSpace Properties listings.";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail('');
    alert('Thank you! This is a demo website. Your request has been simulated.');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/our-team">Our Team</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Subscribe</h4>
          <p>Subscribe for exclusive offers and latest news.</p>
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="footer-newsletter-input"
              aria-label="Email address"
            />
            <Button type="submit" variant="primary" size="medium">
              Sign Up
            </Button>
          </form>
        </div>
        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a
              href="#"
              aria-label="DreamSpace Properties Facebook demo link"
            >
              <FaFacebookF aria-hidden="true" />
            </a>
            <a
              href="#"
              aria-label="DreamSpace Properties Instagram demo link"
            >
              <FaInstagram aria-hidden="true" />
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with DreamSpace Properties on WhatsApp (opens in a new tab)"
              className="social-icon-whatsapp"
            >
              <FaWhatsapp aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 DreamSpace Properties. Portfolio demo template.</p>
      </div>
    </footer>
  );
};

export default Footer;
