import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "@/components/Account/AccountSidebar";
import styles from "@/styles/MyStore.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import addresses from "@/data/addresses.json";
import stores from "@/data/stores.json";

export default function MyStore() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [store, setStore] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            router.push("/");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        setUser(currentUser);

        const defaultAddress = addresses.find(
            (address: any) =>
                address.userId === currentUser.id &&
                address.isDefault
        );

        if (!defaultAddress) {
            return;
        }

        const matchedStore = stores.find(
            (store: any) =>
                store.city.toLowerCase() ===
                defaultAddress.city.toLowerCase() &&
                store.state.toLowerCase() ===
                defaultAddress.state.toLowerCase()
        );

        if (matchedStore) {
            setStore(matchedStore);
        }
    }, [router]);

    if (!user) return null;

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
                            No store found for your default address.
                        </div>
                    ) : (
                        <div className={styles.storeGrid}>
                            <div>
                                <h2>{store.name}</h2>

                                <p>
                                    {store.address}
                                    <br />
                                    {store.city}, {store.state}{" "}
                                    {store.zip}
                                </p>

                                <p>{store.phone}</p>

                                <a href="#">
                                    Change Store
                                </a>
                            </div>

                            <div>
                                <h2>Store Hours</h2>

                                <p>Mon: {store.hours.mon}</p>
                                <p>Tue: {store.hours.tue}</p>
                                <p>Wed: {store.hours.wed}</p>
                                <p>Thu: {store.hours.thu}</p>
                                <p>Fri: {store.hours.fri}</p>
                                <p>Sat: {store.hours.sat}</p>
                                <p>Sun: {store.hours.sun}</p>
                            </div>

                            <div>
                                <h2>Restaurants</h2>

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
                                <h2>Services</h2>

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