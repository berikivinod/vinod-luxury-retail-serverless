import { ReactNode } from "react";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";

import styles from "@/styles/AuthLayout.module.css";

interface Props {
    title: string;
    children: ReactNode;
}

export default function AuthLayout({
    title,
    children,
}: Props) {

    const router = useRouter();

    return (

        <div className={styles.page}>

            <header className={styles.header}>

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

            </header>

            <main className={styles.card}>

                <h1>{title}</h1>

                {children}

            </main>

            <footer className={styles.footer}>

                © 2026 Vinod Luxury Retailer

                <br />

                Site Terms | Privacy Policy

            </footer>

        </div>

    );

}