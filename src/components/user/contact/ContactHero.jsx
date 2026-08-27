import PageHero from "../PageHero";
import heroImage from "../../../assets/contact-hero.png";

export default function ContactHero() {
  return (
    <PageHero
      eyebrow="Contact"
      title="Get in Touch"
      subtitle="Have questions about our fleet or rental terms? Our professional team is here to ensure your journey is smooth and reliable."
      image={heroImage}
    />
  );
}