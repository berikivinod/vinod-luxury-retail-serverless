import styles from "@/styles/GuestOrderHistory.module.css";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
export default function Orders() {
  return (
    <div>
      <Header />
      <div className={styles.wrapper}>

        <h1>Track an Order</h1>

        <div className={styles.columns}>

          <div className={styles.leftColumn}>
            <h2>Registered Customers</h2>

            <p className={styles.sectionDescription}>
              Sign in to check status, options,
              tracking and history for your orders.
            </p>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" />
            </div>

            <div className={styles.forgotPassword}>
              Forgot Password?
            </div>

            <button className={styles.submitButton}>
              SUBMIT
            </button>

            <div className={styles.keepSignedIn}>
              <label>
                <input type="checkbox" />
                Keep me signed in
              </label>
            </div>

            <div className={styles.policyText}>
              By continuing, you agree to our Privacy Policy
              and Terms & Conditions.
            </div>
          </div>

          <div className={styles.rightColumn}>

            <h2>Guests</h2>

            <div className={styles.tabs}>
              <span className={styles.active}>
                Online Orders
              </span>

              <span>Store Orders</span>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Order Number"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Email address"
              />
            </div>

            <div className={styles.or}>
              OR
            </div>

            <input placeholder="Phone Number" />

            <button>FIND ORDER</button>

          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}