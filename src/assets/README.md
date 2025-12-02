# Assets Ordner für WCD(E)

Lege hier alle Bilder, Logos und anderen statischen Dateien ab, die du in React-Komponenten importieren möchtest.

Beispiele für empfohlene Struktur:

- `src/assets/logos/` – Logos (z.B. Wortmarke, Icon-Varianten)
- `src/assets/people/` – Portraits von Personen
- `src/assets/portfolio/` – Portfolio- und Projektbilder

In deinen Komponenten kannst du Dateien dann so importieren (Vite + TypeScript):

```ts
import heroImage from "@/assets/portfolio/hero-placeholder.jpg";
import logoMark from "@/assets/logos/wcde-logo.svg";
```

Der Alias `@` zeigt dabei auf den `src`-Ordner.


