import React from "react";
import PageHero from "../PageHero";
import heroImage from "../../assets/Requirements-hero.png";

export default function RequirementsHero() {
  return (
    <PageHero
      eyebrow="Rental Policies"
      title="Rental Requirements"
      subtitle="Everything you need to know before you hit the road. We keep our process transparent so you can focus on the journey."
      image={heroImage}
    />
  );
}