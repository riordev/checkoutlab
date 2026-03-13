-- CheckoutLab Database Schema
-- Supabase PostgreSQL Schema for Shopify A/B Testing App
-- Project: https://sbnyjzliawqhjrjbisjm.supabase.co

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================
-- TABLE: shops
-- Store information for each Shopify shop
-- ============================================
CREATE TABLE IF NOT EXISTS shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_domain TEXT UNIQUE NOT NULL,
    access_token TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: tests
-- A/B tests configuration
-- ============================================
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('bundle_selector', 'upsell', 'checkout_button', 'shipping_message')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
    traffic_split INTEGER NOT NULL DEFAULT 50 CHECK (traffic_split >= 0 AND traffic_split <= 100),
    primary_metric TEXT DEFAULT 'conversion_rate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: variants
-- Test variants (control and variations)
-- ============================================
CREATE TABLE IF NOT EXISTS variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key TEXT NOT NULL CHECK (key IN ('control', 'variant_a', 'variant_b', 'variant_c')),
    config JSONB NOT NULL DEFAULT '{}',
    traffic_percentage INTEGER NOT NULL DEFAULT 50 CHECK (traffic_percentage >= 0 AND traffic_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, key)
);

-- ============================================
-- TABLE: events
-- Tracking events for test analytics
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'add_to_cart', 'checkout_started', 'checkout_completed', 'conversion')),
    revenue DECIMAL(12, 2) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: test_results
-- Aggregated results for quick analytics
-- ============================================
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    visitors INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0.00,
    conversion_rate DECIMAL(8, 4) DEFAULT 0.0000,
    confidence_score DECIMAL(5, 4) DEFAULT 0.0000,
    is_winner BOOLEAN DEFAULT FALSE,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, variant_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Shops indexes
CREATE INDEX IF NOT EXISTS idx_shops_domain ON shops(shop_domain);
CREATE INDEX IF NOT EXISTS idx_shops_created_at ON shops(created_at);

-- Tests indexes
CREATE INDEX IF NOT EXISTS idx_tests_shop_id ON tests(shop_id);
CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status);
CREATE INDEX IF NOT EXISTS idx_tests_shop_status ON tests(shop_id, status);
CREATE INDEX IF NOT EXISTS idx_tests_created_at ON tests(created_at);

-- Variants indexes
CREATE INDEX IF NOT EXISTS idx_variants_test_id ON variants(test_id);
CREATE INDEX IF NOT EXISTS idx_variants_key ON variants(key);

-- Events indexes (critical for analytics performance)
CREATE INDEX IF NOT EXISTS idx_events_shop_id ON events(shop_id);
CREATE INDEX IF NOT EXISTS idx_events_test_id ON events(test_id);
CREATE INDEX IF NOT EXISTS idx_events_variant_id ON events(variant_id);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_shop_test_type ON events(shop_id, test_id, event_type);
CREATE INDEX IF NOT EXISTS idx_events_shop_test_variant ON events(shop_id, test_id, variant_id);

-- Test results indexes
CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_variant_id ON test_results(variant_id);
CREATE INDEX IF NOT EXISTS idx_test_results_is_winner ON test_results(is_winner);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Shops RLS policies
CREATE POLICY "Allow authenticated full access to shops" 
    ON shops FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access to shops" 
    ON shops FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Tests RLS policies
CREATE POLICY "Allow authenticated full access to tests" 
    ON tests FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access to tests" 
    ON tests FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Variants RLS policies
CREATE POLICY "Allow authenticated full access to variants" 
    ON variants FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access to variants" 
    ON variants FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Events RLS policies
CREATE POLICY "Allow authenticated insert on events" 
    ON events FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated select on events" 
    ON events FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access to events" 
    ON events FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Test results RLS policies
CREATE POLICY "Allow authenticated read access to test_results" 
    ON test_results FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access to test_results" 
    ON test_results FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at BEFORE UPDATE ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Calculate test results for a specific test
CREATE OR REPLACE FUNCTION calculate_test_results(p_test_id UUID)
RETURNS TABLE (
    variant_id UUID,
    variant_name TEXT,
    variant_key TEXT,
    visitors BIGINT,
    conversions BIGINT,
    revenue DECIMAL,
    conversion_rate DECIMAL,
    confidence_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id AS variant_id,
        v.name AS variant_name,
        v.key AS variant_key,
        COUNT(DISTINCT e.session_id) AS visitors,
        COUNT(DISTINCT CASE WHEN e.event_type = 'conversion' THEN e.session_id END) AS conversions,
        COALESCE(SUM(CASE WHEN e.event_type = 'conversion' THEN e.revenue ELSE 0 END), 0) AS revenue,
        CASE 
            WHEN COUNT(DISTINCT e.session_id) > 0 
            THEN ROUND(COUNT(DISTINCT CASE WHEN e.event_type = 'conversion' THEN e.session_id END)::DECIMAL / COUNT(DISTINCT e.session_id), 4)
            ELSE 0 
        END AS conversion_rate,
        0.00::DECIMAL AS confidence_score -- Placeholder, would need statistical calculation
    FROM variants v
    LEFT JOIN events e ON v.id = e.variant_id AND e.test_id = p_test_id
    WHERE v.test_id = p_test_id
    GROUP BY v.id, v.name, v.key
    ORDER BY conversion_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- Function: Upsert test results (aggregate and store)
CREATE OR REPLACE FUNCTION upsert_test_results(p_test_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO test_results (test_id, variant_id, visitors, conversions, revenue, conversion_rate, confidence_score, calculated_at)
    SELECT 
        p_test_id,
        v.id,
        COUNT(DISTINCT e.session_id)::INTEGER,
        COUNT(DISTINCT CASE WHEN e.event_type = 'conversion' THEN e.session_id END)::INTEGER,
        COALESCE(SUM(CASE WHEN e.event_type = 'conversion' THEN e.revenue ELSE 0 END), 0),
        CASE 
            WHEN COUNT(DISTINCT e.session_id) > 0 
            THEN ROUND(COUNT(DISTINCT CASE WHEN e.event_type = 'conversion' THEN e.session_id END)::DECIMAL / COUNT(DISTINCT e.session_id), 4)
            ELSE 0 
        END,
        0.00,
        NOW()
    FROM variants v
    LEFT JOIN events e ON v.id = e.variant_id AND e.test_id = p_test_id
    WHERE v.test_id = p_test_id
    GROUP BY v.id
    ON CONFLICT (test_id, variant_id) 
    DO UPDATE SET
        visitors = EXCLUDED.visitors,
        conversions = EXCLUDED.conversions,
        revenue = EXCLUDED.revenue,
        conversion_rate = EXCLUDED.conversion_rate,
        confidence_score = EXCLUDED.confidence_score,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function: Get winner variant for a test
CREATE OR REPLACE FUNCTION get_test_winner(p_test_id UUID)
RETURNS TABLE (
    variant_id UUID,
    variant_name TEXT,
    variant_key TEXT,
    conversion_rate DECIMAL,
    is_winner BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tr.variant_id,
        v.name AS variant_name,
        v.key AS variant_key,
        tr.conversion_rate,
        tr.is_winner
    FROM test_results tr
    JOIN variants v ON tr.variant_id = v.id
    WHERE tr.test_id = p_test_id
    ORDER BY tr.conversion_rate DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function: Mark winning variant
CREATE OR REPLACE FUNCTION mark_winner(p_test_id UUID, p_variant_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE test_results 
    SET is_winner = (variant_id = p_variant_id),
        updated_at = NOW()
    WHERE test_id = p_test_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS
-- ============================================

-- View: Active tests with shop info
CREATE OR REPLACE VIEW active_tests AS
SELECT 
    t.*,
    s.shop_domain,
    s.plan
FROM tests t
JOIN shops s ON t.shop_id = s.id
WHERE t.status = 'running';

-- View: Test summary with variant counts
CREATE OR REPLACE VIEW test_summary AS
SELECT 
    t.id AS test_id,
    t.name AS test_name,
    t.type,
    t.status,
    s.shop_domain,
    COUNT(v.id) AS variant_count,
    t.created_at,
    t.updated_at
FROM tests t
JOIN shops s ON t.shop_id = s.id
LEFT JOIN variants v ON t.id = v.test_id
GROUP BY t.id, t.name, t.type, t.status, s.shop_domain, t.created_at, t.updated_at;

-- View: Daily event stats
CREATE OR REPLACE VIEW daily_event_stats AS
SELECT 
    DATE(e.created_at) AS date,
    e.shop_id,
    e.test_id,
    e.variant_id,
    e.event_type,
    COUNT(*) AS event_count,
    SUM(e.revenue) AS total_revenue
FROM events e
GROUP BY DATE(e.created_at), e.shop_id, e.test_id, e.variant_id, e.event_type;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE shops IS 'Stores Shopify shop information and access tokens';
COMMENT ON TABLE tests IS 'A/B test configurations for each shop';
COMMENT ON TABLE variants IS 'Test variants (control and variations) for each test';
COMMENT ON TABLE events IS 'Tracking events for analytics and conversion tracking';
COMMENT ON TABLE test_results IS 'Pre-aggregated test results for fast analytics queries';

COMMENT ON COLUMN tests.type IS 'Type of test: bundle_selector, upsell, checkout_button, shipping_message';
COMMENT ON COLUMN tests.status IS 'Test status: draft, running, paused, completed';
COMMENT ON COLUMN events.event_type IS 'Type of event: view, click, add_to_cart, checkout_started, checkout_completed, conversion';
COMMENT ON COLUMN events.revenue IS 'Revenue amount in USD for conversion events';

-- ============================================
-- SEED DATA (Optional - for development)
-- ============================================

-- Uncomment below for local development seeding
/*
INSERT INTO shops (shop_domain, access_token, plan) VALUES
    ('test-store.myshopify.com', 'shpat_xxxxxxxxxxxxxxxx', 'free'),
    ('demo-store.myshopify.com', 'shpat_yyyyyyyyyyyyyyyy', 'pro');

INSERT INTO tests (shop_id, name, type, status, traffic_split, primary_metric) VALUES
    ((SELECT id FROM shops WHERE shop_domain = 'test-store.myshopify.com'), 'Checkout Button Color', 'checkout_button', 'running', 50, 'conversion_rate'),
    ((SELECT id FROM shops WHERE shop_domain = 'test-store.myshopify.com'), 'Bundle Selector Test', 'bundle_selector', 'draft', 50, 'conversion_rate');

INSERT INTO variants (test_id, name, key, config, traffic_percentage) VALUES
    ((SELECT id FROM tests WHERE name = 'Checkout Button Color'), 'Control - Green', 'control', '{"color": "#00AA00"}'::jsonb, 50),
    ((SELECT id FROM tests WHERE name = 'Checkout Button Color'), 'Variant - Blue', 'variant_a', '{"color": "#0000AA"}'::jsonb, 50),
    ((SELECT id FROM tests WHERE name = 'Bundle Selector Test'), 'Control', 'control', '{}'::jsonb, 50),
    ((SELECT id FROM tests WHERE name = 'Bundle Selector Test'), 'Variant A', 'variant_a', '{"layout": "grid"}'::jsonb, 50);
*/
