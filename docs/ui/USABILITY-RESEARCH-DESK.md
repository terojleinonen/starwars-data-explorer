# The Galactic Memory – tutkimuspöydän käytettävyysläpikäynti

Päivä: 6.11.2026. Esikatselu: http://127.0.0.1:3100/research

## Menetelmä ja rajat

Tämä on avustajan tekemä tehtäväpohjainen selainläpikäynti. Mukana ei ollut ulkopuolisia käyttäjiä. Tulokset osoittavat toimivat polut ja havaitut käyttöliittymäongelmat; ne eivät mittaa ensikertalaisen opittavuutta, käyttäjätyytyväisyyttä tai todellisia suoritus­aikoja. Työpöytänäkymän lisäksi tarkistettiin 390 pikselin mobiilinäkymä ja näppäimistöllä poistuminen.

Työtä varten luotiin erillinen `[Testi] Alderaanin jäljet` -pöytä. Kolmea aiempaa tutkimuspöytää ei käytetty muokkaustehtävissä. Testipöytä on jätetty esikatseluun esimerkkitutkimukseksi.

## Tehtävät

| Tehtävä | Käytännön tavoite | Läpikäynnin tulos |
| --- | --- | --- |
| 1. Kerää ja tarkista | Etsi Alderaan nimihauilla, tarkastele sen yhteyksiä Kuolemantähteen ja Bail Organaan, lue lähdeviitteet ja kerää kolme tietuetta samaan pöytään. | Onnistui. Keräys säilytti graafin valinnan ja käytti uutta aktiivista testipöytää. Kuolemantähden yhteydessä näkyi lähdekonteksti `History / Tarkin destroys Alderaan`. |
| 2. Järjestä havainto | Ryhmittele Alderaan ja Kuolemantähti, lisää oma tutkimuskysymys ja liitä se Bail Organaan omana tulkintayhteytenä. | Onnistui. Pöydälle jäi kolme arkistokorttia, erillinen muistiinpano, nimetty kahden kortin ryhmä ja yksi selvästi merkitty oma yhteys. Arkiston suhteet ja oma kysymys erottuivat. |
| 3. Jatka tutkimusta | Tallenna paluupaikka, lataa sivu uudelleen, avaa näkymä keskittymistilassa ja tarkista lähde lukunäkymästä. | Tallennus palautti neljä korttia, muistiinpanon, ryhmän, oman yhteyden ja näkymän. Työkalupaneelin väistymiseen sekä lähdepolkuun liittyvät esteet korjattiin ja polku uusittiin onnistuneesti. |

## Havaitut ongelmat ja tehdyt korjaukset

### Lähdepolku puuttui keskittymistilan lukunäkymästä

Ennen korjausta yhteysluettelo oli keskittymistilassa piilossa. Verkkonäkymässä lähteeseen pääsi viivasta, mutta listamuodossa viivoja ei ole. Käyttäjä joutui poistumaan keskittymistilasta tarkistaakseen yhteyden.

Korjaus: keskittymistilan yläpalkin **Connections** avaa arkiston suhteiden ja omien tulkintojen luettelon myös lukunäkymässä. Suhteesta avautuu lähdepaneeli. Esc sulkee ensin lähteen, sitten yhteysluettelon ja lopuksi keskittymistilan. Polku tarkistettiin myös mobiilissa.

### Arkistoyhteyden nuoli saattoi vihjata väärää suuntaa

Ennen korjausta pöydän lähdeotsikko ja luettelo näyttivät `Alderaan → Death Star` sekä tallennetun suhdeluokan `destroyed`. Yhdistelmä saattoi johtaa lukemaan tapahtuman väärin päin, vaikka lähdekonteksti kertoi Tarkinista ja Alderaanista. Graafin tietuesivulla käytettiin jo vastavuoroista yhteysmerkkiä.

Korjaus: arkiston suhteet esitetään pöydällä muodossa `Alderaan ↔ Death Star`. Tallennettu luokka säilyy näkyvissä ja muuttumattomana `Recorded relation` -tekstinä. Lähdekonteksti ratkaisee tapahtuman merkityksen. Omien käyttäjän määrittämien yhteyksien nuolta ei muutettu.

### Tallennettu näkymä jäi työkalupaneelin taakse

Ennen korjausta **Open view** palautti sijainnin ja zoomauksen mutta jätti työkalupaneelin tutkimuksen päälle. Avaamisen vahvistus oli keskittymistilassa piilossa.

Korjaus: tallennetun näkymän avaaminen sulkee sivupaneelit ja palauttaa kohdistuksen Tools-painikkeeseen. Avaamisen palaute näkyy keskittymistilan yläpalkissa; mobiilissa sama palaute on ruudunlukijan saatavilla. Uusintakierroksella työkalupaneelin näkyvyys oli palautuksen jälkeen `false` ja tutkimuskysymys säilyi kokonaisena.

## Tarkistukset

- Käyty läpi tehtävät 1–2. Tehtävän 3 esteet ja suhteen esitystapa tarkistettiin uudelleen korjausten jälkeen; lähdepolku toimii keskittymistilan lukunäkymästä.
- Tarkistettu 390 px mobiilinäkymä: sivun leveys ja vieritysleveys molemmat 390 px, lähdepaneeli näkyvissä.
- Esc sulki lähteen, yhteysluettelon ja keskittymistilan oikeassa järjestyksessä; kohdistus palasi Focus mode -painikkeeseen.
- TypeScript, muokatun komponentin ESLint ja tuotantokooste hyväksytty. Tuotantokooste sisälsi 1039 sivua.
- Kaikki 113 arkistodatatiedostoa säilyivät SHA-256-vertailussa muuttumattomina. Korjaukset koskivat käyttöliittymää ja sen tyylejä.

## Seuraava oikeiden käyttäjien testi

Pyydä 3–5 ensikertalaista tekemään samat tehtävät ilman valikkonimien tai etenemisreitin paljastamista. Pyydä ajattelemaan ääneen. Kirjaa ensimmäinen valinta, epäröinnit, avun tarve, loppuun pääsy sekä se, osaako käyttäjä omin sanoin erottaa lähteistetyn suhteen omasta tulkinnastaan. Anna lopuksi tehtävä jatkaa samaa tutkimusta sivun latauksen jälkeen.

Tärkein avoin kysymys on, löytääkö ensikertalainen graafikeräyksen ja ymmärtääkö hän tutkimuspöydän tarkoituksen. Avustajan läpikäynti ei ratkaise tätä.
