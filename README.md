# Premium E-Commerce Frontend

A modern, highly-performant, and visually stunning e-commerce frontend built with Next.js, React, and Tailwind CSS. This project leverages the App Router for optimal routing and performance, Zustand for lightweight state management, and a suite of modern UI libraries for a premium user experience.

## 🚀 Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) & [@base-ui/react](https://base-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript
- **Tooling:** ESLint, Prettier, pnpm

## 📁 Project Structure

```
├── app/                  # Next.js App Router (pages, layouts, globals.css)
│   ├── auth/             # Authentication pages (login/signup)
│   ├── cart/             # Shopping cart page
│   ├── products/         # Product listing and details pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page (Modern Bento Grid & Hero)
├── components/           # Reusable React components
│   ├── auth/             # Auth related components
│   ├── cart/             # Cart related components
│   ├── common/           # Shared components (buttons, inputs)
│   ├── layout/           # Layout components (Container, Navbar, Footer)
│   ├── product/          # Product display components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Library configurations and utilities
├── public/               # Static assets (images, icons)
├── store/                # Zustand state management slices
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## 🛠 Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (v8 or higher recommended) - The project uses `pnpm` as the package manager.

## 🏃 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd e-commerce-frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   - Copy the example `.env` file (if available):
   ```bash
   cp .env.example .env.local
   ```
   - Update `.env.local` with your required environment variables.

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📜 Available Scripts

In the project directory, you can run:

- `pnpm dev`: Runs the app in development mode.
- `pnpm build`: Builds the app for production to the `.next` folder.
- `pnpm start`: Starts the production server using the built files.
- `pnpm lint`: Runs ESLint to catch syntax and style issues.
- `pnpm format`: Formats code across the project using Prettier.

## 🎨 Features & Highlights

- **Dynamic Landing Page**: Features a stunning, modern hero section with glassmorphism, animated backgrounds, and a bento-grid layout for features.
- **State Management**: Uses Zustand for a lightweight, global store to manage the cart and user session.
- **Responsive Design**: fully responsive layout across desktop, tablet, and mobile devices using Tailwind CSS.
- **Animations**: Custom CSS animations (`animate-float`) and smooth transition effects to provide a premium look and feel.
- **Type Safety**: Strictly typed with TypeScript to ensure robust and maintainable code.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/my-feature`)
2. Commit your changes (`git commit -m 'Add some feature'`)
3. Push to the branch (`git push origin feature/my-feature`)
4. Open a pull request

## 📄 License

This project is licensed under the MIT License.
