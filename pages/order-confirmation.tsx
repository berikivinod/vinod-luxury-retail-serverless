import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import styles from "@/styles/OrderConfirmation.module.css";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {

    const router = useRouter();

    const [order, setOrder] = useState({

        orderId: "",

        orderDate: "",

        status: "",

        total: ""

    });

    useEffect(() => {

        if (!router.isReady) {

            return;

        }

        setOrder({

            orderId: String(router.query.orderId || ""),

            orderDate: String(router.query.orderDate || ""),

            status: String(router.query.status || ""),

            total: String(router.query.total || "")

        });

    }, [router.isReady, router.query]);

    return (

        <>

            <Header />

            <div className={styles.wrapper}>

                <div className={styles.card}>

                    <div className={styles.icon}>
                        ✓
                    </div>

                    <h1>
                        Thank You!
                    </h1>

                    <p className={styles.subtitle}>
                        Your order has been placed successfully.
                    </p>

                    <div className={styles.summary}>

                        <div className={styles.row}>
                            <span>Order Number</span>
                            <strong>{order.orderId}</strong>
                        </div>

                        <div className={styles.row}>
                            <span>Order Date</span>
                            <strong>
                                {order.orderDate
                                    ? new Date(order.orderDate).toLocaleString()
                                    : ""}
                            </strong>
                        </div>

                        <div className={styles.row}>
                            <span>Status</span>
                            <strong>{order.status}</strong>
                        </div>

                        <div className={styles.row}>
                            <span>Total</span>
                            <strong>
                                ${order.total}
                            </strong>
                        </div>

                    </div>

                    <div className={styles.buttons}>

                        <button
                            className={styles.primaryButton}
                            onClick={() =>
                                router.push("/order-history")
                            }
                        >
                            VIEW ORDERS
                        </button>

                        <button
                            className={styles.secondaryButton}
                            onClick={() =>
                                router.push("/")
                            }
                        >
                            CONTINUE SHOPPING
                        </button>

                    </div>

                </div>

            </div>

            <Footer />

        </>

    );

}