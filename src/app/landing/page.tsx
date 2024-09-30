import Tag from "./../components/Tag";
import { CarouselDemo } from "../components/Carousel";
import AppBar from "../components/AppBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import About from "../components/About";
import View from "../components/View";
import Bento from "../components/Bento";
import FAQ from "../components/FAQ";

const Landing = () => {
  return (
    <div className="overflow-x-hidden">
      <AppBar />

      {/* Hero Section */}
      <Hero />
      <About />
      <View />
      <Bento />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Landing;
