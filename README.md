# ☕ Smart Brew - Data-Driven Coffee Experience

> *Where premium coffee meets Business Intelligence.*

| Landing Page | Product Telemetry |
| :---: | :---: |
| ![Landing Page](./images/ss1.png) | ![Product Card](./images/ss2.png) |
| **BI Analytics Overview** | **Admin Data Control** |
| ![BI Dashboard](./images/ss3.png) | ![BI Dashboard Export](./images/ss4.png) |


![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B573?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## 📑 Executive Summary

**Smart Brew** is not merely a digital storefront for a boutique coffee shop; it is engineered as a real-time **data generation and telemetry hub**. 
Designed with an emphasis on minimalist aesthetics and high-performance data pipelines, the platform captures granular user interactions and preferences. This telemetry is immediately formatted into structured Business Intelligence (BI) payloads, enabling data-driven decision-making, inventory optimization, and advanced customer segmentation.

---

## 📂 Detailed Folder Structure

The project utilizes the Next.js 15 App Router architecture, cleanly separating UI components, BI logic, and simulated data layers.

```text
.
├── src/
│   ├── app/
│   │   ├── dashboard/ 
│   │   │   └── page.tsx      # BI Dashboard UI & Analytics Rendering
│   │   ├── globals.css       # Core CSS, Tailwind configuration, and Theme Variables
│   │   ├── layout.tsx        # Root layout, Font definitions, Global Toaster
│   │   └── page.tsx          # Main Landing Page (Telemetry generation endpoint)
│   ├── components/
│   │   ├── CustomerForm.tsx  # Captures Structured & Unstructured preference data
│   │   ├── HeroSection.tsx   # Premium entry point 
│   │   ├── Navbar.tsx        # Global navigation
│   │   ├── ProductList.tsx   # Product catalog & Interaction tracking (Clicks, Views)
│   │   └── Toaster.tsx       # Modern, glassmorphism notification system
│   ├── data/
│   │   └── mock-bi-data.ts   # Simulated analytical data for dashboard visualizations
│   └── lib/
│       ├── bi-logger.ts      # Core BI Telemetry Engine & Schema definitions
│       └── utils.ts          # Utility functions
└── package.json              # Project dependencies and scripts
```

---

## ⚙️ Functional Documentation

### Pages
- **`/app/page.tsx` (Landing)**: Serves as the primary touchpoint for data generation. It hosts the product catalog and customer preference forms, acting as the frontend sensor for the BI pipeline.
- **`/app/dashboard/page.tsx`**: The analytical consumption layer. It securely visualizes the aggregated data metrics using `recharts`, designed for administrative and strategic overview. Crucially, it features a direct **Export to CSV** function, ensuring **Data Portability** and allowing decision-makers to effortlessly download underlying telemetry data for external spreadsheet analysis (e.g., Excel).

### Core Components
- **`ProductList` & `ProductCard`**: Implements intersection observers and click handlers to log `VIEW` and `ADD_TO_CART` events. Triggers non-blocking `sonner` notifications.
- **`CustomerForm`**: A dual-purpose data collection interface. It captures strictly typed enumerations (Structured Data) alongside open-text fields (Unstructured Data) for NLP pipelines.

### BI Engine (`/lib/bi-logger.ts`)
The telemetry engine acts as an interceptor. Instead of direct database writes, it formats interactions into standardized JSON payloads and pushes them to the console (simulating an event stream like Kafka/Kinesis). 
- Automatically injects session metadata, timestamps, and unstructured flags.
- Validates data against predefined TypeScript interfaces before serialization.

---

## 🔍 How to Verify the BI Pipeline (Live Demo)

To see the data generation in action without a backend integration:
1. Open the website and press `F12` (or Right-click > Inspect) to open the **Browser Console**.
2. Click the **"Add to Cart"** button on any product.
3. Observe the structured **JSON Payload** appearing in the console with a `[BI DATA INGESTION]` prefix.
4. Go to the **Customer Form**, fill in the details, and submit.
5. Notice how the engine flags the "Special Request" field for **NLP processing** if left filled.

---

## 📊 Business Intelligence & Data Architecture

```mermaid
graph LR
    A[User Interaction] -->|Telemetry| B(BI Logger Engine)
    B -->|Structured Data| C[SQL Star Schema]
    B -->|Unstructured Data| D[NLP Pipeline Proxy]
    C --> E[Recharts Dashboard]
    D --> E
    E --> F[Decision Support]
```

This prototype is built on a scalable **Star Schema** logic, anticipating direct integration with data warehouses like Snowflake or Amazon Redshift.

### Data Types Captured
1. **Structured Data**: Categorical variables (e.g., `coffee_preference: 'Strong' | 'Smooth' | 'Milky'`), Interaction Types (`VIEW`, `ADD_TO_CART`), and timestamps. Ready for immediate SQL aggregation.
2. **Unstructured Data**: The `special_request` text field. Flagged by the BI engine as `nlp_processing_required: true`, this raw text requires sentiment analysis or keyword extraction before quantitative use.

### Star Schema Design
Documented within the codebase, the logical architecture is split into Facts and Dimensions:

```sql
-- 1. DIMENSIONS (Descriptive context)
dim_users (user_id UUID, session_id VARCHAR, created_at TIMESTAMP)
dim_products (product_id VARCHAR, name VARCHAR, category VARCHAR, base_price DECIMAL)

-- 2. FACTS (Measurable, transactional events)
fact_interactions (interaction_id UUID, user_id UUID, product_id VARCHAR, interaction_type ENUM, timestamp TIMESTAMP)
fact_customer_preferences (preference_id UUID, name VARCHAR, coffee_preference ENUM, special_request TEXT)
```

### Insights & Decision Making
The `/dashboard` provides critical operational and strategic insights:
1. **KPI Summary Cards**: Real-time monitoring of **Total Revenue**, **Average Order Value**, and **Customer Retention**. Trend indicators highlight growth or contraction periods instantly.
2. **Weekly Revenue vs Target (Bar Chart)**: Visualizes performance against internal goals, allowing managers to track progress and adjust marketing efforts in real-time.
3. **Popular Products (Bar Chart)**: Drives supply chain decisions and inventory management based on volume.
4. **Preference Distribution (Pie Chart)**: Guides future R&D for new roasts based on the 'Strong' vs 'Smooth' dichotomy.
5. **Hourly Demand Density (Line Chart)**: Optimizes staff scheduling and identifies peak operational stress points.
6. **Recent Activity (Interaction Table)**: A granular audit trail of live transactions, providing transparency and operational tracking of every ingestion event.

---

## 🎨 UI/UX Design Philosophy

The application interface is governed by the **"Slowness"** design concept:
- **Atmospheric Transitions**: Heavy utilization of `framer-motion` for delayed, ease-in animations (`initial={{ opacity: 0, y: 30 }}`). This forces the user to slow down, mimicking the deliberate, unhurried experience of a premium boutique cafe.
- **Dark Mode Typography**: Low-contrast text on deep brown (`#0f0a07`) backgrounds prevents eye strain and elevates the perceived value of the product.
- **Modern Feedback Loops**: Native browser alerts are replaced with a custom-styled, glassmorphism `sonner` toast system, maintaining the aesthetic immersion even during technical interactions.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18.x or later
- `pnpm` (recommended) or `npm`

### Local Deployment
```bash
# 1. Clone the repository
git clone https://github.com/MertoBoominn/smart-brew.git
cd smart-brew

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```
Navigate to `http://localhost:3000` to view the landing page, and `http://localhost:3000/dashboard` for the BI Analytics.

---

## 🔮 Future Roadmap

1. **Real-time Event Streaming**: Replace `console.log` interceptors with a WebSocket or AWS Kinesis integration to push data to a cloud data warehouse.
2. **NLP Integration**: Connect the `special_request` unstructured data stream to OpenAI or AWS Comprehend for real-time sentiment scoring and automated tagging.
3. **A/B Testing Telemetry**: Add UI variant flags to the `fact_interactions` payload to measure which Hero Section design yields higher `ADD_TO_CART` conversion rates.

---

## 📈 Business Value Matrix

| Collected Telemetry (Data Point) | BI Metric / Insight | Strategic Business Decision (Actionable Insight) |
| :--- | :--- | :--- |
| **View-to-Cart Conversion** | Product Engagement | **Menu Optimization:** Remove unpopular items or adjust pricing models. |
| **Add-to-Cart Volume** | Demand Forecasting | **Inventory Management:** Precise ordering of raw coffee beans and milk to minimize waste. |
| **Preference (Strong/Milky)** | Customer Segmentation | **Sourcing Strategy:** Shift purchasing budget towards dark roasts or dairy alternatives. |
| **Interaction Timestamps** | Operational Density | **Staff Scheduling:** Allocate more baristas during peak telemetry hours. |
| **Revenue vs. Target** | Performance Tracking | **Financial Strategy:** Trigger marketing campaigns if revenue falls below weekly targets. |
| **Unstructured 'Requests'** | Emerging Trends (NLP) | **Product Innovation:** Launch new seasonal drinks based on recurring keywords (e.g., *Cinnamon*, *Oat*). |

---
*Developed as a high-fidelity prototype demonstrating the intersection of modern frontend engineering and Business Intelligence.*