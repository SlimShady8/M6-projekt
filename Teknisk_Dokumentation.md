# Teknisk dokumentation – GameFund 

Denne fil beskriver den tekniske opbygning af GameFund-projektet: hvilke
teknologier vi bruger, hvordan filerne hænger sammen, og hvordan de centrale
dele af koden fungerer.

> **Om projektet:** GameFund er en crowdfunding-hjemmeside for to spil – Snake
> og Tetris – som vi har udviklet fra bunden. Siden er bygget i ren HTML, CSS
> og JavaScript uden frameworks.

---

## Indholdsfortegnelse

1. [Teknologier](#teknologier)
2. [Filstruktur](#filstruktur)
3. [Sådan kører du projektet](#sådan-kører-du-projektet)
4. [Arkitektur og dataflow](#arkitektur-og-dataflow)
5. [Snake-spillet](#snake-spillet)
6. [Leaderboard og localStorage](#leaderboard-og-localstorage)

---

## Teknologier

| Teknologi | Bruges til |
|-----------|------------|
| HTML5 | Sidernes struktur og indhold |
| CSS3 | Styling, layout og responsivt design |
| JavaScript (vanilla) | Spil-logik, formularer og leaderboard |
| Canvas API | Tegning af Snake og Tetris |
| localStorage | Lokal lagring af highscores i browseren |

Vi bruger bevidst ingen frameworks, fordi projektet skulle holdes simpelt og
fordi vi var i gang med at lære grundlæggende webudvikling.

---

## Filstruktur

```text
M6-projekt/
├── forside.html        # Forside med kampagne og hero-sektion
├── spil.html           # Oversigt over spillene
├── snake.html          # Snake-spillet (canvas + HUD)
├── game.html           # Tetris-spillet
├── leaderboard.html    # Highscore-tabel
├── belønner.html       # Donations-belønninger
├── donate.html         # Donationsformular
├── updates.html        # Kampagne-opdateringer
├── Omos.html           # Om holdet
├── kontakt.html        # Kontaktformular
│
├── style.css           # Fælles styling for alle sider
├── game.css            # Styling specifikt for Snake
│
├── snake.js            # Logik for Snake
├── game.js             # Logik for Tetris
└── leaderboard.js      # Logik for highscore-tabellen
```

Hver side er en selvstændig HTML-fil, der deler `style.css`. Spillene har deres
egen JavaScript-fil, så logikken er adskilt fra præsentationen.

---

## Sådan kører du projektet

Projektet kræver ingen installation eller server – det er statiske filer.

1. Klon repository'et:
   ```bash
   git clone https://github.com/SlimShady8/M6-projekt.git 
   ```
2. Åbn `forside.html` i en browser (dobbeltklik eller højreklik → "Åbn med").

> **Tip:** Hvis du bruger VS Code, kan udvidelsen *Live Server* automatisk
> genindlæse siden, når du retter i koden.

---

## Arkitektur og dataflow

Siderne er forbundet via navigationsmenuen øverst. Den centrale "rejse" for en
bruger er at finde frem til at spille et spil eller støtte kampagnen:

```text
forside.html ──► spil.html ──► snake.html ──► (spiller, sætter score)


Når en spiller dør i Snake, gemmes scoren i browserens `localStorage`.
`leaderboard.html` læser de gemte scores og viser dem sammen med en liste af
standard-scores.

---

## Leaderboard og localStorage

Highscores gemmes lokalt i browseren under nøglen `snakeScores`. Det betyder, at
hver bruger ser sine egne scores – der er endnu ikke en fælles server-baseret
leaderboard (det er en planlagt fremtidig funktion).

Når spillet slutter, tilføjes scoren til listen, som sorteres og afkortes til de
10 bedste:

```js
let scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
scores.push({ score, date: new Date().toLocaleDateString('da-DK') });
scores.sort((a, b) => b.score - a.score);
localStorage.setItem('snakeScores', JSON.stringify(scores.slice(0, 10)));
```

`leaderboard.js` fletter derefter brugerens lokale scores sammen med en liste af
standard-scores og viser det hele i tabellen på `leaderboard.html`.

---

*Dokumentationen vedligeholdes løbende i takt med at projektet udvikles.*
