# Project: Analysis Terminal (HYA-Terminal)

## 🏗️ Core Architecture: The "Split-Silo" Model
- **Face & Brain (Vercel):** Frontend (Next.js 15) and Intelligence layer (Server Actions + Genkit) are consolidated on Vercel for fast, free deployment.
- **Silo (Firebase):** Storage (Firestore) and Security (Firebase Auth) are hosted on the Firebase Spark Plan.

## 🔄 Data Flow (Phases A-E)
- **Phase A (Input):** UI Triggers and Vercel Edge functions.
- **Phase B (Gate):** Firebase Auth validation.
- **Phase C (Intelligence):** Server Actions in `src/app/actions.ts` handle API retrieval and Genkit flows.
- **Phase D (Silo):** Cache-First policy using Firestore.
- **Phase E (Output):** React components with 'Glow' state feedback (Success=Green, Error=Red).

## 🚀 Deployment Rules
- **Frontend/API:** Automatic via GitHub -> Vercel on `git push origin main`.
- **Database/Rules:** Manual via `firebase deploy --only firestore,storage`.
- **Logic:** No Cloud Functions. All logic must reside in Server Actions or API routes.

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router, TypeScript).
- **Styling:** Tailwind CSS + Radix UI (Shadcn UI).
- **AI Engine:** Genkit for custom flows (`src/ai/flows/`).
- **Database:** Firebase Firestore (Spark Plan).
- **Hosting:** Vercel (Automatic Deployment).
