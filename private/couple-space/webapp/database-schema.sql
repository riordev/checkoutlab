-- CoupleSpace Database Schema
-- Private couple's app for shared lists, calendar, and memories
-- Supabase Project: https://cqyfuzpkcsjgpucdshxj.supabase.co

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- User profiles for both partners
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    theme_preference TEXT DEFAULT 'rose-gold' CHECK (theme_preference IN ('light', 'dark', 'rose-gold', 'glass')),
    is_online BOOLEAN DEFAULT FALSE,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- ============================================
-- TABLE: couple_connection
-- Links two profiles as a couple
-- ============================================
CREATE TABLE IF NOT EXISTS couple_connection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    anniversary_date DATE,
    UNIQUE(user_1_id, user_2_id)
);

-- ============================================
-- TABLE: events
-- Calendar events
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL REFERENCES couple_connection(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    type TEXT DEFAULT 'shared' CHECK (type IN ('work', 'personal', 'shared')),
    is_surprise BOOLEAN DEFAULT FALSE,
    surprise_for UUID REFERENCES profiles(id),
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: lists
-- Shared lists (movies, groceries, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL REFERENCES couple_connection(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'list',
    is_template_based BOOLEAN DEFAULT FALSE,
    template_type TEXT CHECK (template_type IN ('movies', 'shows', 'restaurants', 'groceries', 'bucket_list', 'travel', 'custom')),
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: list_items
-- Items within lists
-- ============================================
CREATE TABLE IF NOT EXISTS list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_by UUID REFERENCES profiles(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    priority INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: notes
-- Daily notes between partners
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL REFERENCES couple_connection(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'pink', 'blue', 'green', 'purple')),
    author_id UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: photos
-- Photo gallery
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL REFERENCES couple_connection(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    taken_at DATE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: date_ideas
-- Date night suggestions
-- ============================================
CREATE TABLE IF NOT EXISTS date_ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID REFERENCES couple_connection(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('active', 'chill', 'food', 'adventure', 'home')),
    estimated_time TEXT,
    estimated_cost TEXT CHECK (estimated_cost IN ('$', '$$', '$$$')),
    is_completed BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_custom BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: wishlist_items
-- Gift wishlists (private per user)
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    price TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_bought BOOLEAN DEFAULT FALSE,
    bought_by UUID REFERENCES profiles(id),
    bought_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: recipes
-- Shared recipes
-- ============================================
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    couple_id UUID NOT NULL REFERENCES couple_connection(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    ingredients TEXT[] DEFAULT '{}',
    instructions TEXT[] DEFAULT '{}',
    prep_time TEXT,
    cook_time TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    cuisine TEXT,
    is_cooked BOOLEAN DEFAULT FALSE,
    cooked_count INTEGER DEFAULT 0,
    last_cooked_at TIMESTAMP WITH TIME ZONE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: check_ins
-- Daily mood/check-ins
-- ============================================
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mood TEXT CHECK (mood IN ('great', 'okay', 'not_great')),
    rose TEXT,
    thorn TEXT,
    bud TEXT,
    one_word TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, DATE(created_at))
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_events_couple_date ON events(couple_id, start_date);
CREATE INDEX IF NOT EXISTS idx_lists_couple ON lists(couple_id);
CREATE INDEX IF NOT EXISTS idx_list_items_list ON list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_notes_couple ON notes(couple_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_couple ON photos(couple_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishlist_profile ON wishlist_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_profile_date ON check_ins(profile_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_connection ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/write their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Couple connection: Both partners can access
CREATE POLICY "Partners can view couple connection" ON couple_connection
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE (profiles.id = user_1_id OR profiles.id = user_2_id) 
            AND profiles.user_id = auth.uid()
        )
    );

-- Events: Both partners can CRUD
CREATE POLICY "Partners can manage events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM couple_connection cc
            JOIN profiles p ON (p.id = cc.user_1_id OR p.id = cc.user_2_id)
            WHERE cc.id = events.couple_id AND p.user_id = auth.uid()
        )
    );

-- Lists: Both partners can CRUD
CREATE POLICY "Partners can manage lists" ON lists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM couple_connection cc
            JOIN profiles p ON (p.id = cc.user_1_id OR p.id = cc.user_2_id)
            WHERE cc.id = lists.couple_id AND p.user_id = auth.uid()
        )
    );

-- List items: Both partners can CRUD
CREATE POLICY "Partners can manage list items" ON list_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM lists l
            JOIN couple_connection cc ON cc.id = l.couple_id
            JOIN profiles p ON (p.id = cc.user_1_id OR p.id = cc.user_2_id)
            WHERE l.id = list_items.list_id AND p.user_id = auth.uid()
        )
    );

-- Wishlist: Owner full access, partner read-only (except bought status)
CREATE POLICY "Users can manage own wishlist" ON wishlist_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = profile_id AND profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Partners can view wishlist" ON wishlist_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couple_connection cc
            JOIN profiles p1 ON p1.id = cc.user_1_id
            JOIN profiles p2 ON p2.id = cc.user_2_id
            WHERE (p1.id = profile_id OR p2.id = profile_id)
            AND (p1.user_id = auth.uid() OR p2.user_id = auth.uid())
        )
    );

-- Similar policies for other tables...

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_list_items_updated_at BEFORE UPDATE ON list_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get partner's profile
CREATE OR REPLACE FUNCTION get_partner(current_user_id UUID)
RETURNS TABLE (id UUID, email TEXT, display_name TEXT, is_online BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT p2.id, p2.email, p2.display_name, p2.is_online
    FROM profiles p1
    JOIN couple_connection cc ON (cc.user_1_id = p1.id OR cc.user_2_id = p1.id)
    JOIN profiles p2 ON (p2.id = cc.user_1_id OR p2.id = cc.user_2_id)
    WHERE p1.user_id = current_user_id AND p2.user_id != current_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;