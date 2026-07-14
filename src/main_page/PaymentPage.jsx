import React, { useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CARS } from "../data/cars";
import styles from "./PaymentPage.module.css";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit/Debit", type: "card" },
  { id: "gcash1", label: "GCash", type: "wallet" },
  { id: "gcash2", label: "GCash", type: "wallet" },
  { id: "gcash3", label: "GCash", type: "wallet" },
];

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default function PaymentPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const car = CARS.find((c) => String(c.id) === id);

  const [selectedMethod, setSelectedMethod] = useState("card");
  const [saveCard, setSaveCard] = useState(false);
  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });

  if (!car) {
    return (
      <div className={styles.page}>
        <div className={styles.stickyHeader}>
          <Navbar />
        </div>
        <div className={styles.pageContent}>
          <div className={styles.notFound}>
            <p>We couldn't find that booking.</p>
            <Link to="/showroom" className={styles.notFoundLink}>
              Back to Showroom
            </Link>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const days = state?.days ?? 3;
  const pickupDate = state?.pickupDate ?? "";
  const returnDate = state?.returnDate ?? "";
  const location = state?.location ?? "Apokon, Tagum City";
  const subtotal = state?.subtotal ?? car.price * days;
  const feesAndTaxes = state?.feesAndTaxes ?? 650;
  const addonsTotal = state?.addonsTotal ?? 0;
  const total = state?.total ?? subtotal + feesAndTaxes + addonsTotal;

  const handleCardChange = (field, value) => {
    setCard((prev) => ({ ...prev, [field]: value }));
  };

  const handlePay = () => {
    // No backend / real payment gateway yet — placeholder for PayMongo integration
    console.log("Processing payment", { car, selectedMethod, card, saveCard, total });
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => navigate(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>

          <h1 className={styles.title}>Secure Checkout</h1>

          <div className={styles.mainGrid}>
            <div className={styles.mainColumn}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Select Payment Method</h2>

                <div className={styles.methodGrid}>
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      className={`${styles.methodBtn} ${
                        selectedMethod === method.id ? styles.methodBtnActive : ""
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <span className={styles.methodIcon}>
                        {method.type === "card" ? (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="#2E7CF6" strokeWidth="1.8" />
                            <path
                              d="M8 12a4 4 0 0 1 4-4"
                              stroke="#2E7CF6"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                            <path
                              d="M15.5 9.5l1.2 1.2-1.2 1.2"
                              stroke="#2E7CF6"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className={styles.methodLabel}>{method.label}</span>
                    </button>
                  ))}
                </div>

                {selectedMethod === "card" && (
                  <div className={styles.cardForm}>
                    <div className={styles.formGrid}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="cardName">
                          Cardholder Name
                        </label>
                        <input
                          id="cardName"
                          type="text"
                          className={styles.formInput}
                          placeholder="e.g. Selsite Tortskie"
                          value={card.name}
                          onChange={(e) => handleCardChange("name", e.target.value)}
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="cardNumber">
                          Card Number
                        </label>
                        <input
                          id="cardNumber"
                          type="text"
                          inputMode="numeric"
                          className={styles.formInput}
                          placeholder="0000 0000 0000 0000"
                          value={card.number}
                          onChange={(e) => handleCardChange("number", e.target.value)}
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="expiry">
                          Expiration Date
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          className={styles.formInput}
                          placeholder="MM / YY"
                          value={card.expiry}
                          onChange={(e) => handleCardChange("expiry", e.target.value)}
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="cvc">
                          CVC / CVV
                        </label>
                        <input
                          id="cvc"
                          type="text"
                          inputMode="numeric"
                          className={styles.formInput}
                          placeholder="123"
                          value={card.cvc}
                          onChange={(e) => handleCardChange("cvc", e.target.value)}
                        />
                      </div>
                    </div>

                    <label className={styles.saveCardRow}>
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={() => setSaveCard((prev) => !prev)}
                      />
                      Save card details for future rentals securely via PayMongo Vault.
                    </label>
                  </div>
                )}

                {selectedMethod !== "card" && (
                  <div className={styles.walletNotice}>
                    You'll be redirected to complete payment securely.
                  </div>
                )}
              </section>

              <button type="button" className={styles.payBtn} onClick={handlePay}>
                Pay ₱{total.toLocaleString()}.00 via PayMongo
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <p className={styles.termsNote}>
                By clicking 'Pay', you agree to Lyka's Car Rental Terms of Service and Privacy Policy.
              </p>
            </div>

            <div className={styles.sidebar}>
              <aside className={styles.summaryCard}>
                <img src={car.images[0]} alt={car.name} className={styles.summaryImage} />

                <div className={styles.summaryBody}>
                  <h3 className={styles.summaryCarName}>{car.name}</h3>

                  <div className={styles.summaryDetails}>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Rental Period</span>
                      <span className={styles.summaryValue}>
                        {days} day{days !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Dates</span>
                      <span className={styles.summaryValue}>
                        {formatDateShort(pickupDate)} - {formatDateShort(returnDate)}
                      </span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Pick-up Location</span>
                      <span className={styles.summaryValue}>{location}</span>
                    </div>
                  </div>

                  <div className={styles.summaryBreakdown}>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Rental Rate</span>
                      <span className={styles.summaryValue}>₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Fees &amp; Taxes</span>
                      <span className={styles.summaryValue}>₱{feesAndTaxes.toLocaleString()}</span>
                    </div>
                    {addonsTotal > 0 && (
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Add-ons</span>
                        <span className={styles.summaryValue}>₱{addonsTotal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.summaryTotalRow}>
                    <span className={styles.summaryTotalLabel}>Total Amount</span>
                    <span className={styles.summaryTotalAmount}>₱{total.toLocaleString()}</span>
                  </div>
                </div>
              </aside>

              <div className={styles.helpBox}>
                <svg className={styles.helpIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M9.5 9.2a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .8-1 1.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
                </svg>
                <div>
                  <p className={styles.helpTitle}>Need help?</p>
                  <p className={styles.helpText}>
                    Call us 24/7 at 099999999 or Message on our FB Page: Lyka's Car Rental
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}