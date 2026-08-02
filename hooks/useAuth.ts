import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getLoggedInUser } from "@/services/auth";

export default function useAuth() {

    const router = useRouter();

    const [user, setUser] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadUser() {

            try {

                const currentUser =
                    await getLoggedInUser();

                setUser(currentUser);

            } catch {

                router.replace("/");

                return;

            }

            setLoading(false);

        }

        loadUser();

    }, [router]);

    return {

        user,

        loading,

    };

}