import { MotionProvider } from "@/components/MotionProvider";
import { SparkleOverlay } from "@/components/ui/SparkleOverlay";
import { BackgroundMusic } from "@/components/ui/BackgroundMusic";
import { InvitationIntro } from "@/components/InvitationIntro";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { LoveStory } from "@/components/LoveStory";
import { WeddingDetails } from "@/components/WeddingDetails";
import { Godparents } from "@/components/Godparents";
import { Timeline } from "@/components/Timeline";
import { Locations } from "@/components/Locations";
import { Musicians } from "@/components/Musicians";
import { Gallery } from "@/components/Gallery";
import { RSVPForm } from "@/components/RSVPForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <MotionProvider>
      <a
        href="#countdown"
        className="sr-only z-[200] rounded-full bg-ivory px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Sari la conținut
      </a>
      <InvitationIntro />
      <SparkleOverlay />
      <BackgroundMusic />
      <Header />
      <main>
        <Hero />
        <Countdown />
        <LoveStory />
        <WeddingDetails />
        <Godparents />
        <Timeline />
        <Locations />
        <Musicians />
        <Gallery />
        <RSVPForm />
      </main>
      <Footer />
    </MotionProvider>
  );
}
