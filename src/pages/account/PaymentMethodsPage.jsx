import React from "react";
import Navbar from "../../components/frontpage/Navbar";
import Breadcrumb from "../../components/Breadcrumb";
import Footer from "../../components/frontpage/Footer";
import AccountSidebar from "../../components/account/AccountSidebar";
import CreditCardTile from "../../components/payment/CreditCardTile";
import { DigitalWalletCard, AddWalletCard } from "../../components/payment/DigitalWalletCard";
import BillingTable from "../../components/payment/BillingTable";
import { CARDS, DIGITAL_WALLETS, RECENT_BILLING } from "../../data/paymentMethods";
import styles from "./PaymentMethodsPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const handleEditCard = (card) => console.log("Edit card:", card.id);
const handleDeleteCard = (card) => console.log("Delete card:", card.id);
const handleSetDefaultCard = (card) => console.log("Set default:", card.id);
const handleManageWallet = (wallet) => console.log("Manage wallet:", wallet.id);
const handleConnectWallet = (wallet) => console.log("Connect wallet:", wallet.id);
const handleAddWallet = () => console.log("Add another wallet");

export default function PaymentMethodsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyHeader}>
        <Navbar />
      </div>

      <div className={styles.pageContent}>
        <div className={styles.contentWrapper}>
          <Breadcrumb
            items={[{ label: "Home", to: "/" }, { label: "Showroom", to: "/showroom" }, { label: "Profile" }]}
          />

          <div className={styles.layout}>
            <AccountSidebar onDeleteAccount={handleLogout} />

            <main className={styles.main}>
              <h1 className={styles.pageTitle}>Payment Methods</h1>

              <section className={styles.cardsGrid}>
                {CARDS.map((card) => (
                  <CreditCardTile
                    key={card.id}
                    card={card}
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                    onSetDefault={handleSetDefaultCard}
                  />
                ))}
              </section>

              <section>
                <h2 className={styles.sectionTitle}>Digital Wallets</h2>
                <div className={styles.walletsGrid}>
                  {DIGITAL_WALLETS.map((wallet) => (
                    <DigitalWalletCard
                      key={wallet.id}
                      wallet={wallet}
                      onManage={handleManageWallet}
                      onConnect={handleConnectWallet}
                    />
                  ))}
                  <AddWalletCard onAdd={handleAddWallet} />
                </div>
              </section>

              <section>
                <h2 className={styles.sectionTitle}>Recent Billing</h2>
                <div className={styles.billingCard}>
                  <BillingTable entries={RECENT_BILLING} />
                </div>
              </section>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}