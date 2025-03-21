# Mathe Prinzessin - Spielerisches Mathe-Lernen für Kinder


**Live Demo:** [https://nokey-54.github.io/1x1-trainer/](https://nokey-54.github.io//1x1-trainer/)

## Übersicht

Mathe Prinzessin ist eine liebevoll gestaltete, webbasierte Mathe-Lern-App für Grundschulkinder. Die App konzentriert sich auf Multiplikation und Division in einer kinderfreundlichen Prinzessinnen-Umgebung, die das Lernen zum Vergnügen macht.


## Features

- **Kindgerechtes Design**: Freundliche Prinzessinnen-Thematik mit animierten Elementen
- **Progressive Schwierigkeitsstufen**: Automatische Anpassung an die Fähigkeiten des Kindes
- **Trophäen-System**: Bronze, Silber, Gold und Rubin-Trophäen als Motivationsanreize
- **Visuelle Hilfen**: Anschauliche Darstellungen von Multiplikation und Division
- **Meilenstein-Feierlichkeiten**: Besondere Animationen bei Erreichen von Zielen
- **Mobile-First**: Optimiert für Tablets und Smartphones, einschließlich anpassbarer Tastatur
- **Teilen-Funktion**: Erfolge können als Bild geteilt werden
- **Offline-Nutzung**: Funktioniert auch ohne Internetverbindung nach dem ersten Laden
- **Responsive Design**: Passt sich perfekt an alle Bildschirmgrößen an

## Technologien

- React.js
- Styled Components
- localStorage für Fortschrittsspeicherung
- Progressive Web App (PWA) mit Home-Screen-Support

## Installation und lokale Ausführung

1. Repository klonen:
   ```
   git clone https://github.com/Trapify-de/mathe-prinzessin.git
   ```

2. Ins Projektverzeichnis wechseln:
   ```
   cd mathe-prinzessin
   ```

3. Abhängigkeiten installieren:
   ```
   npm install
   ```

4. Entwicklungsserver starten:
   ```
   npm start
   ```

5. Im Browser aufrufen:
   ```
   http://localhost:3000
   ```

## Deployment auf GitHub Pages

1. Installiere die gh-pages Abhängigkeit:
   ```
   npm install --save gh-pages
   ```

2. Füge in `package.json` folgende Einträge hinzu:
   ```json
   "homepage": "https://yourname.github.io/1x1-trainer",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploye auf GitHub Pages:
   ```
   npm run deploy
   ```

## Benutzung

- **Multiplikation und Division**: Aufgaben werden automatisch generiert
- **Schwierigkeitsgrade**: Passen sich automatisch an die Leistung des Kindes an
- **Trophäen**: Werden bei 10, 25, 50 und 100 Punkten freigeschaltet
- **Hinweis-System**: Hilft bei schwierigen Aufgaben mit visuellen Darstellungen
- **Highscore**: Der höchste Punktestand des Tages wird lokal gespeichert

## Lizenz

MIT

---