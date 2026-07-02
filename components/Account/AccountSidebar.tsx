import { useRouter } from "next/router";
import styles from "@/styles/AccountSidebar.module.css";

type Props = {
  user: any;
  activePage: string;
};

export default function AccountSidebar({
  user,
  activePage,
}: Props) {
  const router = useRouter();

  return (
    <div className={styles.sidebar}>
      <h2>
        Hello {user.firstName} {user.lastName}
      </h2>

      <div className={styles.menu}>
        <div
          className={
            activePage === "account"
              ? styles.active
              : ""
          }
          onClick={() =>
            router.push("/account")
          }
        >
          Account Overview
        </div>

        <div
          className={
            activePage === "orders"
              ? styles.active
              : ""
          }
          onClick={() =>
            router.push("/order-history")
          }
        >
          Order History
        </div>

        <div
          className={
            activePage === "address"
              ? styles.active
              : ""
          }
          onClick={() =>
            router.push("/address-book")
          }
        >
          Address Book
        </div>

        <div
          className={
            activePage === "payment"
              ? styles.active
              : ""
          }
          onClick={() =>
            router.push(
              "/payment-information"
            )
          }
        >
          Payment Information
        </div>

        <div
          className={
            activePage === "style"
              ? styles.active
              : ""
          }
          onClick={() =>
            router.push("/style-preferences")
          }
        >
          My Style Preferences
        </div>

        <div
          className={
            activePage === "favorites"
              ? styles.active
              : ""
          }
          onClick={() =>
            router.push("/favorites")
          }
        >
          Favorites
        </div>

        <div
          className={
            activePage === "credit"
              ? styles.active
              : ""
          }
          onClick={() =>
            router.push("/Credit-VLR")
          }
        >
          VLR Credit Card
        </div>
        <div
          className={
            activePage === "store"
              ? styles.active
              : ""
          }
          onClick={() =>
            router.push("/my-store")
          }
        >
          My Store
        </div>
      </div>
    </div>
  );
}