import Hero from "@/sections/Hero";
import Invitation from "@/sections/Invitation";
import SectionNav from "@/components/SectionNav";
import ScheduleSection from "@/sections/ScheduleSection";
import RegistrationSection from "@/sections/RegistrationSection";
import VisaSection from "@/sections/VisaSection";
import HotelSection from "@/sections/HotelSection";
import RentCarSection from "@/sections/RentCarSection";
import ContactSection from "@/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Invitation />
      <SectionNav />
      <ScheduleSection />
      <RegistrationSection />
      <VisaSection />
      <HotelSection />
      <RentCarSection />
      <ContactSection />
    </>
  );
}
