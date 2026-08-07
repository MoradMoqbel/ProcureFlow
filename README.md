# 🚀 ProcureFlow AI - Autonomous Enterprise Procurement Agent

> **Enterprise Multi-Agent Platform for Supply Chain & Procurement Intelligence**

![License](https://img.shields.io/badge/License-MIT-indigo.svg)
![React](https://img.shields.io/badge/Frontend-React_18-cyan.svg)
![Vite](https://img.shields.io/badge/Build_Tool-Vite_5-emerald.svg)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_3-blue.svg)

---

## 💡 Overview

**ProcureFlow AI** is an autonomous enterprise agent engine designed to automate high-stakes procurement and supply chain operations. It addresses the challenge of unformatted, multi-currency supplier RFQs by automatically normalizing currencies, weight metrics, and delivery lead times into a standardized decision matrix.

---

## ✨ Key Features

- 📱 **Automated RFQ Parsing**: Extracts structured JSON entities (Unit Prices, Currencies, Incoterms, Lead Times, Terms) from raw unformatted supplier quotes & PDFs.
- 💱 **Multi-Currency Normalization Matrix**: Converts heterogeneous currencies (`USD`, `EUR`, `GBP`, `TRY`, `SAR`) into a base currency in real time.
- ⚖️ **Weighted Vendor Scoring Engine**: Evaluates vendors across multi-criteria metrics (Price score, Delivery speed score, Financial terms risk score).
- 📡 **Live Streaming Agent Console**: Displays real-time agent thoughts, tool invocations (`parse_supplier_quote`, `normalize_currencies_and_units`, `score_and_rank_vendors`), and execution events.
- 📄 **Purchase Order & Action Center**: Instantly generates official Purchase Orders (`PO JSON`), winning award notices, and vendor rejection emails.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + Vite 5
- **Styling**: TailwindCSS + Glassmorphism UI
- **Icons**: Lucide React
- **Agent Architecture**: Event-Driven Streaming Orchestrator + Deterministic NLP Engine

---

## 🚀 Quick Start (Local Setup)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/procureflow-ai-agent.git

# 2. Navigate to project directory
cd procureflow-ai-agent

# 3. Install dependencies
npm install

# 4. Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to launch the platform.

---

## 🧪 CLI Test Runner

Run end-to-end automated workflow evaluation directly from the terminal:

```bash
node scripts/testAgentCli.js
```

---

## 📜 License

MIT License - feel free to use and adapt for enterprise AI agent research.
