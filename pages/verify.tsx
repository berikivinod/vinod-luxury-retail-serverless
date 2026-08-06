import { useRouter } from "next/router";
import { useState } from "react";

import AuthLayout from "@/components/Auth/AuthLayout";

import {
    verifyUser,
    resendVerificationCode,
} from "@/services/auth";

import styles from "@/styles/Verify.module.css";

export default function Verify() {

    const router = useRouter();

    const { email } = router.query;

    const [code, setCode] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const handleVerify = async () => {

        if (!email) {
            return;
        }

        setLoading(true);

        setMessage("");

        setError("");

        try {

            await verifyUser(
                String(email),
                code
            );

            setMessage(
                "Account verified successfully! Please sign in to continue."
            );

            setTimeout(() => {

                router.push("/");

            }, 3000);

        } catch (err: unknown) {

            if (err instanceof Error) {

                setError(err.message);

            } else {

                setError(
                    "Verification failed."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    const handleResend = async () => {

        if (!email) {
            return;
        }

        setMessage("");

        setError("");

        try {

            await resendVerificationCode(
                String(email)
            );

            setMessage(
                "A new verification code has been sent."
            );

        } catch (err: unknown) {

            if (err instanceof Error) {

                setError(err.message);

            } else {

                setError(
                    "Unable to resend verification code."
                );

            }

        }

    };

    return (

        <AuthLayout
            title="Verify Your Email"
        >

            <div className={styles.container}>

                <div className={styles.emailText}>

                    We've sent a verification code to

                    <span className={styles.email}>
                        {email}
                    </span>

                </div>

                <label className={styles.label}>
                    Verification Code
                </label>

                <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter 6-digit verification code"
                    value={code}
                    onChange={(e) =>
                        setCode(e.target.value)
                    }
                    autoComplete="one-time-code"
                />

                <button
                    className={styles.verifyButton}
                    onClick={handleVerify}
                    disabled={loading}
                >

                    {loading
                        ? "VERIFYING..."
                        : "VERIFY ACCOUNT"}

                </button>

                <div className={styles.resendSection}>

                    <div className={styles.resendText}>
                        Didn't receive the email?
                    </div>

                    <button
                        type="button"
                        className={styles.resendButton}
                        onClick={handleResend}
                    >
                        RESEND VERIFICATION CODE
                    </button>

                </div>

                {

                    message && (

                        <div className={styles.success}>
                            {message}
                        </div>

                    )

                }

                {

                    error && (

                        <div className={styles.error}>
                            {error}
                        </div>

                    )

                }

            </div>

        </AuthLayout>

    );

}