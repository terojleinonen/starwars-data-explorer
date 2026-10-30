# Alkuperäisen trilogian versiot — 26.10.2026

Sama elokuvateos voi sisältää useita versioita, julkaisupäiviä ja versioon liittyviä työryhmätietoja. Vuoden 1997 Special Edition on uudistettu versio, ei uusi elokuvateos eikä myöhempien kotitallenneversioiden yhteisnimitys.

## Tarkastetut julkaisupäivät

Päivät tarkoittavat Yhdysvaltain teatterijulkaisua. Ne eivät ole Suomen ensi-iltoja tai väitteitä maailman ensimmäisestä kutsuvierasnäytöksestä.

| Elokuva | Alkuperäinen teatteriversio | Vuoden 1997 Special Edition |
| --- | --- | --- |
| A New Hope | 25.5.1977 | 31.1.1997 |
| The Empire Strikes Back | 21.5.1980 | 21.2.1997 |
| Return of the Jedi | 25.5.1983 | 14.3.1997 |

Lähteet: [AFI: A New Hope](https://catalog.afi.com/Catalog/MovieDetails/55187), [AFI: Empire](https://catalog.afi.com/Film/56403-THE-EMPIRESTRIKESBACK), [AFI: Jedi](https://catalog.afi.com/Film/58057-RETURN-OF-THE-JEDI) ja [Box Office Mojon Lucasfilm-julkaisuluettelo](https://www.boxofficemojo.com/brand/bn4168284674/?sort=releaseDate&sortDir=asc). Päivät tarkastettiin käsin. Julkisesta luettelosta ei tuotu tietokantakopiota eikä sen saatavuutta tulkittu avoimeksi lisenssiksi.

Jedin vuoden 1997 julkaisu oli aluksi ilmoitettu 7. maaliskuuta. Tämä löytyy [UPI:n 30.1.1997 ennakkojutusta](https://www.upi.com/Archives/1997/01/30/The-most-significant-film-event-of-1997-begins-this/6471854600400/). [StarWars.comin suullinen historia](https://www.starwars.com/news/starwars-com-an-oral-history) kuvaa viikon siirron. Julkaisuluettelo vahvistaa toteutuneeksi päiväksi 14. maaliskuuta. Myös AFI:n historiakommenttiin jäänyt 7. maaliskuuta käsitellään ilmoitettuna, korvattuna ajankohtana. Aikajanalle päätyy vain toteutunut julkaisu.

## Työryhmien erottelu

- A New Hope ja Empire: alkuperäisen tuotannon tuottaja Gary Kurtz. Pilotissa tarkastetut 39 alkuperäistuotannon krediittiä on kohdistettu näihin alkuperäisiin versioihin.
- Jedi: alkuperäisen tuotannon ohjaaja Richard Marquand, tuottaja Howard Kazanjian ja vastaava tuottaja George Lucas. Nämä kolme roolia tarkastettiin AFI:n yksityiskohtaisista tuotantokrediiteistä.
- Vuoden 1997 trilogia: Special Edition -tuottaja Rick McCallum kaikissa kolmessa elokuvassa.
- A New Hopen vuoden 1997 työryhmästä lisäksi Tom Kennedy, ILM visual effects producer; Empiren vuoden 1997 työryhmästä Dave Carson, visual effects supervisor.

Vuoden 1997 roolien lähteenä on [Lucasfilmin / Foxin aikalaislehdistöpaketin säilynyt skannaus](https://starwarsviscomp.wordpress.com/wp-content/uploads/2025/02/se-press-kit-main.pdf). Lähde on kolmannen osapuolen arkistossa, joten sitä ei merkitä nykyiseksi viralliseksi verkkopalveluksi. Paikannukset PDF:ssä: McCallum sivu 2 (painettu 1), Kennedy sivut 6–7 (painetut 5–6), Carson sivu 11 (painettu 10). [StarWars.comin McCallum-artikkeli](https://www.starwars.com/news/an-independent-future-for-rick-mccallum) tukee yhteyttä vuoden 1997 trilogiaan. Skannausta, kuvia tai lähdetekstejä ei kopioida sivustolle.

Lehdistöpaketin sivuilla 4–5 kuvattu tekniikan, ajan ja budjetin rajoituksiin palaaminen ilmaistaan Lucasin omana perusteluna. Arkisto ei arvota yhtä versiota muita oikeammaksi.

## Tietokanta ja käyttöliittymä

Syöte: `data/reviews/original-trilogy-editions.json`. Rakentaja: `scripts/apply-editions.mjs`. Erilliset taulut `film_editions`, `release_events` ja `edition_credits`; alkuperäiset pilotin krediitit käyttävät myös versioviitettä. Jokaisella versiolla, julkaisutapahtumalla ja uudella krediitillä on oma lähdeviite.

Lisäys sisältää kuusi versiota, seitsemän julkaisutapahtumaa ja kahdeksan uutta krediittiä. Jedin viisi faktakenttää tarkastettiin tai täsmennettiin. Muutosloki säilyy tiedostossa `data/reviews/edition-change-log.json`. Nykyinen tietokanta sisältää 285 tietuetta, 2 274 faktakenttää ja 1 182 suunnattua yhteyttä; tarkastetuissa kerroksissa on yhteensä 225 lähdeviitettä. Elokuvia on edelleen 13 ja sarjoja 11.

Kolmen elokuvasivun Versions & releases -osio näyttää alkuperäisen version, vuoden 1997 version ja valitut työryhmätiedot. Alkuperäisen tuotannon ja uudistustyön krediittejä ei yhdistetä yhdeksi erottelemattomaksi listaksi. Aikajana näyttää kolme vuoden 1997 uusintajulkaisua ja laskee teokset sekä versiojulkaisut erikseen.

## Rajaus ja jatkotyö

Tämä on valittu julkaisuhistoria. Myöhemmät DVD-, Blu-ray- ja muut kotitallenneversiot, eri maiden julkaisut, yksittäiset esityskopiot, ääniraidat ja täydelliset lopputekstit odottavat omaa lähdetarkastustaan. Hahmojen ja paikkojen esiintymisyhteyksiä ei vielä ole jaoteltu leikkausversioittain. Jedin muiden tietojen tarkastus on kesken; versiohistorian lisääminen ei merkitse koko elokuvasivun tarkastusta.

## Varmistus

Koko tarkistusketju läpäistiin: tietokannan eheys ja lähdekohdistukset, kooditarkastus, tyypit sekä tuotantokäännös (559 esirenderöityä reittiä). Viimeisen pienen esitysmuutoksen jälkeen tuotantokäännös tarkistettiin uudelleen.

Kaikki kolme elokuvasivua tarkastettiin selaimessa 1 248, 390 ja 320 pikselin leveyksillä: oikeat versiot, tuottajat, päivät, lähdeankkurit ja ei vaakasuuntaista ylivuotoa. Työryhmän avaus näppäimistöllä toimii 320 pikselin leveydessä. Lähdeviite avaa oikean lähteen ja sen tarkastuskohdat. Aikajanan suodattimet näyttävät 24 + 3, 13 + 3 ja 11 + 0 teosta ja versiojulkaisua, ja suora linkki avaa Jedin vuoden 1997 version. Andorin 25 krediittiä säilyvät, eikä sarjasivulle tule elokuvien versio-osiota. Selaimen lokissa ei ollut varoituksia tai virheitä.

Paikallinen esikatselu: http://127.0.0.1:3100/films/a-new-hope#versions. Ei julkista käyttöönottoa.
