import styles from "../styles/LandingPage.module.css";

export default function HeroSection(){
    return(
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.holoPanel}>
              <div className={styles.panelTop}>
                <div className={styles.badge}>
                  <span className={styles.badgeDot} />
                  Galactic Explorer
                </div>
                <div className={styles.meta}>
                  <span>SWAPI</span>
                  <span className={styles.metaSep}>•</span>
                  <span>Cartography</span>
                </div>
              </div>
              <h1 className={styles.title}>
                Command-grade SWAPI
                <span className={styles.titleAccent}> Cartography</span>
              </h1>
              <p className={styles.subtitle}>
                Browse planets, starships, people, and factions through a tactical
                Rebel war-map in light mode — and a cinematic starfield in dark mode.
              </p>
              <div className={styles.microRow}>
                <div className={styles.microItem}>
                  <span className={styles.microLabel}>Mode</span>
                  <span className={styles.microValue}>
                    Cinematic Night Ops
                  </span>
                </div>
                <div className={styles.microItem}>
                  <span className={styles.microLabel}>Latency</span>
                  <span className={styles.microValue}>
                    Optimized Prefetch
                  </span>
                </div>
                <div className={styles.microItem}>
                  <span className={styles.microLabel}>UI</span>
                  <span className={styles.microValue}>
                    Holographic Cards
                  </span>
                </div>
              </div>
              <div className={styles.panelGlow} />
            </div>
          </div>
        </section>
    );
}