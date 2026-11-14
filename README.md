# Nullpunkt

Zero-Based-Budget für CHF und EUR. Jeder Franken bekommt eine Aufgabe, bis Einnahmen minus Budget null ergibt.

## Datenschutz

- Alle Daten bleiben auf deinem Gerät, verschlüsselt mit deinem App-Passwort (AES-GCM 256, Schlüssel per PBKDF2).
- Die App sendet nichts an einen Server. Eine Sicherheitsregel (Content Security Policy) verbietet jede Verbindung nach aussen.
- Dieses Repository enthält nur den Code, niemals Finanzdaten.

**Lade nie Backups, CSV-Dateien oder Kontoauszüge in dieses Repository hoch.** Es ist öffentlich.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | die ganze App |
| `sw.js` | Offline-Betrieb, speichert nur die App-Dateien |
| `manifest.webmanifest` | Name, Farben und Symbole für den Startbildschirm |
| `icon-*.png` | App-Symbole |

## Updates

1. Neue `index.html` hochladen.
2. In `sw.js` die `VERSION` erhöhen und ebenfalls hochladen.
3. Nach einer Änderung am Skript muss die Prüfsumme in der Content Security Policy von `index.html` neu berechnet werden, sonst startet die App nicht. Deine Daten bleiben dabei unverändert.
