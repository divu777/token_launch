import Tag from "./../components/Tag";
import { CarouselDemo } from "../components/Carousel";
import AppBar from "../components/AppBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div className="overflow-x-hidden">
      <AppBar />

      {/* Hero Section */}
      <Hero />

      <Footer />
    </div>
  );
};

export default Landing;
