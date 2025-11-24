# 🛍️ TARAA - Smart Deals for Students

> **Live Website:** [https://taraa.online](https://taraa.online)

**TARAA** is a curated deals platform designed specifically for students. We handpick the best budget-friendly products from trusted platforms like **Meesho**, **Amazon**, **Flipkart**, **Myntra**, **Ajio**, and **Shopsy**.

## 📱 TARAA Screenshots

<div align="center" class="screenshot-grid">
  <div class="screenshot-item">
    <a href="./public/ot1.jpg" target="_blank" rel="noopener noreferrer">
      <img src="./public/ot1.jpg" alt="TARAA Desktop View" class="screenshot" />
    </a>
    <p class="screenshot-caption">Desktop View</p>
  </div>
  
  <div class="screenshot-item">
    <a href="./public/ot2.png" target="_blank" rel="noopener noreferrer">
      <img src="./public/ot2.png" alt="TARAA Mobile View" class="screenshot" />
    </a>
    <p class="screenshot-caption">Mobile View</p>
  </div>
  
  <div class="screenshot-item">
    <a href="./public/ot3.png" target="_blank" rel="noopener noreferrer">
      <img src="./public/ot3.png" alt="TARAA Admin Panel" class="screenshot" />
    </a>
    <p class="screenshot-caption">Admin Panel</p>
  </div>
</div>

<style>
  .screenshot-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
  }
  .screenshot-item {
    text-align: center;
    transition: transform 0.3s ease;
  }
  .screenshot-item:hover {
    transform: translateY(-5px);
  }
  .screenshot {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #eaeaea;
  }
  .screenshot-caption {
    margin-top: 0.5rem;
    color: #666;
    font-size: 0.9em;
  }
  @media (max-width: 768px) {
    .screenshot-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

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
