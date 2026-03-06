import { AnimatedCard, AnimatedCardGrid} from "@/ui/motion";
import { HoloCard } from "@/ui/HoloCards";
import styles from "../styles/LandingPage.module.css";

export default function CategorySection(){
    return(
    <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.h2}>Choose your category</h2>
            <p className={styles.p}>
              Explore records from the Galactic Archive.
            </p>
          </div>
          <AnimatedCardGrid>
            <AnimatedCard>
              <HoloCard
                title="People"
                subtitle="Individuals & factions"
                href="/people"
                icon="people"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Planets"
                subtitle="Worlds & environments"
                href="/planets"
                icon="planets"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Starships"
                subtitle="Interstellar vessels"
                href="/starships"
                icon="starships"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Films"
                subtitle="Cinematic records"
                href="/films"
                icon="films"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Species"
                subtitle="Biological classifications"
                href="/species"
                icon="species"
              />
            </AnimatedCard>
            <AnimatedCard>
              <HoloCard
                title="Vehicles"
                subtitle="Ground & atmospheric transport"
                href="/vehicles"
                icon="vehicles"
              />
            </AnimatedCard>
          </AnimatedCardGrid>
        </section>
    );
}