import  View  from "./components/View";
import About from "./components/About";
import AppBar from "./components/AppBar";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Hero from "./components/Hero";


const Landing = () => {
  return (
    <div className="overflow-x-hidden">
      <AppBar />

      {/* Hero Section */}
      <Hero />
      <About />
      <View />
    
      <FAQ />
      <Footer />
    </div>
  );
};

export default Landing;
