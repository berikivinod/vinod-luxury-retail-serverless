import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";

import AIChat from "@/components/AI/AIChat";

import styles from "@/styles/StyleAdvisor.module.css";

export default function StyleAdvisor() {

    return (

        <>

            <Header />

            <div className={styles.wrapper}>

                <div className={styles.hero}>

                    <p className={styles.badge}>
                        AI SHOPPING EXPERIENCE
                    </p>

                    <h1>
                        Match with a Style Advisor
                    </h1>

                    <p className={styles.description}>

                        Receive personalized luxury fashion
                        recommendations powered by AI.
                        Whether you're shopping for work,
                        weddings, vacations, or everyday
                        elegance, your Style Advisor is here
                        to help.

                    </p>

                </div>

                <div className={styles.quickPrompts}>

                    <button>
                        👔 Business Meeting
                    </button>

                    <button>
                        💍 Wedding Guest
                    </button>

                    <button>
                        ✈ Luxury Vacation
                    </button>

                    <button>
                        🎁 Gift Ideas
                    </button>

                    <button>
                        👠 Date Night
                    </button>

                </div>

                <AIChat />

            </div>

            <Footer />

        </>

    );

}