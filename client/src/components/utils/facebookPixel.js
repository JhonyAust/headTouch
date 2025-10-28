// Facebook Pixel tracking utility - FACEBOOK PIXEL ONLY

// Track page views
export const trackPageView = () => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track custom events
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.fbq) {
    window.fbq('track', eventName, eventParams);
  }
};

// Track ViewContent (when user views a product)
export const trackViewContent = (product) => {
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: product.title || product.name,
      content_ids: [product._id || product.id],
      content_type: 'product',
      value: product.price || product.salePrice,
      currency: 'USD',
    });
  }
};

// Track AddToCart
export const trackAddToCart = (product, quantity = 1) => {
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: product.title || product.name,
      content_ids: [product._id || product.id],
      content_type: 'product',
      value: product.price || product.salePrice,
      currency: 'USD',
      quantity: quantity,
    });
  }
};

// Track AddToWishlist
export const trackAddToWishlist = (product) => {
  if (window.fbq) {
    window.fbq('track', 'AddToWishlist', {
      content_name: product.title || product.name,
      content_ids: [product._id || product.id],
      content_type: 'product',
      value: product.price || product.salePrice,
      currency: 'USD',
    });
  }
};

// Track InitiateCheckout
export const trackInitiateCheckout = (cartItems, totalValue) => {
  if (window.fbq && Array.isArray(cartItems) && cartItems.length > 0) {
    const contentIds = cartItems.map(item => item.productId || item._id || item.id);
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: cartItems.length,
    });
  }
};

// Track AddPaymentInfo
export const trackAddPaymentInfo = (totalValue) => {
  if (window.fbq) {
    window.fbq('track', 'AddPaymentInfo', {
      value: totalValue,
      currency: 'USD',
    });
  }
};

// Track Purchase (most important for conversion tracking)
export const trackPurchase = (orderData) => {
  if (window.fbq && orderData) {
    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const contentIds = items.map(item => item.productId || item._id || item.id).filter(Boolean);
    
    window.fbq('track', 'Purchase', {
      value: orderData.totalAmount || orderData.total || 0,
      currency: 'BDT',
      content_ids: contentIds,
      content_type: 'product',
      num_items: items.length,
    });
  }
};

// Track Search
export const trackSearch = (searchQuery) => {
  if (window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchQuery,
    });
  }
};

// Track Registration
export const trackCompleteRegistration = () => {
  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration');
  }
};

// Track Lead 
export const trackLead = () => {
  if (window.fbq) {
    window.fbq('track', 'Lead');
  }
};