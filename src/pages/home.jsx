import Hero from "../components/Hero";
import About from "../components/About";
import About2 from "../components/About2";
import Home_features from "../components/Home-features";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <Hero />
      <About />
      <Home_features />
      <About2 />
      

    </main>
  );
}
