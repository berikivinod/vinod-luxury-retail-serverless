export type ChatRole =
    | "user"
    | "assistant";

export interface ChatMessage {

    id: string;

    role: ChatRole;

    content: string;

    createdAt: string;

}

export interface AIRecommendation {

    productId: number;

    name: string;

    brand: string;

    category: string;

    image: string;

    price: number;

    reason: string;

}

export interface StyleAdvisorRequest {

    messages: ChatMessage[];

}

export interface StyleAdvisorResponse {

    reply: string;

    recommendations: AIRecommendation[];

}