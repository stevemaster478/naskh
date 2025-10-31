## Naskh-Free

Badge: [Build], [Lint], [Tests], [License]

Applicazione full‑stack TypeScript con Express (API) e Vite + React (client), TailwindCSS, Drizzle ORM e Neon/Postgres.

### Requisiti
- **Node.js** ≥ 20
- **npm** (oppure pnpm/yarn se preferisci; gli esempi usano npm)
- Un database Postgres (es. Neon)

### Setup rapido
1) Clona il repository e installa le dipendenze:
```bash
npm install
```

2) Crea il file `.env` partendo da `env.example` e completa i valori:
```bash
cp env.example .env
```
- `GEMINI_API_KEY`: chiave API per @google/genai
- `DATABASE_URL`: stringa di connessione Postgres (es. Neon)
- `PORT` (opzionale in locale): default 5001 in example, runtime usa `PORT` o 5000

3) (Opzionale) Allinea lo schema DB con Drizzle:
```bash
npm run db:push
```

4) Avvia in sviluppo:
```bash
npm run dev
```
API e client verranno serviti sul `PORT` configurato (dev: Express + Vite middleware).

### Script principali
- `npm run dev`: avvia server Express in modalità sviluppo con Vite
- `npm run build`: build client (Vite) e bundle server (esbuild) in `dist/`
- `npm run start`: avvia la build di produzione da `dist/`
- `npm run check`: TypeScript type‑check
- `npm run db:push`: applica lo schema Drizzle al database

### Struttura del progetto (principale)
- `server/index.ts`: bootstrap Express, logging richieste `/api`, error handler, integrazione Vite in dev
- `server/routes/*`: registrazione rotte API (vedi `registerRoutes`)
- `client/*` o root Vite: codice React/Tailwind
- `env.example`: template variabili ambiente

### Variabili d'ambiente
Esempio (`.env`):
```env
GEMINI_API_KEY=...
DATABASE_URL=postgres://...
# Opzionale in locale; in hosting PORT è impostata dall'ambiente
PORT=5001
```

Note:
- In produzione il server legge `PORT` e fa fallback a 5000.
- Non committare `.env`.

### Database (Drizzle ORM + Postgres)
- Imposta `DATABASE_URL` (es. Neon) e lancia `npm run db:push` per sincronizzare.
- Mantieni gli schemi e le migrazioni versionati secondo le convenzioni del team.

### Quality & Best Practices
- **TypeScript**: mantieni tipi espliciti sulle API pubbliche; evita `any`.
- **Error handling**: usa l’error handler centralizzato; non catturare errori senza gestirli.
- **Logging**: le richieste `/api` sono loggate con durata e payload (troncato). Non loggare segreti.
- **Sicurezza**:
  - Valida input con Zod sui boundaries (controller/route)
  - Evita dati sensibili nei log e nelle risposte di errore
  - Usa `express.json({ verify })` solo se necessario per webhooks; non fidarti di `rawBody` altrove
  - Imposta CORS, rate‑limit e helmet in produzione
- **Performance**:
  - Evita lavoro sincrono pesante nel ciclo di richiesta
  - Usa query DB indicizzate e paginazione
  - Memoizza nel client con React Query dove opportuno
- **Front‑end**:
  - Componenti piccoli e riutilizzabili; preferisci composizione a props monolitiche
  - Gestisci stato server con React Query; stato locale con useState/useReducer
  - Tailwind: usa varianti e `tailwind-merge` per classi condizionali

### Stile di codice
- Segui le regole del formatter (Prettier se presente) e del linter (ESLint se configurato)
- Nomi descrittivi; early‑return; niente nesting profondo; commenti solo per contesto non ovvio

### Git & branching
- Branch principale: `main`
- Convenzioni commit: **Conventional Commits**
  - `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, `refactor: ...`, `test: ...`, `build: ...`
- PR piccole, auto‑contenute, con descrizione e checklist

### CI/CD (suggerito)
- Workflow: install → type‑check → lint → build → test → deploy
- Cache dipendenze e artefatti; verifica `.env` richieste dal deploy target

### Avvio in produzione
1) Build: `npm run build`
2) Avvio: `npm run start`
3) Assicurati che `PORT` e `DATABASE_URL` siano presenti nell’ambiente

### Troubleshooting
- Porta occupata: cambia `PORT` nel `.env`
- Type errors: `npm run check`
- Build fallisce: pulisci `node_modules` e reinstalla; verifica versioni Node
- DB: controlla la reachability di `DATABASE_URL` e i permessi

### Licenza
MIT (vedi `package.json`).

### Contributi
Apri una issue o una pull request con una descrizione chiara e screenshot/log quando utile.


