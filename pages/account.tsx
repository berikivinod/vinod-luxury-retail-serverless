import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import styles from "@/styles/Account.module.css";
import AccountSidebar from "@/components/Account/AccountSidebar";

export default function Account() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            router.push("/");
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [router]);

    if (!user) {
        return null;
    }

    return (
        <>
            <Header />

            <div className={styles.wrapper}>
                <AccountSidebar
                    user={user}
                    activePage="account"
                />

                <div className={styles.content}>
                    <h1>Account Overview</h1>

                    <div className={styles.profileSection}>
                        <div className={styles.profileRow}>
                            <span>Name</span>

                            <span>
                                {user.firstName} {user.lastName}
                            </span>

                            <button>Edit</button>
                        </div>

                        <div className={styles.profileRow}>
                            <span>Email Address</span>

                            <span>{user.email}</span>

                            <button>Edit</button>
                        </div>

                        <div className={styles.profileRow}>
                            <span>Password</span>

                            <span>••••••••••</span>

                            <button>Edit</button>
                        </div>

                        <div className={styles.profileRow}>
                            <span>Contact Number</span>

                            <span>
                                {user.phone ||
                                    "(555) 555-5555"}
                            </span>

                            <button>Edit</button>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Order History</h2>

                        <p>
                            View your recent online and
                            in-store purchases.
                        </p>

                        <button
                            onClick={() =>
                                router.push("/order-history")
                            }
                        >
                            VIEW MORE
                        </button>
                    </div>

                    <div className={styles.section}>
                        <h2>Address Book</h2>

                        <p>
                            Manage shipping and billing
                            addresses.
                        </p>

                        <button
                            onClick={() =>
                                router.push("/address-book")
                            }
                        >
                            VIEW MORE
                        </button>
                    </div>

                    <div className={styles.section}>
                        <h2>Payment Information</h2>

                        <p>
                            Manage saved credit cards and
                            payment methods.
                        </p>

                        <button
                            onClick={() =>
                                router.push(
                                    "/payment-information"
                                )
                            }
                        >
                            VIEW MORE
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}