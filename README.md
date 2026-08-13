<div align="center">

# 🌟 Laravel 11 + React + Tailwind CSS 🌟

<img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
<img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">

### 🚀 A Modern Full-Stack Web Application 🚀

*Built with cutting-edge technologies for maximum performance and developer experience*

---

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=F75C7E&center=true&vCenter=true&width=435&lines=Laravel+11+Backend+API;React+18+Frontend;Tailwind+CSS+Styling;Full-Stack+Development" alt="Typing SVG">

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Backend Features
- 🔐 **Laravel Sanctum Authentication**
- 📊 **RESTful API Architecture**
- 🗄️ **MySQL Database Integration**
- 🛡️ **Security Best Practices**
- 📝 **Comprehensive Documentation**

</td>
<td width="50%">

### 🎨 Frontend Features
- ⚡ **React 18 with Hooks**
- 🎨 **Tailwind CSS Styling**
- 📱 **Responsive Design**
- 🔄 **Axios HTTP Client**
- ⚡ **Vite Build Tool**

</td>
</tr>
</table>

## 🛠️ Tech Stack

<div align="center">

| Category | Technology | Version | Description |
|----------|------------|---------|-------------|
| 🔧 **Backend** | Laravel | 11.x | PHP Framework |
| ⚛️ **Frontend** | React | 18.x | JavaScript Library |
| 🎨 **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| 🗄️ **Database** | MySQL | 8.0+ | Relational Database |
| 📡 **HTTP Client** | Axios | - | Promise-based HTTP |
| ⚡ **Build Tool** | Vite | - | Frontend Tooling |

</div>

## 📁 Project Architecture

```bash
🏗️ project-root/
├── 🔧 backend/                 # Laravel 11 API Server
│   ├── 📱 app/                 # Application Logic
│   │   ├── Http/Controllers/   # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   └── Middleware/        # Custom Middleware
│   ├── ⚙️ config/             # Configuration Files
│   ├── 🗄️ database/           # Migrations & Seeders
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/          # Database Seeders
│   ├── 🛣️ routes/             # API Routes
│   └── 📄 .env.example        # Environment Template
│
└── ⚛️ frontend/               # React Application
├── 📱 src/                # Source Code
│   ├── components/        # React Components
│   ├── pages/            # Page Components
│   ├── services/         # API Services
│   └── utils/            # Utility Functions
├── 🌐 public/            # Static Assets
├── 📦 package.json       # Dependencies
└── ⚙️ tailwind.config.js  # Tailwind Configuration
```

## 🔧 System Requirements

<div align="">

### 🔧 Backend Requirements
| Component | Version | Status |
|-----------|---------|--------|
| PHP | >= 8.2 | ![Required](https://img.shields.io/badge/Required-red) |
| Composer | Latest | ![Required](https://img.shields.io/badge/Required-red) |
| MySQL | >= 8.0 | ![Required](https://img.shields.io/badge/Required-red) |

### ⚛️ Frontend Requirements
| Component | Version | Status |
|-----------|---------|--------|
| Node.js | >= 18.0 | ![Required](https://img.shields.io/badge/Required-red) |
| NPM | >= 8.0 | ![Required](https://img.shields.io/badge/Required-red) |
| Yarn | >= 1.22 | ![Optional](https://img.shields.io/badge/Optional-green) |

</div>

## 🚀 Quick Start Guide

### 📥 1. Clone Repository

```bash
# 📂 Clone the project
git clone <repository-url>
cd project-root
```

### 🔧 2. Backend Setup

```bash
# 📁 Navigate to backend
cd my-project-backend

# 📦 Install dependencies
composer install

# 📄 Setup environment
cp .env.example .env

# 🔑 Generate application key
php artisan key:generate

# 🗄️ Run migrations
php artisan migrate

# 🌱 Seed database (optional)
php artisan db:seed
```

### ⚛️ 3. Frontend Setup

```bash
# 📁 Navigate to frontend
cd ../my-project-frontend

# 📦 Install dependencies
npm install
# or
yarn install

# 📄 Create environment file
touch .env
```

## ⚙️ Configuration

<details>
<summary>🔧 <strong>Backend Configuration</strong></summary>

### 📄 Update `backend/.env`

```env
# 🗄️ Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_react_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# 🔐 Laravel Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173

# 🌐 CORS Configuration
FRONTEND_URL=http://localhost:5173
```

</details>

<details>
<summary>⚛️ <strong>Frontend Configuration</strong></summary>

### 📄 Create `frontend/.env`

```env
# 🌐 API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173

# 🔐 Authentication
VITE_SANCTUM_STATEFUL_DOMAINS=localhost:8000
```

</details>

## 🖥️ Development Servers

<div align="center">

### 🚀 Start Both Servers Simultaneously

</div>

<table>
<tr>
<td width="50%">

### 🔧 Terminal 1 - Laravel API

```bash
cd backend

# 🚀 Start Laravel server
php artisan serve
```

<div align="center">

🌐 **API Server**  
http://localhost:8000

![Laravel](https://img.shields.io/badge/Status-Running-success?style=flat-square)

</div>

</td>
<td width="50%">

### ⚛️ Terminal 2 - React App

```bash
cd frontend

# 🚀 Start React server
npm run dev
```

<div align="center">

🌐 **Frontend App**  
http://localhost:5173

![React](https://img.shields.io/badge/Status-Running-success?style=flat-square)

</div>

</td>
</tr>
</table>

## 🤝 Contributing

<div align="center">

We welcome contributions! 🎉

[![Contributors](https://img.shields.io/github/contributors/username/repo-name?style=for-the-badge)](https://github.com/username/repo-name/graphs/contributors)

</div>

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 Open a Pull Request

## 📄 License

<div align="center">

This project is licensed under the MIT License.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

## 📞 Support

<div align="center">

Need help? We're here for you! 💪

[![GitHub Issues](https://img.shields.io/github/issues/username/repo-name?style=for-the-badge)](https://github.com/username/repo-name/issues)
[![GitHub Discussions](https://img.shields.io/badge/GitHub-Discussions-purple?style=for-the-badge&logo=github)](https://github.com/username/repo-name/discussions)

</div>

---

<div align="center">

### 🌟 Star this repository if you found it helpful! 🌟

[![GitHub stars](https://img.shields.io/github/stars/username/repo-name?style=social)](https://github.com/username/repo-name/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/username/repo-name?style=social)](https://github.com/username/repo-name/network/members)

**Made with ❤️ by [Shoyo](https://github.com/shoyodeyy)**

</div>
