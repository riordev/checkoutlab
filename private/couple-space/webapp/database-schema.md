# CoupleSpace Database Schema

## Tables

### profiles
```sql
create table profiles (
  id uuid references auth.users primary key,
  username text unique,
  full_name text,
  avatar_url text,
  partner_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### events
```sql
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date date not null,
  time text,
  type text check (type in ('work', 'personal', 'shared')),
  location text,
  description text,
  is_surprise boolean default false,
  created_by uuid references profiles(id),
  couple_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### lists
```sql
create table lists (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  icon text,
  color text,
  template text,
  is_shared boolean default false,
  created_by uuid references profiles(id),
  couple_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### list_items
```sql
create table list_items (
  id uuid default gen_random_uuid() primary key,
  list_id uuid references lists(id) on delete cascade,
  text text not null,
  completed boolean default false,
  note text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### notes
```sql
create table notes (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  author_id uuid references profiles(id),
  color text check (color in ('yellow', 'pink', 'blue', 'green')) default 'yellow',
  couple_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### photos
```sql
create table photos (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  caption text,
  uploaded_by uuid references profiles(id),
  couple_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### wishlist_items
```sql
create table wishlist_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  link text,
  price text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  bought boolean default false,
  bought_by uuid references profiles(id),
  user_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### recipes
```sql
create table recipes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  cuisine text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  time text,
  servings integer,
  ingredients jsonb default '[]',
  instructions jsonb default '[]',
  image_url text,
  created_by uuid references profiles(id),
  couple_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### recipe_made
```sql
create table recipe_made (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid references recipes(id),
  user_id uuid references profiles(id),
  date date not null,
  rating integer check (rating between 1 and 5),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### presence
```sql
create table presence (
  user_id uuid references profiles(id) primary key,
  online boolean default false,
  last_seen timestamp with time zone default timezone('utc'::text, now())
);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table events enable row level security;
alter table lists enable row level security;
alter table list_items enable row level security;
alter table notes enable row level security;
alter table photos enable row level security;
alter table wishlist_items enable row level security;
alter table recipes enable row level security;
alter table recipe_made enable row level security;

-- Example policy: Users can only see events in their couple
-- (Actual couple_id logic would need to be implemented based on your auth structure)
create policy "Users can view their couple events"
  on events for select
  using (auth.uid() = created_by or auth.uid() in (
    select partner_id from profiles where id = created_by
  ));
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
