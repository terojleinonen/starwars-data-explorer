# Ehdotus: Star Wars Universe -arkisto

Hyväksytty elokuvallinen etusivu toimii prologina. Sen jälkeen avautuu scifi-arkisto, jossa teokset, hahmot, paikat ja teknologia liittyvät toisiinsa. Yhteinen tumma pohja, lämmin paperinvalkoinen teksti, tiivis otsikkokirjasin ja pienet arkistomerkinnät sitovat osiot etusivuun.

## Toteutetut näkymät

| Sivu | Oma teema | Sisältö ja toiminta |
| --- | --- | --- |
| Arkiston yleiskuva `/archive` | Kulta ja avaruushorisontti | Sisäänkäynnit kokoelmiin, nostot ja todelliset tietuemäärät |
| Elokuvat `/films` | Filmikulta | Typografiset kannet, aikakausi- ja kokoelmasuodatus, järjestäminen |
| Sarjat `/series` | Sininen ja laventeli | Sarjagalleria, animaation ja näyteltyjen tuotantojen suodatus |
| Hahmot `/people` | Kupari | Rekisteri, esikatselu, ominaisuudet ja yhteydet |
| Maailmat `/planets` | Turkoosi | Planeettojen kortit, ympäristö ja asukastiedot |
| Tähtialukset `/starships` | Jäänsininen | Alusluokat, tekniset tiedot, lentäjät ja elokuvat |
| Ajoneuvot `/vehicles` | Poltettu oranssi | Kulkuvälineiden rekisteri ja tekniset ominaisuudet |
| Lajit `/species` | Salvianvihreä | Lajit, luokittelu ja niihin liittyvät hahmot |
| Julkaisuaikajana `/timeline` | Neutraali arkisto | Elokuvat ja sarjat oikeiden julkaisuvuosien mukaan |
| Lähteet `/sources` | Neutraali arkisto | Tuonnin alkuperä, tarkistustila ja lähderekisteri |
| Yksittäiset tietosivut | Kokoelman oma väri | Faktat lähdeviitteineen sekä navigoitavat yhteydet muihin tietueisiin |

Sivujen vaihtelu syntyy väreistä, tunnuskuvista ja sisältöön sopivasta asettelusta. Sivupalkki, suodattimet, tekstityylit ja tietosivujen rakenne pysyvät johdonmukaisina. Mobiilissa navigaatio kulkee vaakasuunnassa ja esikatselu siirtyy listan alle. Etusivulle ei lisätty hakua; arkistossa haku kohdistuu avoimeen kokoelmaan.

## Aineisto

Vanhan sivun kuusi kokoelmaa säilytettiin: 260 tietuetta. Niitä täydentää 18 käsin toimitettua elokuva- ja sarjatietuetta virallisilla lähdelinkeillä. Nykyinen yhteismäärä on 278 tietuetta. Aineisto sijaitsee omassa SQLite-tietokannassa eikä sivusto käytä SWAPI-palvelua käyntien tai koonnin aikana.

Tuonnin epävarmuuksia ei piiloteta: vanhojen faktojen yksittäiset lähteet ja aineiston uudelleenkäytön ehdot odottavat tarkistusta. Uudet viralliset viitteet erotetaan vanhan kokoelman tiedoista. Alkuperäiset Anakin- ja Vader-profiilit säilyvät, ja niiden henkilöllisyysyhteys näytetään erillisellä lähteistetyllä linkillä.

Kansikuvat ovat alkuperäisiä typografisia sommitelmia ja avaruuskuvitusta. Ne eivät ole virallisia julisteita. Uutta raskasta kuvituskirjastoa, videota tai jatkuvaa avaruusanimaatiota ei lisätty.

## Jatkokehityksen järjestys

1. Hyväksytään sivujen visuaalinen suunta ja päätetään arkiston julkaistava ensimmäinen sisältölaajuus.
2. Tarkistetaan vanhat faktat yksitellen sopivista ensisijaisista lähteistä ja selvitetään aineiston uudelleenkäytön ehdot.
3. Täydennetään tuotannot sekä hahmojen, paikkojen ja teosten väliset yhteydet. Nykyinen valikoima ei ole täydellinen tuotantoluettelo.
4. Lisätään kaudet, jaksot ja tarinamaailman aikajana, jos ne kuuluvat valittuun laajuuteen. Julkaisujärjestys säilyy erillään tarinan ajasta.
5. Mitataan julkaistun version todelliset lataus- ja käyttökokemusluvut mobiilissa ja tietokoneella.

Tämä ehdotus on toteutettu selattavana paikallisena versiona. Julkista Vercel-julkaisua ei tehty.


## Taustakuvat — toteutettu 26.10.2026

Films-kokeilun pohjalta kuusi muuta kokoelmaa saivat omat alkuperäiset taustakuvansa: sarjat sinilaventelin tähtisumun, hahmot kuparisen kalliomaiseman, maailmat turkoosin planeetan, tähtialukset jäänsinisen hangaarin, ajoneuvot oranssin aavikon ja lajit vihreän metsämaiseman. Samat kuvat jatkuvat kokoelmien tietosivuilla hillitympinä. Kuvat ovat tunnelmakuvitusta, eivät tietueiden lähdeaineistoa tai esityksiä tietystä nimetystä maailmasta.

Yleiskuva, julkaisuaikajana ja lähdesivu käyttävät etusivun olemassa olevaa avaruuskuvitusta hienovaraisena taustana. Hyväksytty etusivu säilyi ennallaan. Otsikoiden, tilastorivien ja luetteloiden sijainnit ja koot säilyivät kaikissa kuudessa uudessa kokoelmanäkymässä samoina kuin ennen muutosta.

Kaikki kuvat sijaitsevat omassa projektissa. Kuudesta uudesta kuvasta tehtiin AVIF- ja WebP-versiot 800, 1200 ja 1672 pikselin leveyksillä. AVIF-tiedostojen koot ovat 5 601–46 574 tavua. Sivukohtainen kuvan valinta ei lataa muiden kokoelmien taustoja. Mobiilissa rajaus ja tummennus sovitetaan erikseen. Sivujen rakennetta, aineistoa tai toimintoja ei muutettu.

Kuvien tiedostopolut ja tarkat generointikehotteet: `artwork/archive-backgrounds.md`.
