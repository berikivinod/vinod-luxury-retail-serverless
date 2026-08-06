import { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";

import { Product } from "@/types/product";

export default function useFavorites() {

    const {
        user,
        loading: authLoading,
    } = useAuthContext();

    const [favoriteIds, setFavoriteIds] =
        useState<Set<number>>(new Set());

    const [favorites, setFavorites] =
        useState<Product[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        if (authLoading) {
            return;
        }

        if (!user) {

            setLoading(false);

            return;

        }

        loadFavorites();

    }, [
        authLoading,
        user?.id,
    ]);

    async function loadFavorites() {

        if (!user) {
            return;
        }

        try {

            const response = await fetch(

                `${process.env.NEXT_PUBLIC_PRODUCTS_API}/favorites?userId=${user.id}`

            );

            if (!response.ok) {

                throw new Error(
                    "Failed to load favorites."
                );

            }

            const data: Product[] =
                await response.json();

            setFavorites(data);

            setFavoriteIds(

                new Set(

                    data.map(
                        (item) => item.id
                    )

                )

            );

        } catch (error: unknown) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    async function addFavorite(
        productId: number
    ) {

        if (!user) {
            return;
        }

        await fetch(

            `${process.env.NEXT_PUBLIC_PRODUCTS_API}/favorites`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    userId: user.id,

                    productId,

                }),

            }

        );

        await loadFavorites();

    }

    async function removeFavorite(
        productId: number
    ) {

        if (!user) {
            return;
        }

        await fetch(

            `${process.env.NEXT_PUBLIC_PRODUCTS_API}/favorites/${productId}?userId=${user.id}`,

            {

                method: "DELETE",

            }

        );

        await loadFavorites();

    }

    async function toggleFavorite(
        productId: number
    ) {

        if (favoriteIds.has(productId)) {

            await removeFavorite(
                productId
            );

        } else {

            await addFavorite(
                productId
            );

        }

    }

    return {

        favorites,

        favoriteIds,

        loading,

        addFavorite,

        removeFavorite,

        toggleFavorite,

        loadFavorites,

    };

}