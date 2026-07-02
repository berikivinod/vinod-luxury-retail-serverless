// pages/register.tsx

import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
import styles from "@/styles/Register.module.css";

export default function Register() {
    const router = useRouter();
    return (
        <>

            <div className={styles.page}>
                <div className={styles.header}>

                    <button
                        className={styles.backButton}
                        onClick={() => router.push("/")}
                    >
                        <FiArrowLeft />
                        Back
                    </button>

                    <div className={styles.logo}>
                        Vinod Luxury Retailer
                    </div>

                </div>
                <div className={styles.container}>

                    <h1>Register With Us</h1>

                    <div className={styles.row}>
                        <div>
                            <label>First Name</label>
                            <input type="text" />
                        </div>

                        <div>
                            <label>Last Name</label>
                            <input type="text" />
                        </div>
                    </div>

                    <label>Email</label>
                    <input type="email" />

                    <label>Password</label>
                    <input type="password" />

                    <label>Phone Number (Optional)</label>

                    <div className={styles.phoneRow}>
                        <select>
                            <option>US +1</option>
                        </select>

                        <input type="text" />
                    </div>

                    <button className={styles.registerButton}>
                        REGISTER
                    </button>

                    <div className={styles.checkbox}>
                        <input type="checkbox" />
                        <span>Keep me signed in</span>
                    </div>

                    <div className={styles.checkbox}>
                        <input type="checkbox" />
                        <span>
                            Verify my phone number via text message and enable alerts for suspicious activity.
                        </span>
                    </div>

                    <div className={styles.footerLinks}>
                        © 2026, Vinod Luxury Retailer |
                        Site Terms and Privacy Policy |
                        Do Not Sell My Personal Information
                    </div>

                </div>
            </div>

        </>
    );
}