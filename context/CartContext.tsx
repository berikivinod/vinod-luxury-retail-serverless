import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";

import { Cart } from "@/types/cart";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
} from "@/services/cart";

import { useAuthContext } from "@/context/AuthContext";

interface CartContextType {

    cart: Cart;

    cartCount: number;

    loading: boolean;

    refreshCart: () => Promise<void>;

    addItem: (
        productId: number,
        quantity: number
    ) => Promise<void>;

    updateItem: (
        productId: number,
        quantity: number
    ) => Promise<void>;

    removeItem: (
        productId: number
    ) => Promise<void>;

}

const CartContext =
    createContext<CartContextType | undefined>(
        undefined
    );

interface Props {
    children: ReactNode;
}

export function CartProvider({
    children,
}: Props) {

    const {
        user,
        loading: authLoading,
    } = useAuthContext();

    const [cart, setCart] =
        useState<Cart>({
            userId: "",
            items: [],
        });

    const [loading, setLoading] =
        useState(true);

    const refreshCart =
        useCallback(async () => {

            if (!user) {

                setCart({
                    userId: "",
                    items: [],
                });

                setLoading(false);

                return;

            }

            try {

                setLoading(true);

                const data =
                    await getCart(
                        String(user.id)
                    );

                setCart(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }, [user]);

    useEffect(() => {

        if (!authLoading) {

            refreshCart();

        }

    }, [
        authLoading,
        refreshCart,
    ]);

    const addItem =
        async (
            productId: number,
            quantity: number
        ) => {

            if (!user) {
                return;
            }

            const updated =
                await addToCart(
                    String(user.id),
                    productId,
                    quantity
                );

            await refreshCart();

        };

    const updateItem =
        async (
            productId: number,
            quantity: number
        ) => {

            if (!user) {
                return;
            }

            const updated =
                await updateCartItem(
                    String(user.id),
                    productId,
                    quantity
                );

            await refreshCart();

        };

    const removeItem =
        async (
            productId: number
        ) => {

            if (!user) {
                return;
            }

            const updated =
                await removeCartItem(
                    String(user.id),
                    productId
                );

            await refreshCart();

        };

    const cartCount =
        useMemo(
            () =>
                cart.items.reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                ),
            [cart]
        );

    return (

        <CartContext.Provider
            value={{

                cart,

                cartCount,

                loading,

                refreshCart,

                addItem,

                updateItem,

                removeItem,

            }}
        >

            {children}

        </CartContext.Provider>

    );

}

export function useCartContext() {

    const context =
        useContext(CartContext);

    if (!context) {

        throw new Error(
            "useCartContext must be used inside CartProvider."
        );

    }

    return context;

}