# Elokuvien ja sarjojen yksilölliset teoskortit

Toteutettu 26.10.2026 neljän hyväksytyn korttikokeilun pohjalta. Kaikilla nykyisen kokoelman 13 elokuvalla ja 11 sarjalla on oma käsin sommiteltu kuvio, väripaletti ja nimiasettelu. Yhteinen arkistokehys, sivujen rakenne, taustakuvat ja selaustoiminnot säilyvät.

## Elokuvat

| Teos | Sävy ja tunniste |
| --- | --- |
| A New Hope | Lämmin kulta, valopiste ja kiertoradat |
| The Empire Strikes Back | Jäänsininen, vino leikkaus ja kerrostuva varjo |
| Return of the Jedi | Sammalenvihreä, avautuvat kaaret ja nouseva viiva |
| The Phantom Menace | Luumu ja hopea, siirtynyt kaksoispimennys |
| Attack of the Clones | Hillitty turkoosi, toistuvat pystypinnat |
| Revenge of the Sith | Kupari ja tumma punainen, murtuva vinoviiva |
| The Clone Wars | Antiikkikulta, limittyvät ympyrät ja vaakajuovat |
| The Force Awakens | Vaalea sininen, heräävä valopulssi |
| Rogue One | Oliivi ja luonnonvalkoinen, katkeava pystysignaali |
| The Last Jedi | Tumma viininpunainen, ympyrän halkaiseva valotaso |
| Solo | Meripihka ja savunsininen, reitti ja kolme valopistettä |
| The Rise of Skywalker | Violetti ja hopea, nouseva tähtikuvio |
| The Mandalorian and Grogu | Salvia ja hiekan sävyt, kaksi erikokoista kiertorataa |

## Sarjat

| Teos | Sävy ja tunniste |
| --- | --- |
| Clone Wars: 2D Micro-Series | Haalistunut oranssi, kaksi vinoa pintaa |
| The Clone Wars | Sininen, kerrostuva muodostelma |
| Star Wars Rebels | Lämmin kupari, säteittäin avautuvat linjat |
| The Mandalorian | Hiekka ja metalli, horisontti ja kehä |
| The Bad Batch | Salvianvihreä ja teräs, viisi eritahtista viivaa |
| Andor | Hiili ja punainen, ruudukko ja katkeava signaali |
| Obi-Wan Kenobi | Hiekka ja indigo, kaksi kaarta ja risteävä viiva |
| Ahsoka | Norsunluu ja tumma turkoosi, kohtaavat kaaret |
| Skeleton Crew | Sininen ja syaani, neljän pisteen tähtikuvio |
| The Acolyte | Violetti, katkeava kehä ja pimennys |
| Maul – Shadow Lord | Hillitty punainen ja hiili, kolme murtuvaa linjaa |

## Toteutus ja sisältö

Kuviot ovat alkuperäistä SVG-geometriaa ja pinnat CSS-väripintoja. Mukana ei ole virallisia julisteita, kuvakaappauksia tai tunnuksia. Korttien laajennus ei lisää ladattavia kuvatiedostoja, ulkoista palvelua tai uusia riippuvuuksia.

`src/lib/archive/title-card-designs.ts` määrittää kaikki 24 tunnistetta, nimirivit, värit ja kuviot. `src/components/archive/title-card.tsx` renderöi yhteisen rakenteen. Kortti valitaan kokoelman ja pysyvän slug-osoitteen yhdistelmällä, joten The Clone Wars -elokuva, sarja ja 2D-minisarja saavat eri ilmeet.

Julkaisuvuosi, tuotantomuoto sekä ohjaaja tai tekijä luetaan olemassa olevasta omasta tietokannasta. Animaatiosarjat merkitään animaatioiksi ja episodinumeroa vailla olevat elokuvat elokuviksi. Suunnittelu ei lisää uusia sisältöfaktoja tai muuta tietojen tarkistustilaa.

Nimien koko mukautuu kortin leveyteen. Mobiilissa suurin nimikoko on rajattu, jotta kortit säilyvät samankorkuisina myös leveässä kahden palstan näkymässä. Kaikki metatiedot näkyvät kosketusnäytöllä suoraan. Näppäimistökohdistus kirkastaa reunaa; pieni osoitinliike kunnioittaa vähennetyn liikkeen asetusta.
