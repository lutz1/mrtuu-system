import React from "react";

export default function NavIcon({ name }) {
  switch (name) {
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M4.5 20c1-3.8 4.2-6 7.5-6s6.5 2.2 7.5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "bookmark":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "card":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case "gear":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.4-2.3.9a8 8 0 0 0-1.7-1L15 3.6h-4l-.4 2.4a8 8 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a8 8 0 0 0 1.7 1l.4 2.4h4l.4-2.4a8 8 0 0 0 1.7-1l2.3.9 2-3.4-2-1.5z"
            stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      );
    case "trash":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    default:
      return null;
  }
}