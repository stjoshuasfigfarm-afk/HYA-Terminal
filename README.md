# HYA Terminal: Institutional Silo

The **HYA Terminal** is a high-performance, static-first financial dashboard engineered for real-time portfolio triage and macro-market oversight. Built to bypass build-time dependencies, this architecture delivers ultra-fast, data-forward performance with 100% reliability.

## 🏗️ Core Architecture
- **Front-End:** Static-first, framework-free infrastructure served via GitHub Pages.
- **Data Engine:** Real-time synchronization powered by **Firebase Firestore**.
- **Institutional Aesthetic:** Cyber-Minimalist design optimized for trading-floor efficiency.

## 📊 Terminal Metrics & Institutional Coverage
The terminal tracks high-alpha sectors and global macro indicators in real-time:
- **AI Infrastructure (SMH)**
- **Information Technology (XLK)**
- **Financial Services (XLF)**
- **Semiconductors (SOXX)**

## 📈 Macro-Corridor Monitoring
- **10Y-2Y Yield Spread:** Institutional benchmark for recession probability.
- **Systemic Volatility (VIX):** Real-time monitoring of systemic risk.
- **Sector Velocity:** Momentum tracking to identify leadership quadrants.

## 🚀 Deployment Strategy: The "Boxed Silo"
This project utilizes a **zero-build** deployment strategy:
1. **Develop/Edit:** Direct manipulation of `public/index.html` via GitHub browser editor.
2. **Data Sync:** Live updates injected via Firebase Firestore Console.
3. **Deploy:** Instant serving via GitHub Pages/Vercel (using `vercel.json` bypass).
4. **Resilience:** Static hosting eliminates `npm`, `Webpack`, and `PostCSS` build failures.

## 🛠️ Configuration & Setup
- **Firebase:** Ensure your `firebaseConfig` object in `public/index.html` is updated with your specific Project ID and API Key.
- **Hosting:** Set your GitHub Pages branch to `main` with the folder `/ (root)` for instant deployment.

---
*Status: Institutional Silo Online. Monitoring U.S. National Demand Index.*
