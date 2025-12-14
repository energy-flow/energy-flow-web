# Energy Flow Web

Application web Next.js pour la plateforme d'autoconsommation collective Energy Flow.

## Stack technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 16 | Framework React (App Router) |
| React | 19 | UI composants |
| TypeScript | 5.x | Typage statique |
| TailwindCSS | 4 | Styling + dark mode |
| wagmi | 2.19.5 | Hooks smart contracts |
| viem | 2.40.3 | Client Ethereum |
| RainbowKit | 2.2.10 | Connexion wallet |
| React Query | 5.x | Cache serveur |
| Zustand | 5.x | État client |
| shadcn/ui | - | Composants UI |

## Installation

```bash
npm install
```

## Commandes

```bash
npm run dev      # Serveur dev (http://localhost:3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # ESLint
```

## Structure

```
app/
├── (public)/           # Landing page
├── (dashboard)/
│   ├── consumer/       # Espace consommateur
│   ├── producer/       # Espace producteur
│   └── pmo/            # Administration PMO
└── api/                # Routes API mock

components/             # Composants réutilisables
hooks/
├── api/                # Hooks HTTP (React Query)
└── contracts/          # Hooks smart contracts (wagmi)
stores/                 # État Zustand
lib/contracts/          # Adresses et ABIs
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/consumer` | Dashboard consommateur + vote |
| `/producer` | Dashboard producteur + vote |
| `/pmo` | Gestion workflow, membres, propositions, DeFi |

## Authentification

Connexion wallet via RainbowKit → Lecture des rôles depuis PricingDAO (`hasRole`, `isProducer`, `isConsumer`)

## Déploiement

Hébergé sur **Vercel** avec connexion à l'indexer Ponder sur Railway.
