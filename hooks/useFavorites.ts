import { useEffect, useState } from "react";

export default function useFavorites() {
    const [favoriteIds, setFavoriteIds] =
        useState<Set<number>>(new Set());
    const [favorites, setFavorites] =
    useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [userId, setUserId] =
        useState<string | null>(null);

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log("Logged in user:", user);
            setUserId(String(user.id));
        } else {
            setLoading(false);
        }
        
    }, []);

    useEffect(() => {
        if (!userId) return;

        loadFavorites();
    }, [userId]);

    async function loadFavorites() {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_PRODUCTS_API}/favorites?userId=${userId}`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load favorites."
                );
            }

            const data = await response.json();

setFavorites(data);

setFavoriteIds(
    new Set(
        data.map((item: any) => item.id)
    )
);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function addFavorite(productId: number) {
        if (!userId) return;

        await fetch(
            `${process.env.NEXT_PUBLIC_PRODUCTS_API}/favorites`,
            {
                method: "POST",
                body: JSON.stringify({
                    userId,
                    productId,
                }),
            }
        );

        await loadFavorites();
    }

    async function removeFavorite(productId: number) {
        if (!userId) return;

        await fetch(
            `${process.env.NEXT_PUBLIC_PRODUCTS_API}/favorites/${productId}?userId=${userId}`,
            {
                method: "DELETE",
            }
        );

        await loadFavorites();
    }

    async function toggleFavorite(productId: number) {
        console.log("toggleFavorite", productId);
        if (favoriteIds.has(productId)) {
            await removeFavorite(productId);
        } else {
            await addFavorite(productId);
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