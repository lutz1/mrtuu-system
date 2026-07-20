import React, { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to a real contact-form endpoint once the backend exists
    console.log("Contact form submitted:", form);
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Send us a Message</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-fullName">Full Name</label>
          <input
            id="contact-fullName"
            type="text"
            className={styles.input}
            placeholder="Selsite Tortskie"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            type="email"
            className={styles.input}
            placeholder="tortskie@gmail.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          type="text"
          className={styles.input}
          placeholder="Rental Inquiry"
          value={form.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="contact-message">Your Message</label>
        <textarea
          id="contact-message"
          className={styles.textarea}
          placeholder="Tell us how we can help..."
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>Send Message</button>
    </form>
  );
}