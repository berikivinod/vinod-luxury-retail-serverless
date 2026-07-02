import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import styles from "@/styles/OrderConfirmation.module.css";

import { useRouter } from "next/router";

export default function OrderConfirmation() {
  const router = useRouter();

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        <h1>
          Thank You For Your Order
        </h1>

        <p>
          Your order has been
          successfully placed.
        </p>

        <button
          onClick={() =>
            router.push(
              "/order-history"
            )
          }
          className={
            styles.button
          }
        >
          VIEW ORDER HISTORY
        </button>
      </div>

      <Footer />
    </>
  );
}