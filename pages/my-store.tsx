import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "@/components/Account/AccountSidebar";

import useAuth from "@/hooks/useAuth";

import addresses from "@/data/addresses.json";
import stores from "@/data/stores.json";

import styles from "@/styles/MyStore.module.css";

export default function MyStore() {

    const router = useRouter();

    const { user, loading } = useAuth();

    const [store, setStore] =
        useState<any>(null);

    useEffect(() => {

        if (loading || !user) {
            return;
        }

        const defaultAddress =
            addresses.find(
                (address: any) =>
                    address.userId === user.id &&
                    address.isDefault
            );

        if (!defaultAddress) {
            setStore(null);
            return;
        }

        const matchedStore =
            stores.find(
                (store: any) =>
                    store.city.toLowerCase() ===
                    defaultAddress.city.toLowerCase() &&
                    store.state.toLowerCase() ===
                    defaultAddress.state.toLowerCase()
            );

        setStore(matchedStore || null);

    }, [loading, user]);

    if (loading) {

        return (
            <>
                <Header />

                <div
                    style={{
                        padding: "80px",
                        textAlign: "center",
                        fontSize: "22px",
                    }}
                >
                    Loading your preferred store...
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
                    activePage="store"
                />

                <div className={styles.content}>

                    <h1>My Store</h1>

                    {!store ? (

                        <div className={styles.emptyState}>

                            <h3>
                                No Preferred Store
                            </h3>

                            <p>
                                We couldn't determine a
                                preferred store from your
                                default address.
                            </p>

                            <button
                                className={styles.changeStoreButton}
                                onClick={() =>
                                    alert(
                                        "Store selector drawer will be implemented in the next phase."
                                    )
                                }
                            >
                                SELECT STORE
                            </button>

                        </div>

                    ) : (

                        <div className={styles.storeGrid}>

                            <div>

                                <h2>
                                    {store.name}
                                </h2>

                                <p>
                                    {store.address}
                                    <br />
                                    {store.city}, {store.state} {store.zip}
                                </p>

                                <p>
                                    {store.phone}
                                </p>

                                <button
                                    className={styles.changeStoreButton}
                                    onClick={() =>
                                        alert(
                                            "Store selector drawer will be implemented in the next phase."
                                        )
                                    }
                                >
                                    CHANGE STORE
                                </button>

                            </div>

                            <div>

                                <h2>
                                    Store Hours
                                </h2>

                                <p>Mon: {store.hours.mon}</p>
                                <p>Tue: {store.hours.tue}</p>
                                <p>Wed: {store.hours.wed}</p>
                                <p>Thu: {store.hours.thu}</p>
                                <p>Fri: {store.hours.fri}</p>
                                <p>Sat: {store.hours.sat}</p>
                                <p>Sun: {store.hours.sun}</p>

                            </div>

                            <div>

                                <h2>
                                    Restaurants
                                </h2>

                                {store.restaurants.map(
                                    (
                                        restaurant: string,
                                        index: number
                                    ) => (

                                        <p key={index}>
                                            {restaurant}
                                        </p>

                                    )
                                )}

                            </div>

                            <div>

                                <h2>
                                    Services
                                </h2>

                                {store.services.map(
                                    (
                                        service: string,
                                        index: number
                                    ) => (

                                        <p key={index}>
                                            {service}
                                        </p>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            </div>

            <Footer />

        </>
    );

}