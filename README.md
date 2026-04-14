# GistenLixt

Modern authentication and client management system built with Next.js 16.

## 🚀 Features

- ✨ Modern UI with dark/light theme
- 🔐 Complete authentication system (login/signup/logout)
- 👥 Per-user client management with full isolation
- 🎨 Smooth animations and transitions
- 📱 Fully responsive design
- 🔒 Role-based access control
- 🗄️ SQLite database with Better-SQLite3

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (better-sqlite3)
- **Authentication**: Custom JWT-like tokens
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library

## 📦 Installation

```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
app/
├── api/              # API routes
│   ├── auth/        # Authentication endpoints
│   └── clients/     # Client management endpoints
├── components/      # React components
│   ├── ui/         # Reusable UI components
│   └── ...         # Feature components
├── providers/       # Context providers
├── dashboard/       # Dashboard page
├── clientes/        # Client management pages
└── ...             # Other pages

lib/
├── db.ts           # Database setup
└── auth-token.ts   # Auth utilities

docs/               # Documentation files
```

## 🔑 Default Admin Account

- **Email**: admin@admin.com
- **Password**: admin123

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- [Components Documentation](docs/COMPONENTS_DOCUMENTATION.md)
- [Transitions Guide](docs/TRANSITIONS_GUIDE.md)
- [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)

## 🧪 Testing

```bash
npm test
```

## 🔒 Security Notes

- Auth tokens are HttpOnly cookies
- Passwords hashed with bcryptjs
- Per-user data isolation with foreign keys
- Proxy layer reserved for future route-specific controls

## 📄 License

MIT

---

Built with ❤️ using Next.js and Tailwind CSS

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
