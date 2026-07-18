import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import styles from "@/styles/OrderDetails.module.css";

export default function OrderDetails() {

    const router = useRouter();

    const { orderId } = router.query;

    const [order, setOrder] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!router.isReady || !orderId) return;

        const fetchOrder = async () => {

    try {

        setLoading(true);

        setError("");

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_PRODUCTS_API}/orders/${orderId}`
        );

        if (!response.ok) {
            throw new Error("Order not found.");
        }

        const orderResponse = await response.json();

        console.log("Status:", response.status);
        console.log("Order API Response:", orderResponse);

        setOrder(orderResponse);

    }
    catch (err: any) {

        console.error(err);

        setError(err.message || "Unable to load order.");

    }
    finally {

        setLoading(false);

    }

};

        fetchOrder();

    }, [router.isReady, orderId]);

    if (loading) {

        return (
            <>
                <Header />

                <div className={styles.notFound}>
                    Loading order...
                </div>

                <Footer />
            </>
        );

    }

    if (error || !order) {

        return (
            <>
                <Header />

                <div className={styles.notFound}>
                    {error || "Order Not Found"}
                </div>

                <Footer />
            </>
        );

    }

    return (

        <>

            <Header />

            <div className={styles.wrapper}>

                <button
                    className={styles.backButton}
                    onClick={() => router.push("/order-history")}
                >
                    ← Back to Orders
                </button>

                <h1>Order Details</h1>

                <div className={styles.orderReference}>
                    Order #{order.orderId}
                </div>

                <div className={styles.summaryCard}>

                    <div>

                        <strong>Status</strong>

                        <p
                            className={
                                styles[
                                order.status.toLowerCase()
                                ]
                            }
                        >
                            {order.status}
                        </p>

                    </div>

                    <div>

                        <strong>Order Date</strong>

                        <p>
                            {new Date(
                                order.orderDate
                            ).toLocaleString()}
                        </p>

                    </div>

                    <div>

                        <strong>Channel</strong>

                        <p>
                            {order.channel || "Online"}
                        </p>

                    </div>

                    <div>

                        <strong>Tracking</strong>

                        <p>
                            {order.trackingNumber || "Pending"}
                        </p>

                    </div>

                </div>

                <h2>Items Purchased</h2>

                {order.items?.map((item: any) => (

                    <div
                        key={item.productId}
                        className={styles.productCard}
                    >

                        <Image
                            src={item.image}
                            alt={item.productName}
                            width={150}
                            height={180}
                            className={styles.productImage}
                        />

                        <div className={styles.productInfo}>

                            <h3>
                                {item.productName}
                            </h3>

                            <p>
                                Brand: {item.brand}
                            </p>

                            <p>
                                Quantity: {item.quantity}
                            </p>

                            <p>
                                Price: ${item.price}
                            </p>

                            <p>
                                Line Total: ${item.lineTotal}
                            </p>

                        </div>

                    </div>

                ))}
                                <div style={{ marginBottom: "40px" }}>
                    <button className={styles.primaryButton}>
                        REORDER ITEMS
                    </button>
                </div>

                <h2>Shipping Information</h2>

                <div className={styles.infoCard}>

                    {order.shippingAddress ? (

                        <p>
                            {order.shippingAddress.street}
                            <br />
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zip}
                        </p>

                    ) : (

                        <p>
                            Shipping address not available.
                        </p>

                    )}

                </div>

                <h2>Payment Method</h2>

                <div className={styles.infoCard}>

                    {order.paymentMethod || "Not Available"}

                </div>

                <h2>Tracking Information</h2>

                <div className={styles.infoCard}>

                    {order.trackingNumber || "Pending"}

                </div>

                {order.store && (

                    <>

                        <h2>Store Location</h2>

                        <div className={styles.infoCard}>

                            {order.store}

                        </div>

                    </>

                )}

                <h2>Order Totals</h2>

                <div className={styles.infoCard}>

                    <p>

                        Subtotal: $

                        {Number(order.subtotal).toFixed(2)}

                    </p>

                    <p>

                        Tax: $

                        {Number(order.tax).toFixed(2)}

                    </p>

                    <p>

                        Shipping: $

                        {Number(order.shipping).toFixed(2)}

                    </p>

                    <p>

                        <strong>

                            Total: $

                            {Number(order.total).toFixed(2)}

                        </strong>

                    </p>

                </div>

            </div>

            <Footer />

        </>

    );

}