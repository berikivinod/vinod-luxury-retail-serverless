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
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            router.push("/");
            return;
        }

        const currentUser =
            JSON.parse(storedUser);

        setUser(currentUser);

        const storedCart =
            localStorage.getItem(
                `cart_${currentUser.id}`
            );

        if (storedCart) {
            setCart(
                JSON.parse(storedCart)
            );
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

    const handlePlaceOrder = () => {
        if (!user || cart.length === 0) {
            return;
        }

        const existingOrders = JSON.parse(
            localStorage.getItem(
                `orders_${user.id}`
            ) || "[]"
        );

        const newOrder = {
            orderId:
                "VLR" +
                Date.now(),

            userId: user.id,

            orderDate:
                new Date()
                    .toISOString()
                    .split("T")[0],

            status: "Processing",

            channel: "Online",

            trackingNumber:
                "Pending",

            paymentMethod:
                "VLR Credit Card",

            shippingAddress:
                selectedAddress,

            subtotal,

            tax,

            total,

            items: cart
        };

        existingOrders.unshift(
            newOrder
        );

        localStorage.setItem(
            `orders_${user.id}`,
            JSON.stringify(
                existingOrders
            )
        );

        localStorage.removeItem(
            `cart_${user.id}`
        );

        window.dispatchEvent(
            new Event("cartUpdated")
        );

        router.push(
            "/order-confirmation"
        );
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