@AGENTS.md

# Development Guide: [Project Name]

## 🛠️ Tech Stack

- **Frontend:** [e.g., Next.js 15, TailwindCSS, shadcn/ui]
- **Backend/Database:** [e.g., Supabase, PostgreSQL]
- **State Management:** [e.g., Zustand, React Context]

## 🎯 Current Focus (Prototype Goals)

- Build a functional MVP focusing on core feature.
- Prioritize **speed and functionality** over perfect optimization.
- Use mock data where external APIs are not yet integrated.

## 💻 Commands

- **Install:** `npm install`
- **Dev Server:** `npm run dev`
- **Build Check:** `npm run build`
- **Database Migration:** [e.g., `npx supabase migration new`]

## 🎨 Code Style & Preferences

- **Architecture:** Keep components collocated. Avoid premature abstraction.
- **TypeScript:** Strict mode enabled. Avoid `any`. Use descriptive interfaces.
- **Components:** Use functional components with arrow syntax. Prefer shadcn primitives.
- **Styling:** Use utility-first Tailwind classes. No custom CSS files unless necessary.
- **AI Instructions:** Do not write tests for this prototype stage. Explain architectural choices briefly before writing code.
