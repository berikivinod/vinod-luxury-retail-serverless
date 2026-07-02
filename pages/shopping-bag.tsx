import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import styles from "@/styles/ShoppingBag.module.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ShoppingBag() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);

    const [cart, setCart] =
        useState<any[]>([]);
    const [savedItems, setSavedItems] =
        useState<any[]>([]);

    useEffect(() => {

        const loadData = async () => {

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
                        "Unable to load cart"
                    );
                }

                const cartResponse =
                    await response.json();

                setCart(
                    cartResponse.items || []
                );

            } catch (error) {

                console.error(error);

                setCart([]);

            }

            const savedItems =
                JSON.parse(
                    localStorage.getItem(
                        `saved_${currentUser.id}`
                    ) || "[]"
                );

            setSavedItems(savedItems);

        };

        loadData();

    }, [router]);

    const updateQuantity = async (
        productId: number,
        change: number
    ) => {

        const item =
            cart.find(
                (i) =>
                    i.productId === productId
            );

        if (!item) return;

        const newQuantity =
            item.quantity + change;

        try {

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_PRODUCTS_API}/cart`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            userId: String(user.id),
                            productId,
                            quantity: newQuantity
                        })
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Failed to update cart."
                );
            }

            const updatedCart =
                await response.json();

            setCart(
                updatedCart.items || []
            );

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to update quantity."
            );

        }

    };

    const removeItem = async (
        productId: number
    ) => {

        try {

            const response =
                await fetch(
                    `${process.env.NEXT_PUBLIC_PRODUCTS_API}/cart`,
                    {
                        method: "DELETE",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            userId: String(user.id),
                            productId
                        })

                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to remove item."
                );

            }

            const updatedCart =
                await response.json();

            setCart(
                updatedCart.items || []
            );

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to remove item."
            );

        }

    };

    const moveToSaved = (
        item: any
    ) => {
        const saved =
            JSON.parse(
                localStorage.getItem(
                    `saved_${user.id}`
                ) || "[]"
            );

        const exists =
            saved.some(
                (p: any) =>
                    p.id === item.productId
            );

        if (!exists) {
            saved.push(item);

            localStorage.setItem(
                `saved_${user.id}`,
                JSON.stringify(saved)
            );
        }

        const updatedCart =
            cart.filter(
                (p) =>
                    p.id !== item.productId
            );

        setCart(updatedCart);
        setSavedItems(saved);

        localStorage.setItem(
            `cart_${user.id}`,
            JSON.stringify(updatedCart)
        );

        window.dispatchEvent(
            new Event("cartUpdated")
        );
    };

    const moveToBag = (
        item: any
    ) => {
        const updatedCart = [
            ...cart,
            item
        ];

        const updatedSaved =
            savedItems.filter(
                (p) =>
                    p.id !== item.productId
            );

        setCart(updatedCart);
        setSavedItems(updatedSaved);

        localStorage.setItem(
            `cart_${user.id}`,
            JSON.stringify(updatedCart)
        );

        localStorage.setItem(
            `saved_${user.id}`,
            JSON.stringify(updatedSaved)
        );

        window.dispatchEvent(
            new Event("cartUpdated")
        );
    };



    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            item.price * item.quantity,
        0
    );

    const tax = subtotal * 0.08;

    const grandTotal =
        subtotal + tax;

    if (!user) return null;

    return (
        <>
            <Header />

            <div className={styles.wrapper}>
                <h1>Shopping Bag</h1>

                {cart.length === 0 ? (
                    <div className={styles.emptyBag}>
                        Your shopping bag is empty.
                    </div>
                ) : (
                    <>
                        <div className={styles.cartItems}>
                            {cart.map(
                                (item: any) => (
                                    <div
                                        key={item.productId}
                                        className={
                                            styles.cartItem
                                        }
                                    >
                                        <img
                                            src={
                                                item.image ||
                                                "/images/products/placeholder-product.jpg"
                                            }
                                            alt={item.name}
                                            className={
                                                styles.image
                                            }
                                        />

                                        <div>
                                            <h3>
                                                {item.brand}
                                            </h3>

                                            <p>
                                                {item.name}
                                            </p>

                                            <div
                                                className={
                                                    styles.quantity
                                                }
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
                                                    {
                                                        item.quantity
                                                    }
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
                                                    className={styles.removeButton}
                                                    onClick={() =>
                                                        removeItem(item.productId)
                                                    }
                                                >
                                                    Remove
                                                </button>

                                                <button
                                                    className={styles.removeButton}
                                                    onClick={() =>
                                                        moveToSaved(item)
                                                    }
                                                >
                                                    Save For Later
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
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
                                className={styles.checkoutButton}
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
                            marginTop: "40px"
                        }}
                    >
                        <h2>
                            Saved For Later
                        </h2>

                        {savedItems.map(
                            (item: any) => (
                                <div
                                    key={item.productId}
                                    className={
                                        styles.cartItem
                                    }
                                >
                                    <img
                                        src={
                                            item.image
                                        }
                                        alt={
                                            item.name
                                        }
                                        className={
                                            styles.image
                                        }
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
                            )
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}