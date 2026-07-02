import Header from "@/components/Common/Header";
import styles from "../styles/Home.module.css";
import Footer from "../components/Common/Footer";
import HeroCarousel from "@/components/Home/HeroCarousel";
import CategorySection from "../components/Home/CategorySection";
import WhereToWear from "../components/Home/WhereToWear";
import ThingsWeLove from "../components/Home/ThingsWeLove";
import StyleAdvisor from "../components/Home/StyleAdvisor";
import RecentlyViewed
  from "../components/Product/RecentlyViewed";

export default function Home() {
  return (
    <>
    <Header />
    <HeroCarousel />
    <div className={styles.homeContainer}>
      <CategorySection />
      <WhereToWear />
      <ThingsWeLove />
      <StyleAdvisor />
    </div>
    <RecentlyViewed />
    <Footer />
    </>
  );
}