import { useRouter } from "next/router";
import { useState } from "react";

import AuthLayout from "@/components/Auth/AuthLayout";
import { confirmForgotPassword } from "@/services/auth";

import styles from "@/styles/Register.module.css";

export default function ResetPassword() {

    const router = useRouter();

    const { email } = router.query;

    const [code, setCode] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const handleReset = async () => {

        setError("");
        setMessage("");

        if (
            !code ||
            !password ||
            !confirmPassword
        ) {

            setError(
                "Please complete all fields."
            );

            return;

        }

        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;

        }

        try {

            setLoading(true);

            await confirmForgotPassword(

                String(email),

                code,

                password

            );

            setMessage(
                "Password reset successfully! Redirecting..."
            );

            setTimeout(() => {

                router.push("/");

            }, 2000);

        } catch (err: unknown) {

            if (err instanceof Error) {

                setError(err.message);

            } else {

                setError(
                    "Unable to reset password."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout title="Reset Password">

            <div className={styles.container}>

                <p
                    style={{
                        marginBottom: 30,
                        color: "#666",
                    }}
                >
                    Enter the verification code sent to
                    <strong> {email}</strong>
                    {" "}and choose a new password.
                </p>

                <label>
                    Verification Code
                </label>

                <input
                    type="text"
                    value={code}
                    onChange={(e) =>
                        setCode(
                            e.target.value
                        )
                    }
                />

                <label>
                    New Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                />

                <label>
                    Confirm Password
                </label>

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                />

                {message && (

                    <div
                        style={{
                            color: "green",
                            marginBottom: 20,
                        }}
                    >
                        {message}
                    </div>

                )}

                {error && (

                    <div
                        style={{
                            color: "red",
                            marginBottom: 20,
                        }}
                    >
                        {error}
                    </div>

                )}

                <button
                    className={styles.registerButton}
                    onClick={handleReset}
                    disabled={loading}
                >

                    {loading
                        ? "RESETTING..."
                        : "RESET PASSWORD"}

                </button>

            </div>

        </AuthLayout>

    );

}