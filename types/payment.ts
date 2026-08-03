export interface PaymentMethod {

    id: number;

    userId: string;

    cardType: string;

    cardNumber: string;

    expiryMonth: string;

    expiryYear: string;

    nameOnCard: string;

    isDefault: boolean;

}