import {
    StyleAdvisorRequest,
    StyleAdvisorResponse,
} from "@/types/ai";

const AI_API = "/api/ai/style-advisor";

export async function sendMessage(
    request: StyleAdvisorRequest
): Promise<StyleAdvisorResponse> {

    const response = await fetch(
        AI_API,
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(request),

        }
    );

    if (!response.ok) {

        throw new Error(
            "Unable to contact AI Style Advisor."
        );

    }

    return response.json();

}