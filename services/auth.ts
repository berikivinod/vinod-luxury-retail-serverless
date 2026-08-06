import {
    signUp,
    confirmSignUp,
    resendSignUpCode,
    signIn,
    signOut,
    getCurrentUser,
    fetchUserAttributes,
    resetPassword,
    confirmResetPassword,
} from "aws-amplify/auth";

import { SignUpForm } from "@/types/auth";
import { AuthUser } from "@/types/user";

export async function registerUser(
    data: SignUpForm
) {

    return signUp({

        username: data.email,

        password: data.password,

        options: {

            userAttributes: {

                email: data.email,

                given_name: data.firstName,

                family_name: data.lastName,

            },

        },

    });

}

export async function verifyUser(
    email: string,
    code: string
) {

    return confirmSignUp({

        username: email,

        confirmationCode: code,

    });

}

export async function resendVerificationCode(
    email: string
) {

    return resendSignUpCode({

        username: email,

    });

}

export async function loginUser(
    email: string,
    password: string
) {

    return signIn({

        username: email,

        password,

    });

}

export async function logoutUser() {

    return signOut();

}

export async function getLoggedInUser():
Promise<AuthUser | null> {

    try {

        const user =
            await getCurrentUser();

        const attributes =
            await fetchUserAttributes();

        return {

            id: user.userId,

            email:
                attributes.email || "",

            firstName:
                attributes.given_name || "",

            lastName:
                attributes.family_name || "",

        };

    } catch {

        // No authenticated user
        return null;

    }

}

/* =====================================================
   Forgot Password
===================================================== */

export async function forgotPassword(
    email: string
) {

    return resetPassword({

        username: email,

    });

}

export async function confirmForgotPassword(
    email: string,
    confirmationCode: string,
    newPassword: string
) {

    return confirmResetPassword({

        username: email,

        confirmationCode,

        newPassword,

    });

}