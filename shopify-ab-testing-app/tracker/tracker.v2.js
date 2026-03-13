/**
 * CheckoutLab Tracker v2.0
 * Shopify A/B Testing Script Tag
 * 
 * Installation: Add to theme.liquid before </head>
 * <script src="https://cdn.checkoutlab.app/tracker.js" async></script>
 */

(function() {
  'use strict';

  const CONFIG = window.checkoutlabConfig || {};
  const API_URL = CONFIG.apiUrl || 'https://api.checkoutlab.app';
  const COOKIE_NAME = '_clab_session';
  const STORAGE_KEY = '_clab_variant_v2';
  const CONSENT_KEY = '_clab_consent';
  const QUEUE_KEY = '_clab_queue';
  
  // Feature flags
  const FEATURES = {
    gdpr: true,
    retry: true,
    batching: true,
    beacon: navigator.sendBeacon !== undefined,
    safariITP: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  };

  // Queue for batching
  let eventQueue = [];
  let flushTimeout = null;

  // ========== UTILITY FUNCTIONS ==========

  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function safeJsonParse(str, fallback = {}) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  }

  // Safari ITP-safe storage (falls back to cookies if localStorage blocked)
  function getStorage(key) {
    if (FEATURES.safariITP) {
      return safeJsonParse(getCookie(key), null);
    }
    try {
      return safeJsonParse(localStorage.getItem(key));
    } catch (e) {
      return safeJsonParse(getCookie(key), null);
    }
  }

  function setStorage(key, value, days = 30) {
    const json = JSON.stringify(value);
    if (FEATURES.safariITP) {
      setCookie(key, json, days);
      return;
    }
    try {
      localStorage.setItem(key, json);
    } catch (e) {
      // Fallback to cookie if localStorage full or blocked
      setCookie(key, json, days);
    }
  }

  function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
      try {
        return decodeURIComponent(parts.pop().split(';').shift());
      } catch (e) {
        return parts.pop().split(';').shift();
      }
    }
    return null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secure = location.protocol === 'https:' ? '; secure' : '';
    const sameSite = '; samesite=lax';
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${secure}${sameSite}`;
  }

  // ========== GDPR CONSENT MANAGEMENT ==========

  const ConsentManager = {
    hasConsent: function() {
      const consent = getStorage(CONSENT_KEY);
      return consent === true;
    },

    requestConsent: function() {
      if (this.hasConsent() || CONFIG.skipConsentBanner) return true;
      
      // Check for existing banner
      if (document.getElementById('clab-consent-banner')) return false;

      // Create consent banner
      const banner = document.createElement('div');
      banner.id = 'clab-consent-banner';
      banner.innerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #1a1a2e; color: white; 
                    padding: 16px 24px; font-family: system-ui, sans-serif; font-size: 14px; z-index: 99999;
                    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <span style="flex: 1; min-width: 200px;">
            We use cookies to analyze checkout behavior and improve your experience. 
            <a href="${CONFIG.privacyUrl || '/privacy'}" style="color: #60a5fa; text-decoration: underline;">Learn more</a>
          </span>
          <div style="display: flex; gap: 8px;">
            <button id="clab-decline" style="padding: 8px 16px; background: transparent; border: 1px solid #4b5563; 
                     color: white; border-radius: 6px; cursor: pointer; font-size: 14px;">Decline</button>
            <button id="clab-accept" style="padding: 8px 16px; background: #3b82f6; border: none; 
                     color: white; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">Accept</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(banner);

      banner.querySelector('#clab-accept').addEventListener('click', () => {
        setStorage(CONSENT_KEY, true, 365);
        banner.remove();
        initTracking();
      });

      banner.querySelector('#clab-decline').addEventListener('click', () => {
        setStorage(CONSENT_KEY, false, 365);
        banner.remove();
      });

      return false;
    }
  };

  // ========== SESSION MANAGEMENT ==========

  function getSessionId() {
    let sessionId = getCookie(COOKIE_NAME);
    
    // Safari ITP: Use session cookie (deleted when tab closes) + localStorage backup
    if (FEATURES.safariITP) {
      const backup = getStorage('_clab_session_backup');
      if (!sessionId && backup) {
        sessionId = backup;
      }
      if (!sessionId) {
        sessionId = generateId();
        setCookie(COOKIE_NAME, sessionId); // Session cookie
        setStorage('_clab_session_backup', sessionId, 1); // 1 day backup
      }
    } else {
      if (!sessionId) {
        sessionId = generateId();
        setCookie(COOKIE_NAME, sessionId, 30);
      }
    }
    
    return sessionId;
  }

  // ========== VARIANT ASSIGNMENT ==========

  function getAssignedVariant(testId) {
    const variants = getStorage(STORAGE_KEY) || {};
    
    if (!variants[testId]) {
      const tests = CONFIG.tests || [];
      const test = tests.find(t => t.id === testId);
      
      if (test && test.variants) {
        const random = Math.random() * 100;
        let cumulative = 0;
        
        for (const variant of test.variants) {
          cumulative += variant.traffic_percentage;
          if (random <= cumulative) {
            variants[testId] = variant.key;
            break;
          }
        }
        
        setStorage(STORAGE_KEY, variants, 30);
      }
    }
    
    return variants[testId] || 'control';
  }

  // ========== EVENT TRACKING (BATCHED) ==========

  function queueEvent(event) {
    if (!ConsentManager.hasConsent()) return;
    
    eventQueue.push({
      ...event,
      _queuedAt: Date.now()
    });

    // Flush queue every 5 seconds or when 10 events
    if (eventQueue.length >= 10) {
      flushQueue();
    } else if (!flushTimeout) {
      flushTimeout = setTimeout(flushQueue, 5000);
    }
  }

  function flushQueue() {
    if (eventQueue.length === 0) return;
    
    const events = [...eventQueue];
    eventQueue = [];
    clearTimeout(flushTimeout);
    flushTimeout = null;

    // Try Beacon API first (most reliable on page unload)
    if (FEATURES.beacon) {
      const blob = new Blob([JSON.stringify({ events })], { type: 'application/json' });
      if (navigator.sendBeacon(`${API_URL}/track`, blob)) {
        return;
      }
    }

    // Fallback to fetch with retry
    sendWithRetry(events);
  }

  function sendWithRetry(events, attempt = 1) {
    fetch(`${API_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      keepalive: true
    })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    })
    .catch(err => {
      console.debug('CheckoutLab: Track error', err);
      
      // Retry with exponential backoff (max 3 attempts)
      if (attempt < 3 && FEATURES.retry) {
        setTimeout(() => sendWithRetry(events, attempt + 1), Math.pow(2, attempt) * 1000);
      } else {
        // Store failed events for later retry
        const failed = getStorage(QUEUE_KEY) || [];
        failed.push(...events);
        setStorage(QUEUE_KEY, failed.slice(-50), 7); // Keep last 50, 7 days
      }
    });
  }

  function trackEvent(eventType, data = {}) {
    if (!ConsentManager.hasConsent()) return;

    const event = {
      shop: CONFIG.shop || window.Shopify?.shop,
      session_id: getSessionId(),
      event_type: eventType,
      url: window.location.href,
      pathname: window.location.pathname,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ...data
    };

    queueEvent(event);
    console.debug('[CheckoutLab]', eventType, data);
  }

  // ========== TEST APPLICATIONS ==========

  function applyTest(test) {
    const variant = getAssignedVariant(test.id);
    const variantConfig = test.variants?.find(v => v.key === variant);
    
    if (!variantConfig) return;

    // Track test applied
    trackEvent('test_applied', {
      test_id: test.id,
      test_name: test.name,
      variant: variant,
      test_type: test.type
    });

    // Apply based on type
    const appliers = {
      bundle_selector: applyBundleSelector,
      upsell: applyUpsell,
      checkout_button: applyCheckoutButton,
      shipping_message: applyShippingMessage
    };

    if (appliers[test.type]) {
      appliers[test.type](variantConfig.config, test);
    }
  }

  function applyBundleSelector(config, test) {
    if (!config?.enabled) return;
    
    const observer = new MutationObserver((mutations, obs) => {
      const productForm = document.querySelector('form[action*="/cart/add"], form[action*="/cart"][method="post"]');
      if (productForm && !productForm.dataset.clabBundle) {
        productForm.dataset.clabBundle = 'true';
        
        const bundleHtml = `
          <div class="clab-bundle-selector" data-test="${test.id}" style="margin: 16px 0; padding: 16px; 
               background: ${config.bgColor || '#f3f4f6'}; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="font-weight: 600; margin-bottom: 12px; color: #111827;">${config.title || 'Bundle & Save'}</p>
            ${(config.options || []).map((opt, i) => `
              <label style="display: flex; align-items: center; gap: 8px; margin: 8px 0; cursor: pointer; padding: 8px; 
                     border-radius: 6px; transition: background 0.2s;" 
                     onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='transparent'">
                <input type="radio" name="clab_bundle_${test.id}" value="${i}" ${i === 0 ? 'checked' : ''} 
                       data-discount="${opt.discount}" data-quantity="${opt.quantity}"
                       style="width: 16px; height: 16px; accent-color: #3b82f6;">
                <span style="flex: 1; color: #374151;">${opt.label}</span>
                <span style="color: #059669; font-weight: 500;">${opt.discount}% off</span>
              </label>
            `).join('')}
          </div>
        `;
        
        productForm.insertAdjacentHTML('afterbegin', bundleHtml);
        
        // Track selections
        productForm.querySelectorAll(`input[name="clab_bundle_${test.id}"]`).forEach(radio => {
          radio.addEventListener('change', (e) => {
            trackEvent('bundle_selected', {
              test_id: test.id,
              bundle_index: e.target.value,
              discount: e.target.dataset.discount,
              quantity: e.target.dataset.quantity
            });
          });
        });
        
        obs.disconnect();
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function applyUpsell(config, test) {
    if (!config?.enabled) return;
    
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('button[type="submit"], input[type="submit"], [name="add"]');
      if (addBtn) {
        const form = addBtn.closest('form');
        if (form && (form.action?.includes('/cart/add') || form.getAttribute('action')?.includes('/cart/add'))) {
          setTimeout(() => {
            trackEvent('upsell_shown', {
              test_id: test.id,
              upsell_product: config.product_id,
              upsell_price: config.price
            });
          }, 100);
        }
      }
    }, true);
  }

  function applyCheckoutButton(config, test) {
    if (!config?.text) return;
    
    const observer = new MutationObserver((mutations, obs) => {
      const buttons = document.querySelectorAll('button[name="checkout"], input[name="checkout"], [href*="/checkout"]');
      let modified = false;
      
      buttons.forEach(btn => {
        if (!btn.dataset.clabModified) {
          btn.dataset.clabModified = 'true';
          btn.dataset.clabTest = test.id;
          const originalText = btn.textContent || btn.value || '';
          btn.textContent = config.text;
          if (btn.value !== undefined) btn.value = config.text;
          
          trackEvent('checkout_button_modified', {
            test_id: test.id,
            original_text: originalText,
            new_text: config.text
          });
          modified = true;
        }
      });
      
      if (modified) obs.disconnect();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function applyShippingMessage(config, test) {
    if (!config?.message) return;
    
    const observer = new MutationObserver((mutations, obs) => {
      const cartForm = document.querySelector('form[action*="/cart"], .cart, [data-cart]');
      if (cartForm && !cartForm.querySelector('.clab-shipping-message')) {
        const messageHtml = `
          <div class="clab-shipping-message" data-test="${test.id}" style="padding: 12px 16px; margin: 12px 0; 
                  background: ${config.bgColor || '#dcfce7'}; color: ${config.textColor || '#166534'}; 
                  border-radius: 8px; text-align: center; font-weight: 500; font-size: 14px;">
            ${config.message}
          </div>
        `;
        
        cartForm.insertAdjacentHTML('beforeend', messageHtml);
        obs.disconnect();
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ========== REVENUE TRACKING ==========

  function trackRevenue() {
    // Check for Shopify checkout object
    if (window.Shopify?.checkout?.order_id) {
      const checkout = window.Shopify.checkout;
      trackEvent('purchase', {
        order_id: checkout.order_id,
        revenue: parseFloat(checkout.total_price) || 0,
        subtotal: parseFloat(checkout.subtotal_price) || 0,
        currency: checkout.currency || 'USD',
        items: checkout.line_items?.length || 0
      });
    }
    
    // Alternative: Check URL for thank you page
    if (window.location.pathname.includes('/checkout/thank_you') || 
        window.location.search.includes('order_id')) {
      const orderId = new URLSearchParams(window.location.search).get('order_id');
      if (orderId) {
        trackEvent('purchase', {
          order_id: orderId,
          url: window.location.href
        });
      }
    }
  }

  // ========== INITIALIZATION ==========

  function initTracking() {
    if (!ConsentManager.hasConsent()) return;

    // Track page view
    trackEvent('page_view', {
      page_type: window.location.pathname.includes('/products') ? 'product' :
                 window.location.pathname.includes('/cart') ? 'cart' :
                 window.location.pathname.includes('/checkout') ? 'checkout' : 'other',
      title: document.title
    });

    // Track add to cart
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[name="add"], .add-to-cart, [data-add-to-cart], button[type="submit"]');
      if (addBtn) {
        const form = addBtn.closest('form');
        if (form && (form.action?.includes('/cart/add') || form.getAttribute('action')?.includes('/cart/add'))) {
          trackEvent('add_to_cart');
        }
      }
    }, true);

    // Track checkout start
    document.addEventListener('click', (e) => {
      const checkoutBtn = e.target.closest('[name="checkout"], [href*="/checkout"]');
      if (checkoutBtn) {
        trackEvent('checkout_started');
      }
    }, true);

    // Apply active tests
    const tests = CONFIG.tests || [];
    tests.filter(t => t.status === 'running').forEach(applyTest);

    // Track revenue
    trackRevenue();

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      flushQueue();
    });

    // Periodic flush (every 10 seconds)
    setInterval(flushQueue, 10000);

    console.log('[CheckoutLab] Tracking initialized');
  }

  // ========== PUBLIC API ==========

  window.CheckoutLab = {
    consent: function(action) {
      if (action === 'accept') {
        setStorage(CONSENT_KEY, true, 365);
        initTracking();
      } else if (action === 'decline') {
        setStorage(CONSENT_KEY, false, 365);
      }
    },
    
    track: function(eventType, data) {
      trackEvent(eventType, data);
    },

    flush: function() {
      flushQueue();
    },

    getVariant: function(testId) {
      return getAssignedVariant(testId);
    }
  };

  // ========== START ==========

  function init() {
    // Check for consent
    const hasConsent = ConsentManager.requestConsent();
    
    if (hasConsent) {
      initTracking();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
