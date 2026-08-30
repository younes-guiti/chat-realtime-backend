# 💬 Chat Realtime — Backend

API REST et serveur temps réel pour une application de messagerie instantanée. Construit avec Node.js, Express, TypeScript, Prisma et Socket.io, avec une architecture en couches (repositories/services/controllers) et une sécurité pensée à plusieurs niveaux.

**🔗 API en ligne :** [chat-realtime-backend-rknl.onrender.com](https://chat-realtime-backend-rknl.onrender.com/health)

> Hébergé sur un plan gratuit — le service se met en veille après une période d'inactivité ; la première requête peut prendre 30 à 60 secondes.

## ✨ Fonctionnalités

- 🔐 Authentification JWT (inscription, connexion, hash bcrypt)
- 💬 API REST complète (utilisateurs, conversations, messages)
- ⚡ Temps réel via Socket.io (messages, indicateur de frappe, présence en ligne)
- 🛡️ Vérifications de sécurité à plusieurs niveaux (participant à la conversation vérifié à chaque accès, REST et Socket.io)
- ✅ Validation stricte des données (Zod) côté HTTP et Socket.io
- 🗄️ Base de données PostgreSQL via Prisma ORM

## 🛠️ Stack technique

- **Node.js** + **Express** + **TypeScript** (strict mode, zéro `any`)
- **PostgreSQL** + **Prisma ORM**
- **Socket.io** — communication temps réel, typée de bout en bout
- **JWT** + **bcryptjs** — authentification
- **Zod** — validation runtime
- **CI/CD** via GitHub Actions

## 🔗 Projet lié

Le frontend de cette application est disponible ici : [chat-realtime-frontend](https://github.com/younes-guiti/chat-realtime-frontend)

## 🚀 Lancer le projet en local

```bash
git clone https://github.com/younes-guiti/chat-realtime-backend.git
cd chat-realtime-backend
npm install
```

Créer un fichier `.env` à la racine :

```
DATABASE_URL="postgresql://user:password@localhost:5432/chatdb?schema=public"
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

```bash
npx prisma migrate dev
npm run dev
```

## 📡 Principaux endpoints

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Utilisateur connecté |
| GET | `/api/conversations` | Liste des conversations |
| POST | `/api/conversations` | Créer une conversation |
| POST | `/api/messages` | Envoyer un message |
| GET | `/api/users/search?q=` | Rechercher un utilisateur |

## 👤 Auteur

**Younes Guiti** — Étudiant M1 Ingénierie Logicielle, USTHB
