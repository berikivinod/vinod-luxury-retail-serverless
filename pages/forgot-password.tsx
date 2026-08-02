import { useState } from "react";
import { useRouter } from "next/router";

import AuthLayout from "@/components/Auth/AuthLayout";
import { forgotPassword } from "@/services/auth";

import styles from "@/styles/Register.module.css";

export default function ForgotPassword() {

    const router = useRouter();

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async () => {

        setError("");

        if (!email) {

            setError(
                "Please enter your email."
            );

            return;

        }

        try {

            setLoading(true);

            await forgotPassword(email);

            router.push({

                pathname:
                    "/reset-password",

                query: {
                    email,
                },

            });

        } catch (err: any) {

            setError(
                err.message ||
                "Unable to send verification code."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout
            title="Forgot Password"
        >

            <div
                className={styles.container}
            >

                <p
                    style={{
                        marginBottom: 30,
                        color: "#666",
                    }}
                >
                    Enter your email address.
                    We'll send you a verification
                    code to reset your password.
                </p>

                <label>
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                {

                    error &&

                    <div
                        style={{
                            color: "red",
                            marginTop: 15,
                            marginBottom: 20,
                        }}
                    >
                        {error}
                    </div>

                }

                <button
                    className={
                        styles.registerButton
                    }
                    onClick={
                        handleSubmit
                    }
                    disabled={loading}
                >

                    {

                        loading

                            ? "SENDING..."

                            : "SEND VERIFICATION CODE"

                    }

                </button>

            </div>

        </AuthLayout>

    );

}