import HeroSection from "@/components/homeComponents/HeroSection";
import GradientWaves from "@/components/homeComponents/GradientWaves";
import Footer from "@/components/Footer";

export default function Home() {
  
  return (
    <main className="relative flex flex-col items-center min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 w-full h-full">
        <GradientWaves
          horizonColor="#143460"
          waveColor="#3F608C"
          crestColor="#7A9DCC"
          speed={0.4}
          amplitude={2.8}
          waveScale={0.7}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.2}
          opacity={1}
          mouseInteraction
          parallaxStrength={0.5}
          grain={false}
        />
      </div>

      <HeroSection />
      <Footer />
    </main>
  );
}