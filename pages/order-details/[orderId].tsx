import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import orders from "@/data/orders.json";
import styles from "@/styles/OrderDetails.module.css";
import Image from "next/image";

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    const storedUser =
      localStorage.getItem("user");

    let localOrders: any[] = [];

    if (storedUser) {
      const user =
        JSON.parse(storedUser);

      localOrders =
        JSON.parse(
          localStorage.getItem(
            `orders_${user.id}`
          ) || "[]"
        );
    }

    const allOrders = [
      ...orders,
      ...localOrders,
    ];

    const foundOrder =
      allOrders.find(
        (o: any) =>
          o.orderId === orderId
      );

    setOrder(foundOrder || null);
  }, [orderId]);

  if (!order) {
    return (
      <>
        <Header />

        <div className={styles.notFound}>
          Order Not Found
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
          onClick={() =>
            router.push("/order-history")
          }
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
            <p>{order.orderDate}</p>
          </div>

          <div>
            <strong>Channel</strong>
            <p>{order.channel}</p>
          </div>

          <div>
            <strong>Tracking</strong>
            <p>{order.trackingNumber}</p>
          </div>
        </div>

        <h2>Items Purchased</h2>

        {order.items.map((item: any) => (
          <div
            key={item.sku}
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
              <h3>{item.productName}</h3>

              <p>
                Brand: {item.brand}
              </p>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
                Price: ${item.price}
              </p>
            </div>
          </div>
        ))}

        <div style={{ marginBottom: "40px" }}>
          <button
            className={styles.primaryButton}
          >
            REORDER ITEMS
          </button>
        </div>

        <h2>Shipping Information</h2>

        <div className={styles.infoCard}>
          <p>
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.state}{" "}
            {order.shippingAddress.zip}
          </p>
        </div>

        <h2>Payment Method</h2>

        <div className={styles.infoCard}>
          {order.paymentMethod}
        </div>

        <h2>Tracking Information</h2>

        <div className={styles.infoCard}>
          {order.trackingNumber}
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
            {order.subtotal.toFixed(2)}
          </p>

          <p>
            Tax: $
            {order.tax.toFixed(2)}
          </p>

          <p>
            <strong>
              Total: $
              {order.total.toFixed(2)}
            </strong>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}