# Notedly AI

> ✨ An open-source **AI-powered smart notes app** that helps you write, edit, and manage notes effortlessly — with the power of AI at your fingertips.

---

## ✨ Features
- 📝 Create, edit, and organize notes with ease
- 🔐 Secure authentication with **Supabase Auth**
- 💾 Cloud storage with **Supabase Database**
- 🤖 **Ask AI**: Summarize notes, extract key points, plan tasks, or ask questions about your notes
- 🎨 Clean, responsive UI with dark mode built with **Tailwind CSS** and **Shadcn UI**
- 🚀 Beginner-friendly, open-source, and easy to contribute to
- ☁️ Fully deployable on Vercel

---

## 🛠 Tech Stack

| Technology       | Badge                                                                                     |
|------------------|--------------------------------------------------------------------------------------------|
| **Framework**     | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) |
| **Language**      | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) |
| **Styling**       | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-111827?style=flat&logo=vercel&logoColor=white) |
| **Database & Auth** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white) |
| **ORM**           | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) |
| **AI Integration**| ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white) |
| **Deployment**    | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) |

---

## 🤝 Contributing
Contributions are welcome! Here’s how you can help:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 🚀 Getting Started

Follow these steps to run **Notedly AI** locally:

### 1. Clone the Repository
```bash
git clone https://github.com/Hamza-Imrann/Notedly-AI.git
cd Notedly-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Rename the `env.example` to `.env.local` and update the values on the file or
Create a `.env.local` file in the root directory and add the following:
```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_BASE_URL=
PASSWORD_PEPPER=

OPENAI_API_KEY=
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev
```

### 5. Start the Development Server
```bash
npm run dev
```

Your app should now be running at **http://localhost:3000** 🎉

---

## 🌍 Deployment

You can deploy **Notedly AI** easily with [Vercel](https://vercel.com/) (recommended):

1. Push your project to GitHub.
2. Import the repo into Vercel.
3. Add your environment variables in the Vercel dashboard.
4. Deploy with one click.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🔗 Live Demo

🚧 Coming soon...

---

<div align="center">Made with ❤️</div>
