# StreamX 🎬

A modern Netflix-inspired streaming web application built with Next.js 16, featuring TV shows and movies with a sleek, responsive UI.

![StreamX](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🎥 **Browse Movies & TV Shows** - Explore trending, popular, and top-rated content
- 🔍 **Search Functionality** - Find your favorite movies and shows instantly
- 📺 **Video Player** - Stream content using VidSrc v3 player
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎨 **Netflix-Style UI** - Dark theme with smooth animations
- 🎬 **Netflix-Style Intro** - Authentic stripe animation preloader
- 🌟 **Season & Episode Selection** - Navigate TV shows with ease

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query  
- **API**: TMDB (The Movie Database)
- **Video Player**: VidSrc v3

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/streamx.git
cd streamx
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
```

4. Get your TMDB API token:
   - Sign up at [TMDB](https://www.themoviedb.org/)
   - Go to Settings → API → Create API Key
   - Copy your Access Token (v4 auth)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📱 Mobile Responsive

StreamX is fully optimized for all screen sizes:
- 📱 Mobile: 320px - 640px
- 📟 Tablet: 640px - 1024px
- 💻 Desktop: 1024px+

## 🎨 Design Features

- **Netflix-inspired UI** with red (#e50914) and black (#141414) theme
- **Smooth animations** using Framer Motion
- **Hover effects** on movie cards
- **Modal details** for movies and TV shows
- **Responsive navigation** adapting to screen size
- **Custom preloader** with Netflix-style stripe animation

## 📄 License

MIT License - feel free to use this project for learning and personal projects!

## 🙏 Acknowledgments

- Design inspired by Netflix
- Movie data from [TMDB](https://www.themoviedb.org/)
- Video streaming powered by VidSrc

---

Made with ❤️ by [Your Name]
