import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        {/* Customer Service */}
        <div className={styles.column}>
          <h3>Customer Service</h3>

          <a href="#">Track an Order</a>
          <a href="#">Shipping & Delivery</a>
          <a href="#">Returns</a>
          <a href="#">Pay My Credit Card</a>
          <a href="#">Services of VLR</a>
          <a href="#">Assistance</a>
        </div>

        {/* Stores */}
        <div className={styles.column}>
          <h3>Stores & Corporate</h3>

          <a href="#">Store Locations & Events</a>
          <a href="#">About Us</a>
          <a href="#">Investor Relations</a>
          <a href="#">Press Inquiries</a>
          <a href="#">Careers</a>
        </div>

        {/* Explore */}
        <div className={styles.column}>
          <h3>Explore</h3>

          <a href="#">Magazine</a>
          <a href="#">Gift Cards</a>
          <a href="#">VLR Credit Card</a>
          <a href="#">Fashioned for Change</a>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h3>
            Get 30% off your next purchase when you sign up for email updates
          </h3>

          <div className={styles.signupRow}>
            <input
              type="email"
              placeholder="Enter Email Address"
            />

            <button>SIGN UP</button>
          </div>

          <p>
            *Offer only valid for new subscribers.
          </p>
        </div>
      </div>

      {/* Social */}
      <div className={styles.socialSection}>
        <span>Facebook</span>
        <span>Twitter</span>
        <span>Pinterest</span>
        <span>Instagram</span>
      </div>

      {/* App Links */}
      <div className={styles.appLinks}>
        <span>📱 Sign up for text messages</span>
        <span>📱 Download VLR App</span>
      </div>

      {/* Brands */}
      <div className={styles.brands}>
        <span>Vinod Luxury Retailer</span>
        <span>Lakshmi Retail</span>
        <span>CS Retail</span>
      </div>

      {/* Legal */}
      <div className={styles.legal}>
        <a href="#">Terms & Conditions</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Your Privacy Choices</a>
        <a href="#">Cookie Preferences</a>
        <a href="#">CA Supply Chain Transparency Act</a>
        <a href="#">Sitemap</a>
      </div>

      <div className={styles.copyright}>
        © 2026 Vinod Luxury Retailer
      </div>
    </footer>
  );
}