import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import styles from "@/styles/OrderHistory.module.css";
import orders from "@/data/orders.json";
import Image from "next/image";
import AccountSidebar from "@/components/Account/AccountSidebar";

export default function OrderHistory() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [searchText, setSearchText] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [allOrders, setAllOrders] =
        useState<any[]>([]);

    useEffect(() => {
        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            router.push("/guest-order-history");
            return;
        }

        const currentUser =
            JSON.parse(storedUser);

        setUser(currentUser);

        const localOrders =
            JSON.parse(
                localStorage.getItem(
                    `orders_${currentUser.id}`
                ) || "[]"
            );

        const jsonOrders =
            orders.filter(
                (order) =>
                    order.userId ===
                    currentUser.id
            );

        setAllOrders([
            ...localOrders,
            ...jsonOrders
        ]);
    }, [router]);

    const userOrders = allOrders.filter((order) => {
        const matchesUser = order.userId === user?.id;

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
                    .includes(searchText.toLowerCase());

        return (
            matchesUser &&
            matchesTab &&
            matchesSearch
        );
    });
    if (!user) {
        return null;
    }

    return (
        <>
            <Header />

            <div className={styles.wrapper}>
                <AccountSidebar
                    user={user}
                    activePage="account"
                />

                <div className={styles.content}>
                    <h1>Order History</h1>

                    <div className={styles.searchSection}>
                        <input
                            type="text"
                            placeholder="Search Orders"
                            value={searchText}
                            onChange={(e) =>
                                setSearchText(e.target.value)
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
                                setActiveTab("In-Store")
                            }
                        >
                            In-Store
                        </div>
                    </div>

                    {userOrders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No Orders Found</h3>

                            <p>
                                Looks like you don't have any
                                orders with us yet — visit us
                                online or in our stores to
                                find something you'll love.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {userOrders.map((order) => (
                                <div
                                    key={order.orderId}
                                    className={styles.orderCard}
                                >
                                    <Image
                                        src={order.items[0].image}
                                        alt={order.items[0].productName}
                                        width={120}
                                        height={140}
                                        className={styles.orderImage}
                                    />

                                    <div className={styles.orderContent}>

                                        <div className={styles.orderHeader}>
                                            <div className={styles.orderNumber}>
                                                Order #{order.orderId}
                                            </div>

                                            <div
                                                className={`${styles.orderStatus} ${styles[
                                                    order.status.toLowerCase()
                                                ]
                                                    }`}
                                            >
                                                {order.status}
                                            </div>
                                        </div>

                                        <div className={styles.productName}>
                                            {order.items[0].productName}
                                        </div>

                                        <div className={styles.orderInfo}>
                                            <div>{order.channel} Order</div>
                                            <div>{order.orderDate}</div>
                                        </div>

                                        <div className={styles.total}>
                                            Total: ${order.total.toFixed(2)}
                                        </div>

                                        <button
                                            className={styles.viewDetails}
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
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}