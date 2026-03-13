# PRIVACY POLICY — CheckoutLab

**Effective Date:** [DATE]
**Last Updated:** March 13, 2026

---

## 1. INTRODUCTION

CheckoutLab ("we," "us," or "our") provides A/B testing and analytics services for Shopify merchants. This Privacy Policy explains how we collect, use, store, and protect information when you use our Shopify app.

**Contact Information:**
- Email: privacy@checkoutlab.app
- Business Address: [YOUR ADDRESS]
- Data Protection Officer: [NAME/EMAIL]

---

## 2. INFORMATION WE COLLECT

### 2.1 Information from Merchants (You)

**Account Information:**
- Shopify store domain
- Email address
- Billing information (processed by Stripe)
- App configuration settings

**Test Configuration:**
- A/B test parameters and variants
- Targeting rules and segmentation criteria
- Custom HTML/CSS/JavaScript for tests

### 2.2 Information from Store Visitors (End Users)

**Automatically Collected:**
- Anonymous session ID (randomly generated)
- Page views and interactions
- Click events and mouse movements (for heatmaps)
- Scroll depth
- Device type (mobile/desktop/tablet)
- Browser type and version
- Geographic location (country/region level only)
- Referrer URL
- Timestamps of events

**E-commerce Data:**
- Cart additions and removals
- Checkout initiation and completion
- Order values and currency
- Product interactions (views, additions)

**Important:** We do NOT collect:
- ❌ Names or email addresses of store visitors
- ❌ Payment card information
- ❌ Precise location (GPS coordinates)
- ❌ Personally identifiable information (PII)
- ❌ Data from visitors who decline tracking consent

---

## 3. HOW WE USE INFORMATION

### 3.1 Merchant Data

We use merchant information to:
- Provide and maintain the CheckoutLab service
- Process payments and billing
- Send service-related notifications
- Provide customer support
- Improve our product based on usage patterns

### 3.2 Visitor Data (Analytics)

We use visitor data to:
- Calculate A/B test results and statistical significance
- Generate heatmaps and session recordings
- Create funnel analysis reports
- Measure conversion rates and revenue impact

**All visitor data is:**
- Anonymized where possible
- Aggregated for reporting
- Never sold to third parties
- Never used for advertising
- Never shared with other merchants

---

## 4. DATA STORAGE & SECURITY

### 4.1 Storage Location

All data is stored in:
- **Primary:** Google Cloud Platform (US-East region)
- **Backups:** US-West region (encrypted)
- **CDN:** Cloudflare (global edge caching)

### 4.2 Security Measures

We implement industry-standard security:
- AES-256 encryption at rest
- TLS 1.3 for data in transit
- SOC 2 Type II compliant infrastructure
- Regular security audits
- Role-based access control (RBAC)
- API key authentication with rate limiting

### 4.3 Data Retention

| Data Type | Retention Period | Deletion |
|-----------|-----------------|----------|
| Merchant account data | Duration of service + 2 years | Manual request |
| Active visitor events | 2 years | Automatic |
| Completed test data | 3 years | Automatic |
| Session recordings | 90 days | Automatic |
| Heatmap data | 1 year | Automatic |
| Deleted account data | 30 days post-deletion | Immediate |

---

## 5. COOKIES & TRACKING TECHNOLOGIES

### 5.1 Cookies We Use

**Essential Cookies (Required):**
- `_clab_session` — Maintains anonymous session ID (30 days)
- `_clab_variant` — Stores A/B test variant assignment (persistent)

**Analytics Cookies (With Consent):**
- `_clab_heatmaps` — Enables heatmap tracking
- `_clab_recordings` — Enables session recording

### 5.2 Consent Management

We support GDPR-compliant consent:
- Visitors can decline non-essential tracking
- Merchants can configure consent banners
- Opt-out respected immediately
- No tracking before consent on EU visits

**Consent API:**
```javascript
// Visitor declines
checkoutlab('consent', 'decline');

// Visitor accepts
checkoutlab('consent', 'accept');
```

---

## 6. DATA SHARING & THIRD PARTIES

### 6.1 Service Providers

We share data only with:

| Provider | Purpose | Data Shared |
|----------|---------|-------------|
| Google Cloud | Hosting | All data (encrypted) |
| Stripe | Payment processing | Billing info only |
| Cloudflare | CDN & security | Anonymized traffic data |
| SendGrid | Email notifications | Merchant email only |

### 6.2 We Do NOT Share With:

- Advertising platforms (Facebook, Google Ads)
- Data brokers
- Other merchants
- Analytics companies (we are the analytics)

### 6.3 Legal Requirements

We may disclose data if required by:
- Valid court order or subpoena
- Law enforcement request (with legal basis)
- To protect our rights or safety
- Business transfer (merger/acquisition)

---

## 7. YOUR RIGHTS (GDPR, CCPA)

### 7.1 For Merchants

You have the right to:
- **Access:** Request a copy of all your data
- **Correction:** Update inaccurate information
- **Deletion:** Request account and data deletion
- **Portability:** Export data in JSON/CSV format
- **Objection:** Opt out of marketing communications

### 7.2 For Store Visitors (Your Customers)

Visitors to your store have the right to:
- **Know:** What data is collected about them
- **Access:** Request their data (you must forward to us)
- **Deletion:** Request deletion of their data
- **Opt-out:** Decline tracking at any time
- **Non-discrimination:** Equal service regardless of opt-out

**To submit a data request:**
Email: privacy@checkoutlab.app
Subject: "Data Request - [Store Domain]"
Response time: 30 days

---

## 8. SHOPIFY APP STORE REQUIREMENTS

### 8.1 Data Access

CheckoutLab accesses via Shopify APIs:
- Store metadata (domain, plan)
- Theme files (for script installation)
- Orders (revenue data for attribution)

We do NOT access:
- Customer email lists
- Product cost/COGS data
- Staff/admin information

### 8.2 Uninstallation

When you uninstall CheckoutLab:
1. Script tag automatically removed from theme
2. Tracking stops immediately
3. Data retained for 30 days (in case of re-install)
4. After 30 days, all data permanently deleted

**To delete immediately:**
Email privacy@checkoutlab.app with your store domain.

---

## 9. CHILDREN'S PRIVACY

CheckoutLab is not intended for use by children under 13. We do not knowingly collect data from children. If you believe we have collected data from a child, contact us immediately for deletion.

---

## 10. CHANGES TO THIS POLICY

We may update this policy periodically. We will notify you of material changes:
- By email to the account owner
- Via in-app notification
- By updating the "Last Updated" date

**Material changes include:**
- New data collection practices
- New third-party sharing
- Changes to retention periods

---

## 11. COMPLIANCE

### 11.1 GDPR (EU/UK)

- Legal basis: Legitimate interest (analytics) + Consent (tracking)
- Data Protection Officer: [EMAIL]
- EU representative: [IF APPLICABLE]

### 11.2 CCPA (California)

- We do not sell personal information
- California residents may request data deletion
- No discrimination for exercising privacy rights

### 11.3 ePrivacy Directive

- Consent required for non-essential cookies
- Essential cookies (session, variant) are necessary for service
- Clear cookie policy provided

---

## 12. CONTACT US

For privacy-related questions:

**Email:** privacy@checkoutlab.app
**Response Time:** 24-48 hours
**Address:** [YOUR BUSINESS ADDRESS]

For complaints (EU residents):
You have the right to lodge a complaint with your local supervisory authority.

---

## 13. DOCUMENT HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | [DATE] | Initial release |

---

**DRAFT — FOR LEGAL REVIEW BEFORE PUBLICATION**

*This document should be reviewed by legal counsel before being published as the official privacy policy.*