# Сургуулийн Удирдлагын Систем 🎓

## Технологийн стек
- **Backend**: Spring Boot 3 + Java 21 + Gradle 8.6 + Spring Security (JWT) + MongoDB  
- **Frontend**: React 18 + Webpack 5 (Node 16)

---

## ⚙️ Тохиргоо

### 1. MongoDB тохируулах

`.env` файлд `MONGO_URI`-г тохируулна:
```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/school_db
```

**Анхааруулга**: `.env` файл project root-д байна (`c:\Users\Dell\Downloads\school\.env`)

---

## 🚀 Ажиллуулах

### Backend (Terminal 1)

**Windows PowerShell:**
```powershell
# .env файлаас env variables тохируулах
$env:MONGO_URI="mongodb://localhost:27017/school_db"

# Эсвэл MongoDB Atlas ашиглах бол:
# $env:MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/school_db"

# Backend ажиллуулах
cd c:\Users\Dell\Downloads\school
.\gradlew.bat bootRun
```

Backend `http://localhost:8080`-д ажиллана.

### Frontend (Terminal 2)
```powershell
cd c:\Users\Dell\Downloads\school\frontend
npm start
```

Frontend `http://localhost:3000`-д нээгдэнэ.

---

## 📡 API Endpoints

| Method | Endpoint | Тайлбар | Auth |
|--------|----------|---------|------|
| POST | `/api/auth/register` | Багш бүртгэх | ❌ |
| POST | `/api/auth/login` | Нэвтрэх | ❌ |
| GET | `/api/students` | Бүх сурагч | ✅ JWT |
| POST | `/api/students` | Сурагч нэмэх | ✅ JWT |
| PUT | `/api/students/{id}` | Сурагч засах | ✅ JWT |
| DELETE | `/api/students/{id}` | Сурагч устгах | ✅ JWT |

---

## 📁 Project Бүтэц

```
school/
├── .env                          ← MongoDB URI энд тохируулна
├── build.gradle                  ← Java 21 + Spring Boot 3
├── src/main/java/com/pinecone/school/
│   ├── controller/
│   │   ├── AuthController.java   ← /api/auth/register, /api/auth/login
│   │   └── StudentController.java← CRUD endpoints
│   ├── service/
│   │   ├── TeacherService.java   ← Бүртгэл + JWT үүсгэх
│   │   └── StudentService.java   ← CRUD логик
│   ├── model/
│   │   ├── Teacher.java          ← MongoDB document
│   │   └── Student.java          ← MongoDB document
│   └── security/
│       ├── JwtUtil.java          ← JWT generate/validate
│       └── JwtAuthFilter.java    ← Request filter
└── frontend/
    ├── src/
    │   ├── App.jsx               ← Routing
    │   ├── pages/
    │   │   ├── AuthPage.jsx      ← Нэвтрэх/Бүртгэх
    │   │   └── DashboardPage.jsx ← Сурагч CRUD
    │   ├── components/
    │   │   ├── StudentModal.jsx  ← Нэмэх/Засах modal
    │   │   └── ConfirmModal.jsx  ← Устгах баталгаа
    │   ├── context/
    │   │   └── AuthContext.jsx   ← JWT state management
    │   ├── api/
    │   │   └── api.js            ← Axios client
    │   └── styles/
    │       └── index.css         ← Dark glassmorphism UI
    └── webpack.config.js
```
