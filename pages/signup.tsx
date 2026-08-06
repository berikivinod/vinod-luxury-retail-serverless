import { useState } from "react";
import { useRouter } from "next/router";

import { registerUser } from "@/services/auth";

export default function Signup() {

    const router = useRouter();

    const [form, setForm] = useState({

        firstName: "",

        lastName: "",

        email: "",

        password: "",

        confirmPassword: "",

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

            [e.target.name]:
                e.target.value,

        });

    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setError("");

        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }

        try {

            setLoading(true);

            await registerUser({

                firstName:
                    form.firstName,

                lastName:
                    form.lastName,

                email:
                    form.email,

                password:
                    form.password,

            });

            router.push({

                pathname:
                    "/verify",

                query: {

                    email:
                        form.email,

                },

            });

        } catch (err: unknown) {

            if (err instanceof Error) {

                setError(
                    err.message
                );

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

        <div
            style={{
                maxWidth: 500,
                margin: "40px auto",
            }}
        >

            <h1>
                Create Account
            </h1>

            <form
                onSubmit={handleSubmit}
            >

                <input
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                {error && (

                    <p
                        style={{
                            color: "red",
                        }}
                    >
                        {error}
                    </p>

                )}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Creating..."
                        : "Create Account"}

                </button>

            </form>

        </div>

    );

}