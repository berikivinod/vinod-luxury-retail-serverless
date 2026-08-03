import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import AccountLayout from "@/components/Account/AccountLayout";
import useAuth from "@/hooks/useAuth";

import { Order } from "@/types/order";

import styles from "@/styles/OrderHistory.module.css";

export default function OrderHistory() {

    const router = useRouter();

    const { user, loading } = useAuth();

    const [searchText, setSearchText] =
        useState("");

    const [activeTab, setActiveTab] =
        useState("All");

    const [allOrders, setAllOrders] =
        useState<Order[]>([]);

    useEffect(() => {

        if (!user) {
            return;
        }

        const loadOrders = async () => {

            try {

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_PRODUCTS_API}/orders?userId=${user.id}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Unable to load orders."
                    );
                }

                const data: Order[] =
                    await response.json();

                setAllOrders(data);

            } catch (error) {

                console.error(error);

                setAllOrders([]);

            }

        };

        loadOrders();

    }, [user]);

    if (loading) {
        return null;
    }

    if (!user) {
        return null;
    }

    const userOrders =
        allOrders.filter((order: Order) => {

            const matchesTab =
                activeTab === "All"
                    ? true
                    : activeTab === "Online"
                        ? order.channel === "Online"
                        : order.channel === "In-Store";

            const matchesSearch =
                searchText === ""
                    ? true
                    : order.orderId
                          .toLowerCase()
                          .includes(
                              searchText.toLowerCase()
                          );

            return (
                matchesTab &&
                matchesSearch
            );

        });

    return (

        <AccountLayout activePage="orders">

            <div className={styles.content}>

                <h1>
                    Order History
                </h1>

                <div className={styles.searchSection}>

                    <input
                        type="text"
                        placeholder="Search Orders"
                        value={searchText}
                        onChange={(e) =>
                            setSearchText(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className={styles.tabs}>

                    <div
                        className={
                            activeTab === "All"
                                ? styles.activeTab
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("All")
                        }
                    >
                        All Orders
                    </div>

                    <div
                        className={
                            activeTab === "Online"
                                ? styles.activeTab
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("Online")
                        }
                    >
                        Online
                    </div>

                    <div
                        className={
                            activeTab === "In-Store"
                                ? styles.activeTab
                                : ""
                        }
                        onClick={() =>
                            setActiveTab(
                                "In-Store"
                            )
                        }
                    >
                        In-Store
                    </div>

                </div>

                {userOrders.length === 0 ? (

                    <div
                        className={
                            styles.emptyState
                        }
                    >

                        <h3>
                            No Orders Found
                        </h3>

                        <p>
                            Looks like you don't
                            have any orders with us
                            yet — visit us online
                            or in our stores to
                            find something you'll
                            love.
                        </p>

                    </div>

                ) : (

                    <div
                        className={
                            styles.ordersList
                        }
                    >

                        {userOrders.map(
                            (order: Order) => (

                                <div
                                    key={
                                        order.orderId
                                    }
                                    className={
                                        styles.orderCard
                                    }
                                >

                                    <Image
                                        src={
                                            order.items?.[0]
                                                ?.image ||
                                            "/images/no-image.png"
                                        }
                                        alt={
                                            order.items?.[0]
                                                ?.productName ||
                                            "Product"
                                        }
                                        width={120}
                                        height={140}
                                        className={
                                            styles.orderImage
                                        }
                                    />

                                    <div
                                        className={
                                            styles.orderContent
                                        }
                                    >

                                        <div
                                            className={
                                                styles.orderHeader
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.orderNumber
                                                }
                                            >
                                                Order #
                                                {order.orderId}
                                            </div>

                                            <div
                                                className={`${styles.orderStatus} ${
                                                    styles[
                                                        order.status.toLowerCase()
                                                    ]
                                                }`}
                                            >
                                                {order.status}
                                            </div>

                                        </div>

                                        <div
                                            className={
                                                styles.productName
                                            }
                                        >
                                            {
                                                order.items?.[0]
                                                    ?.productName
                                            }
                                        </div>

                                        <div
                                            className={
                                                styles.orderInfo
                                            }
                                        >

                                            <div>
                                                {order.channel}{" "}
                                                Order
                                            </div>

                                            <div>
                                                {order.orderDate}
                                            </div>

                                        </div>

                                        <div
                                            className={
                                                styles.total
                                            }
                                        >
                                            Total: $
                                            {Number(
                                                order.total
                                            ).toFixed(2)}
                                        </div>

                                        <button
                                            className={
                                                styles.viewDetails
                                            }
                                            onClick={() =>
                                                router.push(
                                                    `/order-details/${order.orderId}`
                                                )
                                            }
                                        >
                                            VIEW DETAILS
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </AccountLayout>

    );

}