import { useEffect } from "react";
import styles from "./SideDrawer.module.css";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function SideDrawer({
  isOpen,
  onClose,
  title,
  children,
}: SideDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose}
        />
      )}

      <div
        className={`${styles.drawer} ${isOpen ? styles.open : ""
          }`}
      >
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            {title}
          </div>

          <button onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
}