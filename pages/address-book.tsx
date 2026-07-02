import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import addresses from "@/data/addresses.json";
import styles from "@/styles/AddressBook.module.css";
import AccountSidebar from "@/components/Account/AccountSidebar";

export default function AddressBook() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [userAddresses, setUserAddresses] =
        useState<any[]>([]);

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            router.push("/");
            return;
        }

        const currentUser =
            JSON.parse(storedUser);

        setUser(currentUser);

        const filteredAddresses =
            addresses.filter(
                (address: any) =>
                    address.userId === currentUser.id
            );

        setUserAddresses(
            filteredAddresses
        );
    }, [router]);

    if (!user) return null;

    return (
        <>
            <Header />

            <div className={styles.wrapper}>
                <AccountSidebar
                    user={user}
                    activePage="account"
                />

                <div className={styles.content}>
                    <h1>Address Book</h1>

                    <button
                        className={
                            styles.addButton
                        }
                    >
                        ADD NEW ADDRESS
                    </button>

                    <div
                        className={
                            styles.addressList
                        }
                    >
                        {userAddresses.map(
                            (address) => (
                                <div
                                    key={address.id}
                                    className={
                                        styles.addressCard
                                    }
                                >
                                    <div
                                        className={
                                            styles.addressHeader
                                        }
                                    >
                                        <h3>
                                            {address.type}
                                        </h3>

                                        {address.isDefault && (
                                            <span>
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <p>
                                        {
                                            address.firstName
                                        }{" "}
                                        {
                                            address.lastName
                                        }
                                    </p>

                                    <p>
                                        {
                                            address.street
                                        }
                                    </p>

                                    <p>
                                        {address.city},{" "}
                                        {
                                            address.state
                                        }{" "}
                                        {address.zip}
                                    </p>

                                    <p>
                                        {
                                            address.phone
                                        }
                                    </p>

                                    <div
                                        className={
                                            styles.actions
                                        }
                                    >
                                        <button>
                                            Edit
                                        </button>

                                        <button>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}