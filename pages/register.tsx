// pages/register.tsx

import { useState } from "react";
import { useRouter } from "next/router";

import { registerUser } from "@/services/auth";
import AuthLayout from "@/components/Auth/AuthLayout";

import styles from "@/styles/Register.module.css";

export default function Register() {

    const router = useRouter();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const handleRegister = async () => {

        setError("");

        if (
            !form.firstName ||
            !form.lastName ||
            !form.email ||
            !form.password
        ) {

            setError(
                "Please complete all required fields."
            );

            return;

        }

        try {

            setLoading(true);

            await registerUser({

                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,

            });

            router.push({

                pathname: "/verify",

                query: {

                    email: form.email,

                },

            });

        } catch (err: unknown) {

            if (err instanceof Error) {

                setError(err.message);

            } else {

                setError(
                    "Registration failed."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout title="Register With Us">

            <div className={styles.container}>

                <div className={styles.row}>

                    <div>

                        <label>First Name</label>

                        <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            autoComplete="given-name"
                        />

                    </div>

                    <div>

                        <label>Last Name</label>

                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            autoComplete="family-name"
                        />

                    </div>

                </div>

                <label>Email</label>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                />

                <label>Password</label>

                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                />

                <label>Phone Number (Optional)</label>

                <div className={styles.phoneRow}>

                    <select>
                        <option>US +1</option>
                    </select>

                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                    />

                </div>

                {error && (

                    <div className={styles.error}>
                        {error}
                    </div>

                )}

                <button
                    type="button"
                    className={styles.registerButton}
                    onClick={handleRegister}
                    disabled={loading}
                >

                    {loading
                        ? "REGISTERING..."
                        : "REGISTER"}

                </button>

                <div className={styles.checkbox}>

                    <input type="checkbox" />

                    <span>
                        Keep me signed in
                    </span>

                </div>

                <div className={styles.checkbox}>

                    <input type="checkbox" />

                    <span>
                        Verify my phone number via text message and enable alerts for suspicious activity.
                    </span>

                </div>

                <div className={styles.footerLinks}>

                    © 2026, Vinod Luxury Retailer |
                    Site Terms and Privacy Policy |
                    Do Not Sell My Personal Information

                </div>

            </div>

        </AuthLayout>

    );

}