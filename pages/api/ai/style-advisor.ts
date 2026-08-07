import type {
    NextApiRequest,
    NextApiResponse,
} from "next";

import {
    StyleAdvisorRequest,
    StyleAdvisorResponse,
} from "@/types/ai";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StyleAdvisorResponse>
) {

    if (req.method !== "POST") {

        return res.status(405).end();

    }

    const body =
        req.body as StyleAdvisorRequest;

    console.log(
        "AI Request:",
        body.messages
    );

    return res.status(200).json({

        reply:
            "Hello! I'm your Vinod Luxury Retail Style Advisor. Tell me what you're shopping for and I'll recommend products from our collection.",

        recommendations: [],

    });

}