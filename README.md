# 🛍️ TARAA - Smart Deals for Students

> **Live Website:** [https://taraa.online](https://taraa.online)

**TARAA** is a curated deals platform designed specifically for students. We handpick the best budget-friendly products from trusted platforms like **Meesho**, **Amazon**, **Flipkart**, **Myntra**, **Ajio**, and **Shopsy**.

<div align="center">
  <img src="https://raw.githubusercontent.com/MrBanoth/TARAA/main/public/og-image.png" alt="TARAA Preview" width="600" />
</div>

*Screenshot of TARAA - Smart Deals for Students*

---

## 🚀 Features

### 🛒 For Students
- **Curated Deals:** Handpicked fashion, tech, and hostel essentials under ₹500.
- **Multi-Platform:** Compare prices from Amazon, Flipkart, Meesho, etc.
- **5-Star Ratings:** Read and write reviews for products.
- **Real-Time Search:** Instantly find what you need.
- **Favorites:** Save deals for later.
- **Mobile First:** Optimized for phone browsing.

### 👨‍💻 For Admins
- **Dashboard:** Manage products, ads, and users.
- **Analytics:** Track clicks and views.
- **Ad Management:** Upload and schedule banner ads.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn UI
- **Icons:** Lucide React
- **Backend:** Supabase (Database, Auth, Storage)
- **Deployment:** Vercel
- **SEO:** React Helmet Async

---

## 📦 Setup & Installation

If you want to run this project locally:

1.  **Clone the repo**
    ```bash
    git clone https://github.com/MrBanoth/TARAA.git
    cd taraa
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🗄️ Database Schema (Supabase)

### `products` Table
- `id`: UUID (Primary Key)
- `name`: Text
- `price`: Number
- `description`: Text
- `category`: Text
- `image_url`: Text
- `affiliate_link`: Text
- `platform`: Text (Amazon, Flipkart, etc.)
- `rating`: Number

### `ratings` Table
- `id`: UUID
- `product_id`: UUID (Foreign Key)
- `user_name`: Text
- `rating`: Number (1-5)
- `review_text`: Text
- `created_at`: Timestamp

---

## 🤝 Contact & Support

**Founder:** [Sandeep](https://mrbanoth.online)  
**GitHub:** [@MrBanoth](https://github.com/MrBanoth)

---

## ☕ Support the Project

If you find TARAA helpful, consider supporting its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/mrbanoth)

## 🌐 Connect with Me

- **Personal Website:** [mrbanoth.online](https://mrbanoth.online) 🌐
- **GitHub:** [@MrBanoth](https://github.com/MrBanoth) 💻
- **Email:** [sandeepnaikb0@gmail.com](mailto:sandeepnaikb0@gmail.com) ✉️

## ❤️ Made for Students, By Students

*© 2024 TARAA. All rights reserved.*
