import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "@/components/Account/AccountSidebar";

import useAuth from "@/hooks/useAuth";

import paymentMethods from "@/data/payment-methods.json";

import styles from "@/styles/PaymentInformation.module.css";

export default function PaymentInformation() {

    const router = useRouter();

    const { user, loading } = useAuth();

    const [cards, setCards] =
        useState<any[]>([]);

    useEffect(() => {

        if (loading || !user) {
            return;
        }

        const userCards =
            paymentMethods.filter(
                (card: any) =>
                    card.userId === user.id
            );

        setCards(userCards);

    }, [loading, user]);

    if (loading) {

        return (
            <>
                <Header />

                <div
                    style={{
                        padding: "80px",
                        textAlign: "center",
                        fontSize: "22px",
                    }}
                >
                    Loading your payment methods...
                </div>

                <Footer />
            </>
        );

    }

    if (!user) {
        return null;
    }

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

                    <button
                        className={styles.addButton}
                        onClick={() =>
                            alert(
                                "Add Payment Method drawer will be implemented in the next phase."
                            )
                        }
                    >
                        ADD PAYMENT METHOD
                    </button>

                    <div className={styles.cardList}>

                        {cards.length === 0 && (

                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "60px 20px",
                                    color: "#666",
                                }}
                            >

                                <h3>
                                    No payment methods found
                                </h3>

                                <p>
                                    Add your first payment method.
                                </p>

                            </div>

                        )}

                        {cards.map((card) => (

                            <div
                                key={card.id}
                                className={styles.card}
                            >

                                <div className={styles.cardHeader}>

                                    <h3>
                                        {card.cardType}
                                    </h3>

                                    {card.isDefault && (

                                        <span>
                                            Default
                                        </span>

                                    )}

                                </div>

                                <p>
                                    {card.cardNumber}
                                </p>

                                <p>
                                    Expires: {card.expiryMonth}/
                                    {card.expiryYear}
                                </p>

                                <p>
                                    {card.nameOnCard}
                                </p>

                                <div className={styles.actions}>

                                    <button
                                        onClick={() =>
                                            alert(
                                                "Edit Payment Method drawer will be implemented in the next phase."
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            alert(
                                                "Delete Payment Method feature will be implemented in the next phase."
                                            )
                                        }
                                    >
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