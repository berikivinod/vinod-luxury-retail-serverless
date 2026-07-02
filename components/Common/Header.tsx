/*
import { useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const [openStore, setOpenStore] = useState(false);

  return (
    <div>
      <button onClick={() => setOpenStore(true)}>
        Our Stores
      </button>

      <button onClick={() => router.push("/guest-order-history")}>
        My Orders
      </button>

      <button onClick={() => router.push("/c/cat78570743")}>
        Match with a Style Advisor
      </button>

      <h1>Vinod Luxury Retailer</h1>

      {openStore && (
        <div>
          <h3>Select Store</h3>
          <button onClick={() => setOpenStore(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

import styles from "./Header.module.css";

export default function Header() {
  return (
    <>
      <div className={styles.promoBar}>
        RECEIVE 30% OFF WHEN YOU SIGN UP FOR TEXTS
      </div>

      <header className={styles.header}>
        <div className={styles.leftSection}>
          <a>Our Stores</a>

          <div className={styles.genderLinks}>
            <a>Women</a>
            <a>Men</a>
          </div>
        </div>

        <div className={styles.logo}>
          Vinod Luxury Retailer
        </div>

        <div className={styles.rightSection}>
          <div>
            <a>My Orders</a>
            <a>Match with a Style Advisor</a>
          </div>

          <div>
            <a>Sign In</a>
            <span>🛍️</span>
          </div>

          <div>
            <input placeholder="Search" />
            <button>Search</button>
          </div>
        </div>
      </header>

      <nav className={styles.nav}>
        <a>New Arrivals</a>
        <a>The Edits</a>
        <a>Designers</a>
        <a>Clothing</a>
        <a>Shoes</a>
        <a>Handbags</a>
        <a>Jewelry</a>
        <a>Accessories</a>
        <a>Beauty</a>
        <a>Kids</a>
        <a>Home</a>
        <a>Father's Day Gifts</a>
        <a>Sale</a>
      </nav>
    </>
  );
}
*/
import { useRouter } from "next/router";
import { FaUserAlt } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";
import SideDrawer from "./SideDrawer";
import { Store } from "@/types/store";
import Image from "next/image";


type DrawerMode = "signin" | "stores" | "auth" | "account" | "cart" | null;



export default function Header() {
  console.log("Header Render");
  console.log("Header Mounted");
  const router = useRouter();
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);

  const [storeQuery, setStoreQuery] = useState("");
  const [storeResults, setStoreResults] = useState<Store[]>([]);
  const [suggestions, setSuggestions] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [previousDrawer, setPreviousDrawer] = useState<DrawerMode>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [cartCount, setCartCount] =
    useState(0);
  const [cartItems, setCartItems] =
    useState<any[]>([]);

  const [searchText, setSearchText] =
    useState("");

  const [searchSuggestions, setSearchSuggestions] =
    useState<any[]>([]);


  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!storeQuery.trim()) {
        setSuggestions([]);
        return;
      }

      const res = await fetch(`/api/stores?query=${storeQuery}`);
      const data = await res.json();

      setSuggestions(data);
    }, 300);

    return () => clearTimeout(timer);
  }, [storeQuery]);

  useEffect(() => {

    const loadUser = async () => {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) return;

      const user =
        JSON.parse(storedUser);

      setLoggedInUser(user);

      await loadCart(user.id);

    };

    loadUser();

  }, []);

  function getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const handleStoreSearch = async () => {
    if (!storeQuery.trim()) return;

    try {
      setLoadingStores(true);

      const res = await fetch(`/api/stores?query=${storeQuery}`);
      const data: Store[] = await res.json();

      setStoreResults(data);
    } catch (err) {
      console.error(err);
      setStoreResults([]);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoginError("");

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      setLoggedInUser(data);

      const cart =
        JSON.parse(
          localStorage.getItem(
            `cart_${data.id}`
          ) || "[]"
        );

      const count = cart.reduce(
        (sum: number, item: any) =>
          sum + item.quantity,
        0
      );

      setCartCount(count);

      {/*alert(
        `Welcome ${data.firstName} ${data.lastName}`
      );*/}

      setDrawerMode(null);
    } catch (error) {
      setLoginError(
        "Something went wrong"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null);
    setCartCount(0);
    setDrawerMode(null);
    router.push("/");
  };

  const loadCart = async (userId: number) => {

    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCTS_API}/cart?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load cart");
      }

      const cart =
        await response.json();

      setCartItems(cart.items || []);

      const count =
        (cart.items || []).reduce(
          (sum: number, item: any) =>
            sum + item.quantity,
          0
        );

      setCartCount(count);

    } catch (error) {

      console.error(error);

      setCartItems([]);

      setCartCount(0);

    }

  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingStores(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const res = await fetch("/api/stores");
      const stores: Store[] = await res.json();

      const sorted = [...stores].sort((a, b) => {
        const d1 = getDistance(
          latitude,
          longitude,
          a.lat,
          a.lng
        );

        const d2 = getDistance(
          latitude,
          longitude,
          b.lat,
          b.lng
        );

        return d1 - d2;
      });

      setStoreResults(sorted);
      setLoadingStores(false);
    });
  };

  useEffect(() => {
    const updateCartCount = async () => {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) return;

      const user =
        JSON.parse(storedUser);

      await loadCart(user.id);
    };

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  console.log(cartItems);
  const cartSubtotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0
    );

  useEffect(() => {
    const timer = setTimeout(async () => {

      if (!searchText.trim()) {
        setSearchSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PRODUCTS_API}/products/search?q=${encodeURIComponent(searchText)}`
        );

        const data = await response.json();

        setSearchSuggestions(data);

      } catch (error) {
        console.error(error);
        setSearchSuggestions([]);
      }

    }, 300);

    return () => clearTimeout(timer);

  }, [searchText]);

  return (
    <>
      {/* Promo */}
      <div className={styles.promoBar}>
        RECEIVE 30% OFF WHEN YOU SIGN UP FOR TEXTS
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <button
            className={styles.headerLink}
            onClick={() => {
              setPreviousDrawer(null);
              setDrawerMode("stores");
            }}
          >
            Our Stores
          </button>

          <div className={styles.genderLinks}>
            <a className={styles.headerLink}>WOMEN</a>
            <a className={styles.headerLink}>MEN</a>
          </div>
        </div>

        <div className={styles.logo}
          onClick={() => router.push("/")}>
          Vinod Luxury Retailer
        </div>

        <div className={styles.rightSection}>
          <div className={styles.topLinks}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (loggedInUser) {
                  router.push("/order-history");
                } else {
                  router.push("/guest-order-history");
                }
              }}
            >
              My Orders
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push("/c/cat78570743");
              }}
            >
              Match with a Style Advisor
            </a>
          </div>

          <div className={styles.accountRow}>
            <span
              className={styles.iconText}
              onClick={() => setDrawerMode(loggedInUser ? "account" : "signin")}
            >
              <FaUserAlt />
              {loggedInUser
                ? `Welcome, ${loggedInUser.firstName}${loggedInUser.lastName}`
                : "Sign In"}
            </span>

            <span
              className={styles.bagContainer}
              onClick={() =>
                setDrawerMode("cart")
              }
            >
              <FiShoppingBag />

              {cartCount > 0 && (
                <span className={styles.cartBadge}>
                  {cartCount}
                </span>
              )}
            </span>
          </div>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
              className={styles.searchInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(
                    `/search?q=${searchText}`
                  );

                  setSearchSuggestions([]);
                }
              }}
            />

            <button
              className={styles.searchButton}
              onClick={() => {
                router.push(
                  `/search?q=${searchText}`
                );

                setSearchSuggestions([]);
              }}
            >
              SEARCH
            </button>

            {searchSuggestions.length > 0 && (
              <div className={styles.searchDropdown}>
                {searchSuggestions.map(
                  (product: any) => (
                    <div
                      key={product.id}
                      className={
                        styles.searchSuggestion
                      }
                      onClick={() => {
                        router.push(
                          `/product/${product.id}`
                        );

                        setSearchText("");
                        setSearchSuggestions([]);
                      }}
                    >
                      <strong>
                        {product.brand}
                      </strong>

                      <div>
                        {product.name}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.nav}>
        <a>New Arrivals</a>
        <a>The Edits</a>
        <a>Designers</a>
        <a>Clothing</a>
        <a>Shoes</a>
        <a>Handbags</a>
        <a>Jewelry</a>
        <a>Accessories</a>
        <a>Beauty</a>
        <a>Kids</a>
        <a>Home</a>
        <a>Father's Day Gifts</a>
        <a>Sale</a>
      </nav>

      {/* SINGLE SIDE DRAWER (DYNAMIC CONTENT) */}
      <SideDrawer
        isOpen={drawerMode !== null}
        onClose={() => setDrawerMode(null)}
        title={drawerMode === "stores"
          ? "Find Our Stores"
          : drawerMode === "cart"
            ? "Shopping Bag"
            : drawerMode === "account"
              ? ""
              : drawerMode === "auth"
                ? ""
                : "👤 Welcome"}
      >
        {/* SIGN IN */}
        {drawerMode === "signin" && (

          <div className={styles.signInDrawer}>

            <div className={styles.drawerSection}>
              <h2>Your Account</h2>

              <div className={styles.drawerItem}
                onClick={() => setDrawerMode("auth")}>
                Sign in / Register
              </div>

              <div className={styles.drawerItem}
                onClick={() => {
                  setDrawerMode(null);

                  setTimeout(() => {
                    router.push("/guest-order-history");
                  }, 100);
                }}>
                Order History
              </div>

              <div className={styles.drawerItem}
                onClick={() => {
                  setDrawerMode(null);

                  setTimeout(() => {
                    router.push("/Credit-VLR");
                  }, 100);
                }}>
                VLR Credit Card
              </div>

              <div className={styles.drawerItem}>
                My Style Preferences
              </div>
            </div>

            <div className={styles.drawerSection}>
              <h2>We're Here To Help</h2>

              <Image
                src="/images/Sign-In-Drawer.jpg"
                alt="Style Advisor"
                width={800}
                height={534}
                className={styles.drawerBanner}
                priority
              />

              <div className={styles.drawerItem}>
                Match with a style advisor
              </div>

              <div className={styles.drawerItem}>
                Book an appointment with a style advisor
              </div>
            </div>

            <div className={styles.drawerSection}>
              <h2>Your Store</h2>

              <div className={styles.drawerItemArrow}
                onClick={() => {
                  setPreviousDrawer("signin");
                  setDrawerMode("stores");
                }}>
                <span>Select a store</span>
                <span>›</span>
              </div>
            </div>

          </div>

        )}

        {/* STORES */}
        {drawerMode === "stores" && (
          <div>
            {previousDrawer === "signin" && (
              <div
                style={{
                  cursor: "pointer",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
                onClick={() => {
                  setDrawerMode("signin");
                  setPreviousDrawer(null);
                }}
              >
                <FaChevronLeft />
              </div>
            )}
            <input
              type="text"
              placeholder="Enter City, State or Zip"
              value={storeQuery}
              onChange={(e) => setStoreQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "12px",
              }}
            />

            {suggestions.length > 0 && (
              <div
                style={{
                  border: "1px solid #ddd",
                  marginBottom: "12px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => {
                      setStoreQuery(store.city);
                      setSuggestions([]);
                    }}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                    }}
                  >
                    {store.city}, {store.state}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleStoreSearch}
              style={{
                width: "100%",
                padding: "12px",
                background: "black",
                color: "white",
                border: "none",
                marginBottom: "10px",
              }}
            >
              Search
            </button>

            <button
              onClick={handleUseMyLocation}
              style={{
                width: "100%",
                padding: "12px",
                background: "#444",
                color: "white",
                border: "none",
              }}
            >
              Use My Location 📍
            </button>

            {loadingStores && (
              <p style={{ marginTop: "15px" }}>
                Searching...
              </p>
            )}

            {storeResults.map((store) => (
              <div
                key={store.id}
                style={{
                  marginTop: "15px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                <strong>{store.name}</strong>

                <p>
                  {store.city}, {store.state} - {store.zip}
                </p>
              </div>
            ))}
          </div>
        )}
        {drawerMode === "auth" && (
          <div className={styles.authDrawer}>

            <div
              className={styles.drawerBack}
              onClick={() => setDrawerMode("signin")}
            >
              ←
            </div>

            <h1 className={styles.authTitle}>
              Welcome Back!
            </h1>

            {/* <input
              type="email"
              placeholder="EMAIL"
              className={styles.authInput}
            />*/}
            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className={styles.authInput}
            />

            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className={styles.authInput}
            />

            <div className={styles.forgotPassword}>
              Forgot Password?
            </div>

            <button
              className={styles.signInButton}
              onClick={handleLogin}
            >
              SIGN IN
            </button>

            <label className={styles.keepSignedIn}>
              <input type="checkbox" />
              <span>Keep Me Signed In</span>
            </label>

            <p className={styles.termsText}>
              By continuing, you agree to our Privacy Policy and
              Terms & Conditions.
            </p>

            <hr className={styles.divider} />

            <h2 className={styles.registerTitle}>
              Register with Us
            </h2>

            <ul className={styles.benefits}>
              <li>Earn points and redeem for rewards</li>
              <li>Access exclusive offers and events</li>
              <li>Enjoy a more personalized experience</li>
              <li>Save information for faster checkout</li>
              <li>Track purchases and order history</li>
            </ul>

            <button className={styles.registerButton}
              onClick={() => { router.push("/register"); }}
            >
              REGISTER NOW
            </button>

            <div className={styles.authFooter}>
              © 2026, Vinod Luxury Retailer |
              Site Terms and Privacy Policy |
              Do Not Sell My Personal Information
            </div>

          </div>
        )}
        {drawerMode === "account" && loggedInUser && (
          <div className={styles.signInDrawer}>

            <div className={styles.drawerWelcome}>
              <FaUserAlt />
              <span>
                Welcome, {loggedInUser.firstName}{loggedInUser.lastName}
              </span>
            </div>
            <h1>Your Account</h1>
            <div
              className={styles.drawerItem}
              onClick={() => {
                setDrawerMode(null);
                router.push("/account");
              }}
            >
              Overview
            </div>

            <div
              className={styles.drawerItem}
              onClick={() => {
                setDrawerMode(null);

                const destination = loggedInUser
                  ? "/order-history"
                  : "/guest-order-history";

                setTimeout(() => {
                  router.push(destination);
                }, 100);
              }}
            >
              Order History
            </div>

            <div
              className={styles.drawerItem}
              onClick={() =>
                router.push("/Credit-VLR")
              }
            >
              VLR Credit Card
            </div>

            <div className={styles.drawerItem}>
              My Style Preferences
            </div>
            <div className={styles.drawerSection}>
              <h2>We're Here To Help</h2>

              <Image
                src="/images/Sign-In-Drawer.jpg"
                alt="Style Advisor"
                width={800}
                height={534}
                className={styles.drawerBanner}
                priority
              />

              <div className={styles.drawerItem}>
                Match with a style advisor
              </div>

              <div className={styles.drawerItem}>
                Book an appointment with a style advisor
              </div>
            </div>
            <div className={styles.drawerSection}>
              <h2>Your Store</h2>
            </div>

            <div
              className={styles.drawerItem}
              onClick={handleLogout}
            >
              Sign Out
            </div>
          </div>
        )}



        {drawerMode === "cart" && (
          <div>
            <h2>
              Shopping Bag ({cartCount})
            </h2>

            {cartItems.length === 0 ? (
              <p>
                Your shopping bag is empty.
              </p>
            ) : (
              <>
                {cartItems.map((item: any) => (

                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "20px",
                      paddingBottom: "15px",
                      borderBottom: "1px solid #eee"
                    }}
                  >
                    <img
                      src={
                        item.image ||
                        "/images/products/placeholder-product.jpg"
                      }
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "100px",
                        objectFit: "cover"
                      }}
                    />

                    <div>
                      <strong>
                        {item.brand}
                      </strong>

                      <p>{item.name}</p>

                      <p>
                        Qty: {item.quantity}
                      </p>

                      <p>
                        ${item.price}
                      </p>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "20px"
                  }}
                >
                  <button
                    style={{
                      height: "45px",
                      border: "1px solid black",
                      background: "white",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setDrawerMode(null);
                      router.push("/shopping-bag");
                    }}
                  >
                    VIEW BAG
                  </button>

                  <button
                    style={{
                      height: "45px",
                      background: "black",
                      color: "white",
                      border: "none",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setDrawerMode(null);
                      router.push("/checkout");
                    }}
                  >
                    CHECKOUT
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </SideDrawer>
    </>
  );
}