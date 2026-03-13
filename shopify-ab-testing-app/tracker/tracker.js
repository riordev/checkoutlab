/**
 * CheckoutLab Tracker
 * Shopify A/B Testing Script Tag
 * 
 * Installation: Add to theme.liquid before </head>
 * <script src="https://cdn.checkoutlab.app/tracker.js" async></script>
 */

(function() {
  'use strict';

  const CONFIG = window.checkoutlabConfig || {};
  const API_URL = 'https://api.checkoutlab.app';
  const COOKIE_NAME = '_clab_session';
  const STORAGE_KEY = 'checkoutlab_variant';

  // Utility functions
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }

  function getSessionId() {
    let sessionId = getCookie(COOKIE_NAME);
    if (!sessionId) {
      sessionId = generateId();
      setCookie(COOKIE_NAME, sessionId, 30); // 30 days
    }
    return sessionId;
  }

  // Variant assignment
  function getAssignedVariant(testId) {
    const variants = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!variants[testId]) {
      // Assign based on traffic split
      const tests = CONFIG.tests || [];
      const test = tests.find(t => t.id === testId);
      if (test) {
        const random = Math.random() * 100;
        let cumulative = 0;
        for (const variant of test.variants) {
          cumulative += variant.traffic_percentage;
          if (random <= cumulative) {
            variants[testId] = variant.key;
            break;
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(variants));
      }
    }
    return variants[testId] || 'control';
  }

  // Event tracking
  function trackEvent(eventType, data = {}) {
    const event = {
      shop: CONFIG.shop || window.Shopify?.shop,
      session_id: getSessionId(),
      event_type: eventType,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      ...data
    };

    // Send to API
    fetch(`${API_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true
    }).catch(err => console.debug('CheckoutLab:', err));

    // Also store locally for debugging
    console.debug('CheckoutLab Event:', event);
  }

  // Test application
  function applyTest(test) {
    const variant = getAssignedVariant(test.id);
    const variantConfig = test.variants.find(v => v.key === variant);
    
    if (!variantConfig) return;

    switch (test.type) {
      case 'bundle_selector':
        applyBundleSelector(variantConfig.config);
        break;
      case 'upsell':
        applyUpsell(variantConfig.config);
        break;
      case 'checkout_button':
        applyCheckoutButton(variantConfig.config);
        break;
      case 'shipping_message':
        applyShippingMessage(variantConfig.config);
        break;
    }

    // Track that test was applied
    trackEvent('test_applied', {
      test_id: test.id,
      test_name: test.name,
      variant: variant,
      test_type: test.type
    });
  }

  // Test implementations
  function applyBundleSelector(config) {
    // Inject bundle selector widget
    if (!config.enabled) return;
    
    const observer = new MutationObserver((mutations) => {
      const productForm = document.querySelector('form[action="/cart/add"]');
      if (productForm && !productForm.dataset.clabBundle) {
        productForm.dataset.clabBundle = 'true';
        
        const bundleHtml = `
          <div class="clab-bundle-selector" style="margin: 20px 0; padding: 15px; background: #f8f8f8; border-radius: 8px;">
            <p style="font-weight: bold; margin-bottom: 10px;">${config.title || 'Bundle & Save'}</p>
            ${config.options.map((opt, i) => `
              <label style="display: block; margin: 8px 0; cursor: pointer;">
                <input type="radio" name="clab_bundle" value="${i}" ${i === 0 ? 'checked' : ''} 
                       data-discount="${opt.discount}" data-quantity="${opt.quantity}">
                ${opt.label} - ${opt.discount}% off
              </label>
            `).join('')}
          </div>
        `;
        
        productForm.insertAdjacentHTML('afterbegin', bundleHtml);
        
        // Track selection
        productForm.querySelectorAll('input[name="clab_bundle"]').forEach(radio => {
          radio.addEventListener('change', (e) => {
            trackEvent('bundle_selected', {
              bundle_index: e.target.value,
              discount: e.target.dataset.discount,
              quantity: e.target.dataset.quantity
            });
          });
        });
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function applyUpsell(config) {
    if (!config.enabled) return;
    
    // Show upsell modal after add to cart
    document.addEventListener('click', (e) => {
      if (e.target.matches('[type="submit"]') || e.target.closest('[type="submit"]')) {
        const form = e.target.closest('form');
        if (form && form.action.includes('/cart/add')) {
          setTimeout(() => {
            trackEvent('upsell_shown', {
              upsell_product: config.product_id,
              upsell_price: config.price
            });
          }, 100);
        }
      }
    });
  }

  function applyCheckoutButton(config) {
    if (!config.text) return;
    
    const observer = new MutationObserver(() => {
      const buttons = document.querySelectorAll('button[name="checkout"], input[name="checkout"]');
      buttons.forEach(btn => {
        if (!btn.dataset.clabModified) {
          btn.dataset.clabModified = 'true';
          const originalText = btn.textContent || btn.value;
          btn.textContent = config.text;
          btn.value = config.text;
          
          trackEvent('checkout_button_modified', {
            original_text: originalText,
            new_text: config.text
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function applyShippingMessage(config) {
    if (!config.message) return;
    
    const observer = new MutationObserver(() => {
      const cartForm = document.querySelector('form[action="/cart"]');
      if (cartForm && !cartForm.dataset.clabShipping) {
        cartForm.dataset.clabShipping = 'true';
        
        const messageHtml = `
          <div class="clab-shipping-message" style="padding: 12px; margin: 15px 0; 
                  background: ${config.bg_color || '#e8f5e9'}; color: ${config.text_color || '#2e7d32'}; 
                  border-radius: 6px; text-align: center; font-weight: 500;">
            ${config.message}
          </div>
        `;
        
        cartForm.insertAdjacentHTML('beforeend', messageHtml);
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Revenue tracking
  function trackRevenue() {
    // Check if we're on order confirmation page
    if (window.location.pathname.includes('/checkout/thank_you')) {
      const orderId = window.Shopify?.checkout?.order_id;
      const totalPrice = window.Shopify?.checkout?.total_price;
      
      if (orderId && totalPrice) {
        trackEvent('purchase', {
          order_id: orderId,
          revenue: parseFloat(totalPrice),
          currency: window.Shopify?.checkout?.currency || 'USD'
        });
      }
    }
  }

  // Initialize
  function init() {
    // Track page view
    trackEvent('page_view', {
      page_type: window.location.pathname.includes('/products') ? 'product' :
                 window.location.pathname.includes('/cart') ? 'cart' :
                 window.location.pathname.includes('/checkout') ? 'checkout' : 'other'
    });

    // Track add to cart
    document.addEventListener('click', (e) => {
      const addToCartBtn = e.target.closest('[name="add"], .add-to-cart, [data-add-to-cart]');
      if (addToCartBtn) {
        trackEvent('add_to_cart');
      }
    });

    // Track checkout start
    document.addEventListener('click', (e) => {
      const checkoutBtn = e.target.closest('[name="checkout"], [href="/checkout"]');
      if (checkoutBtn) {
        trackEvent('checkout_started');
      }
    });

    // Apply active tests
    const tests = CONFIG.tests || [];
    tests.filter(t => t.status === 'running').forEach(applyTest);

    // Track revenue on thank you page
    trackRevenue();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
