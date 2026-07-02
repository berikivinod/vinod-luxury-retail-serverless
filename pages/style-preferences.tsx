import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import AccountSidebar from "@/components/Account/AccountSidebar";
import styles from "@/styles/StylePreferences.module.css";

export default function StylePreferences() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [shoppingPreference, setShoppingPreference] =
        useState("");
    const [showDesignerModal, setShowDesignerModal] =
        useState(false);

    const [selectedDesigners, setSelectedDesigners] =
        useState<string[]>([]);

    const [topSize, setTopSize] =
        useState("");

    const [bottomSize, setBottomSize] =
        useState("");

    const [shoeSize, setShoeSize] =
        useState("");

    const [selectedStyles, setSelectedStyles] =
        useState<string[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            router.push("/");
            return;
        }

        const currentUser = JSON.parse(storedUser);

        setUser(currentUser);

        const savedPreferences =
            localStorage.getItem(
                `stylePreferences_${currentUser.id}`
            );

        if (savedPreferences) {
            const preferences =
                JSON.parse(savedPreferences);

            setShoppingPreference(
                preferences.shoppingPreference || ""
            );

            setSelectedDesigners(
                preferences.designers || []
            );

            setTopSize(
                preferences.topSize || ""
            );

            setBottomSize(
                preferences.bottomSize || ""
            );

            setShoeSize(
                preferences.shoeSize || ""
            );

            setSelectedStyles(
                preferences.styles || []
            );
        }
    }, [router]);

    useEffect(() => {
        if (!user) return;

        localStorage.setItem(
            `stylePreferences_${user.id}`,
            JSON.stringify({
                shoppingPreference,
                designers: selectedDesigners,
                topSize,
                bottomSize,
                shoeSize,
                styles: selectedStyles,
            })
        );
    }, [
        user,
        shoppingPreference,
        selectedDesigners,
        topSize,
        bottomSize,
        shoeSize,
        selectedStyles,
    ]);

    if (!user) return null;

    const completed =
        (shoppingPreference ? 1 : 0) +
        (selectedDesigners.length > 0 ? 1 : 0) +
        (topSize ? 1 : 0) +
        (bottomSize ? 1 : 0) +
        (shoeSize ? 1 : 0) +
        (selectedStyles.length > 0
            ? Math.min(selectedStyles.length, 2)
            : 0);

    const designers = [
        "Gucci",
        "Prada",
        "Louis Vuitton",
        "Burberry",
        "Versace",
        "Saint Laurent",
        "Coach",
        "Valentino",
        "Balenciaga",
        "Dolce & Gabbana",
        "Fendi",
        "Givenchy",
        "Celine",
        "Bottega Veneta",
        "Alexander McQueen",];

    const toggleDesigner = (
        designer: string
    ) => {
        setSelectedDesigners((prev) =>
            prev.includes(designer)
                ? prev.filter(
                    (d) => d !== designer
                )
                : [...prev, designer]
        );
    };

    return (
        <>
            <Header />

            <div className={styles.wrapper}>
                <AccountSidebar
                    user={user}
                    activePage="style"
                />

                <div className={styles.content}>
                    <div className={styles.headerRow}>
                        <div>
                            <h1>
                                My Style Preferences
                            </h1>

                            <p>
                                Make shopping easier by
                                saving your favorite
                                designers, sizes & styles.
                            </p>
                        </div>

                        <div className={styles.progressArea}>
                            <span>
                                {completed}/7 completed
                            </span>

                            <div
                                className={styles.progressBar}
                            >
                                <div
                                    className={
                                        styles.progressFill
                                    }
                                    style={{
                                        width: `${(completed / 7) *
                                            100
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.sectionGrid}>
                        <div className={styles.section}>
                            <h2>
                                Shopping Preference
                            </h2>

                            <div
                                className={styles.preferenceButtons}
                            >
                                <button
                                    className={
                                        shoppingPreference ===
                                            "women"
                                            ? styles.selected
                                            : ""
                                    }
                                    onClick={() =>
                                        setShoppingPreference(
                                            "women"
                                        )
                                    }
                                >
                                    WOMEN
                                </button>

                                <button
                                    className={
                                        shoppingPreference ===
                                            "men"
                                            ? styles.selected
                                            : ""
                                    }
                                    onClick={() =>
                                        setShoppingPreference(
                                            "men"
                                        )
                                    }
                                >
                                    MEN
                                </button>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h2>Designers</h2>

                            <button
                                className={styles.addButton}
                                onClick={() =>
                                    setShowDesignerModal(true)
                                }
                            >
                                + Add Designers
                            </button>

                            {selectedDesigners.length > 0 && (
                                <div
                                    className={styles.selectedDesigners}
                                >
                                    {selectedDesigners.map(
                                        (designer) => (
                                            <span
                                                key={designer}
                                                className={
                                                    styles.designerChip
                                                }
                                            >
                                                {designer}
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.fullSection}>
                        <h2>Sizing</h2>

                        {!shoppingPreference ? (
                            <p>
                                Select Shopping Preference
                                to add sizes.
                            </p>
                        ) : (
                            <div className={styles.sizeGrid}>
                                <div>
                                    <label>
                                        {shoppingPreference === "women"
                                            ? "Top Size"
                                            : "Shirt Size"}
                                    </label>

                                    <select
                                        value={topSize}
                                        onChange={(e) =>
                                            setTopSize(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Select
                                        </option>

                                        <option>XS</option>
                                        <option>S</option>
                                        <option>M</option>
                                        <option>L</option>
                                        <option>XL</option>
                                    </select>
                                </div>

                                <div>
                                    <label>
                                        {shoppingPreference === "women"
                                            ? "Bottom Size"
                                            : "Pant Size"}
                                    </label>

                                    <select
                                        value={bottomSize}
                                        onChange={(e) =>
                                            setBottomSize(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select
                                        </option>

                                        <option>XS</option>
                                        <option>S</option>
                                        <option>M</option>
                                        <option>L</option>
                                        <option>XL</option>
                                    </select>
                                </div>

                                <div>
                                    <label>
                                        Shoe Size
                                    </label>

                                    <select
                                        value={shoeSize}
                                        onChange={(e) =>
                                            setShoeSize(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select
                                        </option>

                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                        <option>11</option>
                                        <option>12</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.fullSection}>
                        <h2>Styles</h2>

                        <div className={styles.styleTags}>
                            {[
                                "Casual",
                                "Luxury",
                                "Formal",
                                "Business",
                                "Evening Wear",
                                "Streetwear"
                            ].map((style) => (
                                <button
                                    key={style}
                                    className={
                                        selectedStyles.includes(style)
                                            ? styles.selectedTag
                                            : styles.styleTag
                                    }
                                    onClick={() => {
                                        setSelectedStyles(
                                            (prev) =>
                                                prev.includes(style)
                                                    ? prev.filter(
                                                        (s) =>
                                                            s !== style
                                                    )
                                                    : [
                                                        ...prev,
                                                        style,
                                                    ]
                                        );
                                    }}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showDesignerModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>
                            Select Favorite Designers
                        </h2>

                        <div
                            className={
                                styles.designerGrid
                            }
                        >
                            {designers.map(
                                (designer) => (
                                    <label
                                        key={designer}
                                        className={
                                            styles.checkboxRow
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedDesigners.includes(
                                                designer
                                            )}
                                            onChange={() =>
                                                toggleDesigner(
                                                    designer
                                                )
                                            }
                                        />

                                        {designer}
                                    </label>
                                )
                            )}
                        </div>

                        <div
                            className={
                                styles.modalActions
                            }
                        >
                            <button
                                onClick={() =>
                                    setShowDesignerModal(
                                        false
                                    )
                                }
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}