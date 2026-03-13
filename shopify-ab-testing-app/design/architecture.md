# Technical Architecture

**Integration with Shopify:**
- Use Shopify Functions for real-time A/B test execution.
- Utilize Script Tags for displaying dynamic content without needing app embeds.

**Database Schema:**
- **Tests**: `id`, `merchant_id`, `name`, `status`
- **Variants**: `id`, `test_id`, `name`, `conversion_rate`
- **Events**: `id`, `variant_id`, `timestamp`, `action`

**Statistical Calculation Approach:**
- Calculate conversion rates with Bayesian inference methods.
- Use confidence intervals and p-values for significance testing.

**Shopify App Store Submission Checklist:**
- Ensure compatibility with Shopify policies.
- Prepare marketing assets: icons, screenshots.
- Detailed app listing description and usage guide.
- Testing the app thoroughly on various devices. 