import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "./AccountSidebar";

import useAuth from "@/hooks/useAuth";

import styles from "./AccountLayout.module.css";

interface Props {
    activePage:
        | "account"
        | "orders"
        | "address"
        | "payment"
        | "favorites"
        | "style"
        | "store";

    children: React.ReactNode;
}

export default function AccountLayout({
    activePage,
    children,
}: Props) {

    const { user, loading } = useAuth();

    if (loading) {
        return (
            <>
                <Header />

                <div className={styles.loading}>
                    Loading your account...
                </div>

                <Footer />
            </>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Header />

            <div className={styles.wrapper}>

                <AccountSidebar
                    user={user}
                    activePage={activePage}
                />

                <div className={styles.content}>
                    {children}
                </div>

            </div>

            <Footer />

        </>
    );
}