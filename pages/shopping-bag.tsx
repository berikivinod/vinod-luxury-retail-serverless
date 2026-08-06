import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import styles from "@/styles/ShoppingBag.module.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useCart from "@/hooks/useCart";

import { CartItem } from "@/types/cart";
import { useAuthContext } from "@/context/AuthContext";

export default function ShoppingBag() {

    const router = useRouter();
    const {
    user,
    loading: authLoading,
} = useAuthContext();

    const {
        cart,
        addItem,
        updateItem,
        removeItem,
    } = useCart();


    const [savedItems, setSavedItems] =
        useState<CartItem[]>([]);

    useEffect(() => {

    if (authLoading) {

        return;

    }

    if (!user) {

        router.push("/");

        return;

    }

    const saved: CartItem[] =
        JSON.parse(

            localStorage.getItem(

                `saved_${user.id}`

            ) || "[]"

        );

    setSavedItems(saved);

}, [
    authLoading,
    user,
    router,
]);

    const updateQuantity = async (

        productId: number,

        change: number

    ) => {

        const item =
            cart.items.find(
                (i) =>
                    i.productId === productId
            );

        if (!item) {

            return;

        }

        const newQuantity =
            item.quantity + change;

        if (newQuantity <= 0) {

            await handleRemoveItem(
                productId
            );

            return;

        }

        try {

            await updateItem(

                productId,

                newQuantity

            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to update quantity."
            );

        }

    };

    const handleRemoveItem =
        async (
            productId: number
        ) => {

            try {

                await removeItem(productId);

            } catch (error) {

                console.error(error);

                alert(
                    "Unable to remove item."
                );

            }

        };

    const moveToSaved =
        async (
            item: CartItem
        ) => {

            if (!user) {

                return;

            }

            const saved: CartItem[] =
                JSON.parse(

                    localStorage.getItem(

                        `saved_${user.id}`

                    ) || "[]"

                );

            const exists =
                saved.some(

                    (p) =>

                        p.productId ===
                        item.productId

                );

            if (!exists) {

                saved.push(item);

                localStorage.setItem(

                    `saved_${user.id}`,

                    JSON.stringify(saved)

                );

            }

            setSavedItems(saved);

            await removeItem(
                item.productId
            );

        };

    const moveToBag =
        async (
            item: CartItem
        ) => {

            if (!user) {

                return;

            }

            await addItem(

                item.productId,

                item.quantity

            );

            const updatedSaved =
                savedItems.filter(

                    (p) =>

                        p.productId !==
                        item.productId

                );

            setSavedItems(
                updatedSaved
            );

            localStorage.setItem(

                `saved_${user.id}`,

                JSON.stringify(
                    updatedSaved
                )

            );

        };

    const subtotal =
        cart.items.reduce(

            (sum, item) =>

                sum +
                item.price *
                item.quantity,

            0

        );

    const tax =
        subtotal * 0.08;

    const grandTotal =
        subtotal + tax;


if (authLoading) {

    return null;

}

if (!user) {

    return null;

}

        return (
        <>
            <Header />

            <div className={styles.wrapper}>

                <h1>Shopping Bag</h1>

                {cart.items.length === 0 ? (

                    <div className={styles.emptyBag}>
                        Your shopping bag is empty.
                    </div>

                ) : (

                    <>

                        <div className={styles.cartItems}>

                            {cart.items.map((item: CartItem) => (

                                <div
                                    key={item.productId}
                                    className={styles.cartItem}
                                >

                                    <img
                                        src={
                                            item.image ||
                                            "/images/products/placeholder-product.jpg"
                                        }
                                        alt={item.name}
                                        className={styles.image}
                                    />

                                    <div>

                                        <h3>
                                            {item.brand}
                                        </h3>

                                        <p>
                                            {item.name}
                                        </p>

                                        <div
                                            className={styles.quantity}
                                        >

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        -1
                                                    )
                                                }
                                            >
                                                -
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.productId,
                                                        1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                        <p>
                                            $
                                            {item.price.toLocaleString()}
                                        </p>

                                        <p>
                                            Subtotal: $
                                            {(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString()}
                                        </p>

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "12px",
                                                marginTop: "10px",
                                            }}
                                        >

                                            <button
                                                className={
                                                    styles.removeButton
                                                }
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        item.productId
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                            <button
                                                className={
                                                    styles.removeButton
                                                }
                                                onClick={() =>
                                                    moveToSaved(item)
                                                }
                                            >
                                                Save For Later
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                        <div className={styles.summary}>

                            <h2>
                                Order Summary
                            </h2>

                            <p>
                                Subtotal: $
                                {subtotal.toLocaleString()}
                            </p>

                            <p>
                                Tax: $
                                {tax.toFixed(2)}
                            </p>

                            <h3>
                                Total: $
                                {grandTotal.toFixed(2)}
                            </h3>

                            <button
                                className={
                                    styles.checkoutButton
                                }
                                onClick={() =>
                                    router.push("/checkout")
                                }
                            >
                                CHECKOUT
                            </button>

                        </div>

                    </>

                )}

                {savedItems.length > 0 && (

                    <div
                        style={{
                            marginTop: "40px",
                        }}
                    >

                        <h2>
                            Saved For Later
                        </h2>

                        {savedItems.map((item: CartItem) => (

                            <div
                                key={item.productId}
                                className={styles.cartItem}
                            >

                                <img
                                    src={
                                        item.image ||
                                        "/images/products/placeholder-product.jpg"
                                    }
                                    alt={item.name}
                                    className={styles.image}
                                />

                                <div>

                                    <h3>
                                        {item.brand}
                                    </h3>

                                    <p>
                                        {item.name}
                                    </p>

                                    <p>
                                        $
                                        {item.price.toLocaleString()}
                                    </p>

                                    <button
                                        className={
                                            styles.checkoutButton
                                        }
                                        onClick={() =>
                                            moveToBag(item)
                                        }
                                    >
                                        Move To Bag
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            <Footer />

        </>
    );

}