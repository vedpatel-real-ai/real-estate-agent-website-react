// src/components/NavigationBar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaBuilding,
  FaBlog,
  FaEnvelope,
  FaUsers,
  FaWhatsapp,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import Button from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import "./NavigationBar.css";

// Public inquiry number, reused from the same one already shown on
// ContactUs.jsx. This is a temporary hardcode for Package 3.1 (no data
// layer exists yet for this package to depend on) — it should be
// replaced by the `site_settings.whatsapp_number`-driven value once
// Package 3.3's data hooks and Package 4.1's shared `WhatsAppButton`
// component land.
const WHATSAPP_NUMBER = "919876543210";
const WHATSAPP_MESSAGE =
  "Hi, I'm interested in DreamSpace Properties listings.";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Auth & Favourites Architecture Plan §5: "My Account" entry, reached
  // once a session exists; otherwise a plain "Sign In" link to the new
  // shared login page (Phase C). isLoading is intentionally not checked
  // here — showing "Sign In" for the brief initial session check is a
  // better default than nothing rendering at all.
  const { isAuthenticated } = useAuth();

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const navLinks = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/about-us", label: "About Us", icon: <FaInfoCircle /> },
    { to: "/properties", label: "Properties", icon: <FaBuilding /> },
    { to: "/our-team", label: "Our Team", icon: <FaUsers /> },
    { to: "/blog", label: "Blog", icon: <FaBlog /> },
    { to: "/contact-us", label: "Contact Us", icon: <FaEnvelope /> },
  ];

  return (
    <>
      {menuOpen && (
        <button
          type="button"
          className="navbar-overlay"
          aria-label="Close navigation"
          onClick={closeMenu}
        />
      )}

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>
            DreamSpace <span>Properties</span>
          </Link>
        </div>
        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation-menu"
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
        <ul
          id="mobile-navigation-menu"
          className={`navbar-menu ${menuOpen ? "active" : ""}`}
        >
          {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeMenu}
              >
                <span className="nav-icon">{icon}</span>
                <span className="nav-label">{label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to={isAuthenticated ? "/dashboard" : "/login"}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              <span className="nav-icon">
                <FaUserCircle />
              </span>
              <span className="nav-label">
                {isAuthenticated ? "My Account" : "Sign In"}
              </span>
            </NavLink>
          </li>
          <li className="navbar-whatsapp-item">
            <Button
              as="a"
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="small"
              className="navbar-whatsapp-btn"
              aria-label="Chat with DreamSpace Properties on WhatsApp (opens in a new tab)"
              onClick={closeMenu}
            >
              <FaWhatsapp className="nav-icon" aria-hidden="true" />
              <span className="nav-label">WhatsApp</span>
            </Button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavigationBar;
