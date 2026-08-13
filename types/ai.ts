export type ChatRole =
    | "user"
    | "assistant";


/*
 * Customer shopping preferences
 * collected during the conversation.
 */
export interface StylePreferences {

    category?: string;

    productType?: string;

    occasion?: string;

    gender?: string;

    color?: string;

    size?: string;

    brand?: string;

    style?: string;

    minPrice?: number;

    maxPrice?: number;

}


/*
 * Individual chat message.
 */
export interface ChatMessage {

    id: string;

    role: ChatRole;

    content: string;

    createdAt: string;

    recommendations?: AIRecommendation[];

}


/*
 * Product recommendation returned
 * by the AI Style Advisor.
 */
export interface AIRecommendation {

    productId: number;

    name: string;

    brand: string;

    category: string;

    image: string;

    price: number;

    reason: string;

}


/*
 * Request sent from the Style Advisor
 * frontend to the API.
 */
export interface StyleAdvisorRequest {

    messages: ChatMessage[];

    previousResponseId?: string;

    preferences?: StylePreferences;

}


/*
 * Response returned by the Style Advisor API.
 */
export interface StyleAdvisorResponse {

    reply: string;

    responseId?: string;

    recommendations: AIRecommendation[];

    preferences?: StylePreferences;

}