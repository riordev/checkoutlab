# CheckoutLab — Backend Architecture & Implementation Plan

## Overview
Shopify A/B Testing App for checkout flows using Script Tag injection approach.

---

## Architecture

### 1. Tracking Mechanism (Script Tag)

**Why Script Tags over Shopify Functions:**
- Works on ALL Shopify plans (Basic to Plus)
- No checkout.liquid editing required
- Easier to implement and iterate
- Can test immediately without merchant approval delays

**Implementation:**
```javascript
// checkoutlab-tracker.js
(function() {
  const TEST_CONFIG = window.checkoutlabConfig || {};
  
  // Track page views
  function trackEvent(event, data) {
    fetch('https://api.checkoutlab.app/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop: Shopify.shop,
        event: event,
        data: data,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        variant: getAssignedVariant()
      })
    });
  }
  
  // Track: page_view, add_to_cart, checkout_started, checkout_step, purchase
  // A/B variant assignment (stored in cookie/localStorage)
  // Revenue attribution per variant
})();
```

**Liquid Injection:**
```liquid
<!-- In theme.liquid -->
{% if checkoutlab_enabled %}
<script src="https://cdn.checkoutlab.app/tracker.js" async></script>
<script>
  window.checkoutlabConfig = {
    shop: '{{ shop.permanent_domain }}',
    tests: {{ checkoutlab_tests | json }}
  };
</script>
{% endif %}
```

---

### 2. Database Schema (PostgreSQL)

```sql
-- Shops table
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_domain VARCHAR(255) UNIQUE NOT NULL,
    access_token VARCHAR(255) NOT NULL,
    plan VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

-- A/B Tests table
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'bundle_selector', 'upsell', 'layout', 'checkout_step'
    status VARCHAR(20) DEFAULT 'draft', -- draft, running, paused, completed
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    traffic_split INTEGER DEFAULT 50, -- percentage for variant A
    primary_metric VARCHAR(50) DEFAULT 'revenue', -- revenue, conversion_rate, aov
    min_sample_size INTEGER DEFAULT 100,
    confidence_level DECIMAL DEFAULT 0.95,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Test Variants table
CREATE TABLE variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES tests(id),
    name VARCHAR(100) NOT NULL, -- 'Control', 'Variant A', etc.
    key VARCHAR(50) NOT NULL, -- 'control', 'variant_a'
    config JSONB NOT NULL, -- variant-specific settings
    traffic_percentage INTEGER NOT NULL
);

-- Events table (tracking)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID REFERENCES shops(id),
    test_id UUID REFERENCES tests(id),
    variant_id UUID REFERENCES variants(id),
    session_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- page_view, add_to_cart, checkout_started, purchase
    revenue DECIMAL(10,2),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Test Results (aggregated)
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES tests(id),
    variant_id UUID REFERENCES variants(id),
    visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    conversion_rate DECIMAL(5,4),
    aov DECIMAL(10,2),
    confidence_score DECIMAL(5,4),
    is_winner BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3. Statistical Significance Calculation

**Bayesian A/B Testing Approach:**

```python
# Python backend service
def calculate_significance(control_conversions, control_visitors, 
                          variant_conversions, variant_visitors):
    """
    Returns: confidence score (0-100), winner, lift percentage
    """
    # Beta distribution for conversion rates
    # Calculate probability that variant > control
    # Return confidence score
    pass

def determine_winner(test_results):
    """
    Auto-declare winner when:
    - 95% confidence reached
    - Minimum sample size met
    - Statistical significance for 7+ days
    """
    pass
```

---

### 4. API Endpoints

```
POST /api/v1/track          - Receive tracking events
GET  /api/v1/tests          - List tests for a shop
POST /api/v1/tests          - Create new test
GET  /api/v1/tests/:id      - Get test details
POST /api/v1/tests/:id/start
POST /api/v1/tests/:id/pause
GET  /api/v1/tests/:id/results  - Get statistical results
POST /api/v1/tests/:id/winner   - Declare winner
```

---

### 5. Admin Dashboard (Next.js)

**Pages:**
- `/dashboard` - Overview of all tests
- `/tests/new` - Create new test wizard
- `/tests/:id` - Test details and results
- `/settings` - Shop configuration

**Features:**
- Visual test creator (no-code)
- Real-time results charts
- Statistical significance indicators
- Winner auto-suggestion
- Revenue lift calculator

---

### 6. Shopify App Store Requirements

**Technical:**
- [ ] OAuth 2.0 authentication
- [ ] GDPR data handling
- [ ] Webhook handling (uninstall, shop update)
- [ ] App Bridge integration
- [ ] Billing API integration

**Assets:**
- [ ] App icon (1024x1024)
- [ ] Screenshots (5 minimum)
- [ ] Demo video
- [ ] Detailed description
- [ ] Privacy policy URL
- [ ] Support URL

**Pricing:**
- Free tier: 1 test, 1,000 events/month
- Starter: $29/month - 5 tests, 10K events
- Growth: $79/month - Unlimited tests, 50K events
- Enterprise: Custom

---

### 7. Implementation Phases

**Phase 1: MVP (Week 1-2)**
- Script tag tracking
- Basic A/B test creation
- Revenue tracking
- Simple results dashboard

**Phase 2: Statistics (Week 3)**
- Bayesian significance calculation
- Winner declaration
- Auto-stop tests

**Phase 3: Polish (Week 4)**
- Visual test builder
- Shopify App Store submission
- Documentation

---

**Next Steps:**
1. Build tracker.js
2. Set up Supabase/PostgreSQL
3. Create admin dashboard
4. Test with demo store