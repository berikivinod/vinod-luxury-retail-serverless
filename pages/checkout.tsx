import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import addresses from "@/data/addresses.json";

import styles from "@/styles/Checkout.module.css";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { useAuthContext } from "@/context/AuthContext";
import useCart from "@/hooks/useCart";

import { Address } from "@/types/address";

import { placeOrder } from "@/services/checkout";

export default function Checkout() {

    const router = useRouter();

    const {
        user,
        loading: authLoading,
    } = useAuthContext();

    const {
        cart,
        refreshCart,
    } = useCart();

    const [selectedAddress, setSelectedAddress] =
        useState<Address | null>(null);

    useEffect(() => {

        if (authLoading) {
            return;
        }

        if (!user) {

            router.push("/");

            return;

        }

        const userAddresses =
            (addresses as Address[]).filter(

                (address) =>

                    address.userId === user.id

            );

        const defaultAddress =
            userAddresses.find(

                (address) =>

                    address.isDefault

            );

        setSelectedAddress(
            defaultAddress || null
        );

    }, [
        authLoading,
        user,
        router,
    ]);

    const subtotal = useMemo(

        () =>

            cart.items.reduce(

                (sum, item) =>

                    sum +
                    item.price *
                    item.quantity,

                0

            ),

        [cart]

    );

    const tax =
        subtotal * 0.08;

    const total =
        subtotal + tax;

    if (authLoading) {

        return null;

    }

    if (!user) {

        return null;

    }

    const handlePlaceOrder = async () => {

        if (cart.items.length === 0) {

            return;

        }

        try {

            const result =
                await placeOrder(
                    user.id
                );

            await refreshCart();

            router.push({

                pathname:
                    "/order-confirmation",

                query: {

                    orderId:
                        result.orderId,

                    orderDate:
                        result.orderDate,

                    status:
                        result.status,

                    total:
                        result.total,

                },

            });

        } catch (error) {

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

                        {selectedAddress ? (

                            <div className={styles.card}>

                                <p>

                                    {selectedAddress.firstName}{" "}

                                    {selectedAddress.lastName}

                                </p>

                                <p>

                                    {selectedAddress.street}

                                </p>

                                <p>

                                    {selectedAddress.city},{" "}

                                    {selectedAddress.state}{" "}

                                    {selectedAddress.zip}

                                </p>

                            </div>

                        ) : (

                            <div className={styles.card}>

                                <p>

                                    No default shipping address found.

                                </p>

                            </div>

                        )}

                    </div>

                    <div>

                        <h2>
                            Order Summary
                        </h2>

                        <div className={styles.card}>

                            {cart.items.length === 0 ? (

                                <p>
                                    Your shopping bag is empty.
                                </p>

                            ) : (

                                <>

                                    {cart.items.map((item) => (

                                        <div
                                            key={item.productId}
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                marginBottom: "12px",
                                            }}
                                        >

                                            <div>

                                                <strong>

                                                    {item.name}

                                                </strong>

                                                <br />

                                                Qty: {item.quantity}

                                            </div>

                                            <div>

                                                $

                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toFixed(2)}

                                            </div>

                                        </div>

                                    ))}

                                    <hr />

                                    <p>

                                        Subtotal: $

                                        {subtotal.toFixed(2)}

                                    </p>

                                    <p>

                                        Tax: $

                                        {tax.toFixed(2)}

                                    </p>

                                    <h3>

                                        Total: $

                                        {total.toFixed(2)}

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

                                </>

                            )}

                        </div>

                    </div>

                </div>

            </div>

            <Footer />

        </>

    );

}