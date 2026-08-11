import { Product } from "./product";
export type ChatRole =
    | "user"
    | "assistant";

export interface ChatMessage {

    id: string;

    role: ChatRole;

    content: string;

    createdAt: string;

    recommendations?: AIRecommendation[];

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

    previousResponseId?: string;

}

export interface StyleAdvisorResponse {

    reply: string;

    responseId?: string;

    recommendations: AIRecommendation[];

}