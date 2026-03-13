# 💕 UsTime

A cozy, romantic webapp for couples to share lists, calendars, and memories.

## Features

- **🏠 Homepage** - Photo gallery, love notes, upcoming events summary
- **📅 Calendar** - Color-coded events (work, personal, shared) with month/week views
- **📝 Lists** - Pre-made templates for movies, restaurants, groceries, and more

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** - Warm, romantic color palette
- **Supabase** - Auth + Database + Real-time subscriptions
- **date-fns** - Date formatting
- **Lucide React** - Icons

## Getting Started

### 1. Install Dependencies

```bash
cd webapp
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Schema

Run these SQL commands in the Supabase SQL editor:

```sql
-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  type TEXT CHECK (type IN ('work', 'personal', 'shared')),
  location TEXT,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lists table
CREATE TABLE lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- List items table
CREATE TABLE list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  color TEXT CHECK (color IN ('yellow', 'pink', 'blue', 'green')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Enable Real-time

In Supabase Dashboard → Database → Replication, enable real-time for:
- `events`
- `lists`
- `list_items`
- `notes`

### 5. Run the Dev Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
webapp/
├── app/
│   ├── page.tsx          # Homepage
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   ├── calendar/
│   │   └── page.tsx      # Calendar page
│   ├── lists/
│   │   └── page.tsx      # Lists page
│   └── not-found.tsx     # 404 page
├── components/
│   ├── Navbar.tsx        # Navigation
│   ├── EventCard.tsx     # Event display
│   ├── NoteCard.tsx      # Sticky note display
│   └── ListItem.tsx      # List item component
├── lib/
│   └── supabase.ts       # Supabase client & types
└── public/               # Static assets
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Rose 50 | `#fff1f2` | Page background |
| Rose 100 | `#ffe4e6` | Borders, subtle fills |
| Rose 400 | `#fb7185` | Accents, highlights |
| Rose 500 | `#f43f5e` | Primary buttons, icons |
| Rose 600 | `#e11d48` | Hover states |
| Amber 50 | `#fffbeb` | Secondary backgrounds |
| Stone 50 | `#fafaf9` | Card backgrounds |
| Stone 800 | `#292524` | Primary text |

## Next Steps

- [ ] Connect auth flow
- [ ] Implement real-time subscriptions
- [ ] Add photo upload with Supabase Storage
- [ ] Build notification system
- [ ] Mobile app (Capacitor/Expo)

---

Made with 💕 for us.
