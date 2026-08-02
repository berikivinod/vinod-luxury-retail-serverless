import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import AccountLayout from "@/components/Account/AccountLayout";
import useAuth from "@/hooks/useAuth";

import addresses from "@/data/addresses.json";

import styles from "@/styles/AddressBook.module.css";

export default function AddressBook() {

    const router = useRouter();

    const { user, loading } = useAuth();

    const [userAddresses, setUserAddresses] =
        useState<any[]>([]);

    useEffect(() => {

        if (!user) return;

        const filteredAddresses =
            addresses.filter(
                (address: any) =>
                    address.userId === user.id
            );

        setUserAddresses(filteredAddresses);

    }, [user]);

    if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

    return (

        <AccountLayout activePage="address">

            <div className={styles.content}>

                <h1>Address Book</h1>

                <button
                    className={styles.addButton}
                    onClick={() =>
                        router.push("/address-book/add")
                    }
                >
                    ADD NEW ADDRESS
                </button>

                <div className={styles.addressList}>

                    {userAddresses.length === 0 && (

                        <div
                            style={{
                                textAlign: "center",
                                padding: "60px 20px",
                                color: "#666",
                            }}
                        >

                            <h3>
                                No addresses found
                            </h3>

                            <p>
                                Add your first shipping
                                or billing address.
                            </p>

                        </div>

                    )}

                    {userAddresses.map((address) => (

                        <div
                            key={address.id}
                            className={styles.addressCard}
                        >

                            <div
                                className={styles.addressHeader}
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
                                {address.firstName}{" "}
                                {address.lastName}
                            </p>

                            <p>
                                {address.street}
                            </p>

                            <p>
                                {address.city},{" "}
                                {address.state}{" "}
                                {address.zip}
                            </p>

                            <p>
                                {address.phone}
                            </p>

                            <div
                                className={styles.actions}
                            >

                                <button
                                    onClick={() =>
                                        router.push(
                                            `/address-book/edit/${address.id}`
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => {

                                        alert(
                                            "Delete Address feature will be implemented in the next phase."
                                        );

                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </AccountLayout>

    );

}