import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "@/components/Account/AccountSidebar";
import paymentMethods from "@/data/payment-methods.json";
import styles from "@/styles/PaymentInformation.module.css";

export default function PaymentInformation() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    setUser(currentUser);

    const userCards = paymentMethods.filter(
      (card: any) =>
        card.userId === currentUser.id
    );

    setCards(userCards);
  }, [router]);

  if (!user) return null;

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        <AccountSidebar
          user={user}
          activePage="payment"
        />

        <div className={styles.content}>
          <h1>Payment Information</h1>

          <button className={styles.addButton}>
            ADD PAYMENT METHOD
          </button>

          <div className={styles.cardList}>
            {cards.map((card) => (
              <div
                key={card.id}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <h3>{card.cardType}</h3>

                  {card.isDefault && (
                    <span>
                      Default
                    </span>
                  )}
                </div>

                <p>{card.cardNumber}</p>

                <p>
                  Expires:
                  {card.expiryMonth}/
                  {card.expiryYear}
                </p>

                <p>
                  {card.nameOnCard}
                </p>

                <div className={styles.actions}>
                  <button>
                    Edit
                  </button>

                  <button>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}