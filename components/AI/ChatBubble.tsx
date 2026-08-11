import { ChatMessage } from "@/types/ai";

import styles from "@/styles/ChatBubble.module.css";

import useCart from "@/hooks/useCart";

import { useAuthContext } from "@/context/AuthContext";

interface Props {
    message: ChatMessage;
}

export default function ChatBubble({
    message,
}: Props) {

    const isUser =
        message.role === "user";

    const { user } =
        useAuthContext();

    const { addItem } =
        useCart();

    const handleAddToBag = async (
        productId: number
    ) => {

        if (!user) {

            alert(
                "Please sign in to add items to your bag."
            );

            return;
        }

        try {

            await addItem(
                productId,
                1
            );

            alert(
                "Added to Bag"
            );

        } catch (error) {

            console.error(
                "Unable to add item to cart.",
                error
            );

            alert(
                "Unable to add item to cart."
            );

        }
    };

    const handleViewProduct = (
        productId: number
    ) => {

        window.location.href =
            `/product/${productId}`;

    };

    return (
        <div
            className={
                isUser
                    ? styles.userContainer
                    : styles.assistantContainer
            }
        >

            {!isUser && (
                <div className={styles.avatar}>
                    👩
                </div>
            )}

            <div>

                {!isUser && (
                    <div className={styles.name}>
                        AI Style Advisor
                    </div>
                )}

                <div
                    className={
                        isUser
                            ? styles.user
                            : styles.assistant
                    }
                >
                    {message.content}
                </div>

                {message.recommendations &&
                    message.recommendations.length > 0 && (
                        <div
                            className={
                                styles.recommendations
                            }
                        >

                            {message.recommendations.map(
                                (recommendation) => (
                                    <div
                                        key={
                                            recommendation.productId
                                        }
                                        className={
                                            styles.productCard
                                        }
                                    >

                                        <img
                                            src={
                                                recommendation.image ||
                                                "/images/products/product-placeholder.png"
                                            }
                                            alt={
                                                recommendation.name
                                            }
                                            className={
                                                styles.productImage
                                            }
                                            onError={(
                                                event
                                            ) => {
                                                event.currentTarget.src =
                                                    "/images/products/product-placeholder.png";
                                            }}
                                        />

                                        <div
                                            className={
                                                styles.productInfo
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.productBrand
                                                }
                                            >
                                                {
                                                    recommendation.brand
                                                }
                                            </div>

                                            <div
                                                className={
                                                    styles.productName
                                                }
                                            >
                                                {
                                                    recommendation.name
                                                }
                                            </div>

                                            <div
                                                className={
                                                    styles.productPrice
                                                }
                                            >
                                                $
                                                {Number(
                                                    recommendation.price
                                                ).toFixed(2)}
                                            </div>

                                            <p
                                                className={
                                                    styles.productReason
                                                }
                                            >
                                                {
                                                    recommendation.reason
                                                }
                                            </p>

                                            <div
                                                className={
                                                    styles.productActions
                                                }
                                            >

                                                <button
                                                    type="button"
                                                    className={
                                                        styles.viewProduct
                                                    }
                                                    onClick={() =>
                                                        handleViewProduct(
                                                            recommendation.productId
                                                        )
                                                    }
                                                >
                                                    VIEW PRODUCT
                                                </button>

                                                <button
                                                    type="button"
                                                    className={
                                                        styles.addToBag
                                                    }
                                                    onClick={() =>
                                                        handleAddToBag(
                                                            recommendation.productId
                                                        )
                                                    }
                                                >
                                                    ADD TO BAG
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

            </div>

        </div>
    );
}