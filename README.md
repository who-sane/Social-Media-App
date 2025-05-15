# dev.io: A Modern Social Media Platform for Developers

## Overview

dev.io is a full-stack social media application designed for developers to share posts, join communities, and interact in a modern, visually appealing environment. The app features full authentication via Supabase, image uploads, post likes, comments (with threading), profanity filtering, and a responsive UI.

## Features

- **Authentication:** Secure login via GitHub using Supabase Auth.
- **Communities:** Create and join topic-based communities. Community names are unique and always capitalized.
- **Posts:** Create posts with images, assign them to communities, and view them in a feed. Post titles are always capitalized.
- **Comments:** Threaded comment system with real-time updates and profanity filtering.
- **Likes:** Like posts to show appreciation.
- **Image Uploads:** Upload and preview images for posts using Supabase Storage.
- **Responsive UI:** Modern, mobile-friendly design with animated loading states and toast notifications for feedback.
- **Profanity Filter:** All user-generated content is checked for profanity using the `bad-words` package.
- **Beautiful Styling:** Custom color palette, pixel art font for branding, and smooth hover/transition effects.

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage, RPC)
- **State/Data:** React Query (`@tanstack/react-query`)
- **Authentication:** Supabase Auth (GitHub OAuth)
- **Profanity Filtering:** `bad-words` npm package
- **Image Hosting:** Supabase Storage

## How It Works

1. **Sign In:** Users authenticate with GitHub.
2. **Communities:** Users can browse, create, and join communities. Each community has a unique, capitalized name.
3. **Posts:** Users can create posts with images, assign them to communities, and view all posts in a feed. Clicking a post shows details, image preview, likes, and comments.
4. **Comments:** Users can comment on posts, reply to other comments, and all comments are filtered for profanity.
5. **Feedback:** All actions (create, error, etc.) provide instant feedback via toast notifications.

## Getting Started

1. Clone the repo and install dependencies:
   ```sh
   git clone <repo-url>
   cd social-media-app
   npm install
   ```
2. Set up your `.env` file with your Supabase credentials. (if you wish to recreate the code functionality you will have to replicate the database)
3. Run the app:
   ```sh
   npm run dev
   ```

## Database Structure (Excerpt)

- **users**
  - `id` (uuid, PK)
  - `username` (text, unique)
  - `avatar_url` (text)
  - `created_at` (timestamp)

- **communities**
  - `id` (uuid, PK)
  - `name` (text, unique, capitalized)
  - `description` (text)
  - `created_by` (uuid, FK → users.id)
  - `created_at` (timestamp)

- **posts**
  - `id` (uuid, PK)
  - `title` (text, capitalized)
  - `content` (text)
  - `image_url` (text, nullable)
  - `community_id` (uuid, FK → communities.id)
  - `user_id` (uuid, FK → users.id)
  - `created_at` (timestamp)

- **comments**
  - `id` (uuid, PK)
  - `post_id` (uuid, FK → posts.id)
  - `user_id` (uuid, FK → users.id)
  - `parent_id` (uuid, FK → comments.id, nullable)
  - `content` (text)
  - `created_at` (timestamp)

- **likes**
  - `id` (uuid, PK)
  - `post_id` (uuid, FK → posts.id)
  - `user_id` (uuid, FK → users.id)
  - `created_at` (timestamp)

---

Built with ❤️ for the developer community.