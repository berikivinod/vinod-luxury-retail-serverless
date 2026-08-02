import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode,
} from "react";

import { getLoggedInUser } from "@/services/auth";
import { AuthUser } from "@/types/user";

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

interface Props {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: Props) {

    const [user, setUser] =
        useState<AuthUser | null>(null);

    const [loading, setLoading] =
        useState(true);
    console.log("AuthProvider rendered");
    const refreshUser = useCallback(async () => {
        console.log("refreshUser called");
        setLoading(true);

        try {

            const currentUser =
                await getLoggedInUser();

            setUser(currentUser);

        } catch (error) {

            console.error(
                "Failed to load authenticated user:",
                error
            );

            setUser(null);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {
        console.log("AuthProvider useEffect");

        refreshUser();

    }, [refreshUser]);

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>

    );

}

export function useAuthContext() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuthContext must be used inside AuthProvider."
        );

    }

    return context;

}