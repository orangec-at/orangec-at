import ContactForm from "@/components/contact/contact-form";
import ContactHero from "@/components/contact/contact-hero";
import SocialLinks from "@/components/contact/social-links";

export default function ContactPage() {
  return (
    <main className="px-4 py-8 md:px-16 md:py-12 space-y-12">
      <ContactHero />
      <SocialLinks />
      {/* ContactForm 사용 시 주석 해제 */}
      <ContactForm />
    </main>
  );
}