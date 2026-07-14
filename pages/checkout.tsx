import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import addresses from "@/data/addresses.json";

import styles from "@/styles/Checkout.module.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Checkout() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);

    const [cart, setCart] =
        useState<any[]>([]);

    const [selectedAddress, setSelectedAddress] =
        useState<any>(null);

    useEffect(() => {

    const loadCheckout = async () => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {

            router.push("/");

            return;

        }

        const currentUser =
            JSON.parse(storedUser);

        setUser(currentUser);

        try {

            const response =
                await fetch(

                    `${process.env.NEXT_PUBLIC_PRODUCTS_API}/cart?userId=${currentUser.id}`

                );

            if (!response.ok) {

                throw new Error(
                    "Unable to load cart."
                );

            }

            const cartResponse =
                await response.json();

            setCart(
                cartResponse.items || []
            );

        }
        catch (error) {

            console.error(error);

            setCart([]);

        }

        const userAddresses =
            addresses.filter(

                (address: any) =>

                    address.userId ===
                    currentUser.id

            );

        const defaultAddress =
            userAddresses.find(

                (address: any) =>

                    address.isDefault

            );

        setSelectedAddress(
            defaultAddress || null
        );

    };

    loadCheckout();

}, [router]);

    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            item.price * item.quantity,
        0
    );

    const tax = subtotal * 0.08;

    const total = subtotal + tax;

    if (!user) return null;

    const handlePlaceOrder = async () => {

    if (!user || cart.length === 0) {
        return;
    }

    try {

        const response =
            await fetch(

                `${process.env.NEXT_PUBLIC_PRODUCTS_API}/orders`,

                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        userId: user.id

                    })

                }

            );

        if (!response.ok) {

            throw new Error(
                "Unable to place order."
            );

        }

        const result =
            await response.json();

        setCart([]);

        localStorage.removeItem(
            `cart_${user.id}`
        );

        window.dispatchEvent(
            new Event("cartUpdated")
        );

        router.push(

            `/order-confirmation?orderId=${result.orderId}`

        );

    }
    catch (error) {

        console.error(error);

        alert(
            "Unable to place order."
        );

    }

};

    return (
        <>
            <Header />

            <div className={styles.wrapper}>
                <h1>Checkout</h1>

                <div className={styles.grid}>
                    <div>
                        <h2>
                            Shipping Address
                        </h2>

                        {selectedAddress && (
                            <div
                                className={
                                    styles.card
                                }
                            >
                                <p>
                                    {
                                        selectedAddress.firstName
                                    }{" "}
                                    {
                                        selectedAddress.lastName
                                    }
                                </p>

                                <p>
                                    {
                                        selectedAddress.street
                                    }
                                </p>

                                <p>
                                    {
                                        selectedAddress.city
                                    }
                                    ,{" "}
                                    {
                                        selectedAddress.state
                                    }{" "}
                                    {
                                        selectedAddress.zip
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2>
                            Order Summary
                        </h2>

                        <div
                            className={
                                styles.card
                            }
                        >
                            <p>
                                Subtotal: $
                                {subtotal.toFixed(
                                    2
                                )}
                            </p>

                            <p>
                                Tax: $
                                {tax.toFixed(2)}
                            </p>

                            <h3>
                                Total: $
                                {total.toFixed(
                                    2
                                )}
                            </h3>

                            <button
                                className={
                                    styles.placeOrderButton
                                }
                                onClick={
                                    handlePlaceOrder
                                }
                            >
                                PLACE ORDER
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}