"use client";

import HoloCard from "@/components/cards/HoloCategoryCard";
import HeroIntro from "@/components/landing/HeroIntro";
import AnimatedCardGrid from "@/components/landing/AnimatedCardGrid";
import AnimatedCard from "@/components/landing/AnimatedCard";
import { useParallax } from "@/hooks/useParallax";

import styles from "./LandingPage.module.css";
import PageWrapper from "../layout/PageWrapper";

export default function LandingPage() {
  const titleOffset = useParallax(0.18);
  const cardsOffset = useParallax(0.32);

  return (
    <div className={styles.page}>
      <PageWrapper>

      <section className={styles.hero}>
        <div
          className={styles.heroContent}
          style={{
            transform: `translateY(${titleOffset * -1}px)`
          }}
        >
          <HeroIntro 
            title="Your Gateway to the Star Wars Universe" 
            subtitle="Browse characters, planets, starships and more from the Star Wars universe powered by SWAPI."
          />
        </div>

        <div
          className={styles.categories}
          style={{
            transform: `translateY(${cardsOffset * -1}px)`
          }}
        >
          <AnimatedCardGrid>
            <AnimatedCard >
              <HoloCard 
                title="People" 
                subtitle="Individuals & factions" 
                href="/people"
              />
            </AnimatedCard>

            <AnimatedCard >
              <HoloCard 
                title="Planets" 
                subtitle="Worlds & environments" 
                href="/planets"
              />
            </AnimatedCard>

            <AnimatedCard >
              <HoloCard 
                title="Starships" 
                subtitle="Interstellar vessels" 
                href="/starships"
              />
            </AnimatedCard>

            <AnimatedCard >
              <HoloCard 
                title="Films" 
                subtitle="Cinematic records" 
                href="/films"
              />
            </AnimatedCard>

            <AnimatedCard >
              <HoloCard 
                title="Species" 
                subtitle="Biological classifications" 
                href="/species"
              />
            </AnimatedCard>

            <AnimatedCard >
              <HoloCard 
                title="Vehicles" 
                subtitle="Ground & atmospheric transport" 
                href="/vehicles"
              />
            </AnimatedCard>
          </AnimatedCardGrid>
        </div>
      </section>
      </PageWrapper>
    </div>
  );
}