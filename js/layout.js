/* ============================================================
   RENA FARM — Shared Layout Injection
   Injects header, footer, floating buttons across all pages.
   ============================================================ */
(function () {

  /* ── SVG ASSETS ── */
  const SVG_WHATSAPP = `<svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`;

  const SVG_TIKTOK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.28 8.28 0 0 0 4.84 1.55V6.85a4.86 4.86 0 0 1-1.07-.16z"/></svg>`;

  const SVG_INSTAGRAM = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

  const SVG_FACEBOOK = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;

  const SVG_WHATSAPP_SM = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`;

  /* ── HEADER HTML ── */
  const HEADER_HTML = `
<header id="site-header">
  <nav class="container">
    <button class="rf-menu-btn" id="rfMenuBtn" aria-label="Open menu" aria-expanded="false">
      <div class="rf-menu-lines"><span></span><span></span></div>
      <span class="rf-menu-label" id="rfMenuLabel">Menu</span>
    </button>
    <a href="index.html" class="nav-brand">
      <img src="img/logo-wordmark.png" class="nav-logo-img" alt="Rena Farm"/>
    </a>
    <div class="rf-nav-right">
      <div class="rf-nav-icons">
        <a href="https://wa.me/254724980372" target="_blank" rel="noopener" class="rf-nav-wa" aria-label="WhatsApp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        </a>
        <div class="nav-account-wrap" id="accountWrap">
          <button class="nav-account-btn" id="accountBtn" aria-label="Account menu">
            <svg id="accountIcon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <span id="accountInitial" style="display:none;"></span>
          </button>
          <div class="nav-account-dropdown" id="accountDropdown"></div>
        </div>
      </div>
    </div>
  </nav>
</header>

<!-- ── MENU BACKDROP ── -->
<div id="rfMenuBackdrop" class="rf-menu-backdrop"></div>

<!-- ── NAV OVERLAY — floats from navbar position ── -->
<div class="rf-nav-overlay" id="rfNavOverlay" aria-hidden="true">
  <div class="rf-overlay-top-bar">
    <button class="rf-overlay-close" id="rfOverlayClose" aria-label="Close menu">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      <span>Close</span>
    </button>
  </div>
  <div class="rf-overlay-inner">

    <!-- Left: navigation -->
    <nav class="rf-overlay-nav" id="rfOverlayLinks">

      <div class="rf-ol-group">
        <div class="rf-ol-label">Navigate</div>
        <a href="index.html" data-page="index.html">Home</a>
        <a href="about.html" data-page="about.html">About</a>
        <a href="products.html" data-page="products.html" class="rf-ol-has-sub" id="rfProductsLink">Products <svg class="rf-ol-sub-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>
        <a href="livestock.html" data-page="livestock.html">Livestock</a>
        <a href="fodder.html" data-page="fodder.html">Fodder &amp; Feeds</a>
        <a href="gallery.html" data-page="gallery.html">Gallery</a>
      </div>

      <div class="rf-ol-actions">
        <a href="contact.html" class="rf-ol-action-btn" data-page="contact.html">Contact Us</a>
        <a href="location.html" class="rf-ol-action-btn">Locate Us</a>
      </div>

      <a href="login.html" class="rf-ol-signin" id="rfOverlaySignin">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        Sign In
      </a>
    </nav>

    <!-- Products sub-nav (slides in beside main links) -->
    <div class="rf-overlay-sub" id="rfOverlaySub">
      <div class="rf-overlay-sub-inner">
        <div class="rf-ol-label">Products</div>
        <a href="livestock.html" data-page="livestock.html">Cattle</a>
        <a href="livestock.html#sheep">Dorper Sheep</a>
        <a href="livestock.html#goats">Gala Goats</a>
        <a href="fodder.html" data-page="fodder.html">Fodder &amp; Feeds</a>
        <a href="products.html#dairy">Dairy</a>
        <a href="products.html#poultry">Poultry</a>
        <a href="products.html" class="rf-sub-view-all" data-page="products.html">All Products &rarr;</a>
      </div>
    </div>

    <!-- Right: scrollable image cards -->
    <div class="rf-overlay-cards">
      <a href="livestock.html" class="rf-ol-card">
        <img src="https://mykyvloynpiqzmqvwekv.supabase.co/storage/v1/object/public/website-media/beef-cattle/beef-cattle-01.jpg" alt="Cattle at Rena Farm" loading="lazy"/>
        <div class="rf-ol-card-label">Cattle</div>
      </a>
      <a href="livestock.html#sheep" class="rf-ol-card">
        <img src="https://mykyvloynpiqzmqvwekv.supabase.co/storage/v1/object/public/website-media/doper-rams/dorper-ram-57.jpg" alt="Dorper rams at Rena Farm" loading="lazy"/>
        <div class="rf-ol-card-label">Dorpers</div>
      </a>
      <a href="livestock.html#goats" class="rf-ol-card">
        <img src="https://mykyvloynpiqzmqvwekv.supabase.co/storage/v1/object/public/website-media/gala-boars/gala-buck-03.jpg" alt="Gala goats at Rena Farm" loading="lazy" style="object-position: center top;"/>
        <div class="rf-ol-card-label">Goats</div>
      </a>
      <a href="fodder.html" class="rf-ol-card">
        <img src="https://mykyvloynpiqzmqvwekv.supabase.co/storage/v1/object/public/website-media/cultivation/fodder-corn.jpg" alt="Maize plantation at Rena Farm" loading="lazy"/>
        <div class="rf-ol-card-label">Fodder &amp; Feeds</div>
      </a>
    </div>

  </div>
</div>`;

  /* ── FOOTER HTML ── */
  const FOOTER_HTML = `
<footer id="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand-col">
        <img src="img/logo-wordmark.png" class="footer-logo-img" alt="Rena Farm"/>
        <div class="footer-brand-sub">Rena Global Merchants Ltd</div>
        <p class="footer-desc">Cultivating Sustainability, Enriching Lives through Farming &mdash; Kajiado Central, Kenya. Est. 2018.</p>
        <div class="footer-follow-label">Follow Us</div>
        <div class="footer-socials">
          <a href="https://www.tiktok.com/@the.renafarm" target="_blank" rel="noopener" class="social-icon-btn" title="TikTok">${SVG_TIKTOK}</a>
          <a href="https://www.instagram.com/the.renafarm" target="_blank" rel="noopener" class="social-icon-btn" title="Instagram">${SVG_INSTAGRAM}</a>
          <a href="#" class="social-icon-btn" title="Facebook">${SVG_FACEBOOK}</a>
          <a href="https://wa.me/254724980372" target="_blank" rel="noopener" class="social-icon-btn" title="WhatsApp">${SVG_WHATSAPP_SM}</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <ul>
          <li><a href="livestock.html">Cattle</a></li>
          <li><a href="livestock.html#sheep">Dorper Sheep</a></li>
          <li><a href="livestock.html#goats">Gala Goats</a></li>
          <li><a href="fodder.html">Fodder &amp; Feeds</a></li>
          <li><a href="products.html#dairy">Dairy &mdash; Milk</a></li>
          <li><a href="products.html#poultry">Poultry</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="how-to-buy.html">How to Buy</a></li>
          <li><a href="events.html">Events &amp; EXPOs</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="location.html">Location</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:+254724980372">+254 724 980 372</a></li>
          <li><a href="tel:+254715438010">+254 715 438 010</a></li>
          <li><a href="mailto:therenafarm@gmail.com">therenafarm@gmail.com</a></li>
          <li><a href="mailto:info@renafarm.com">info@renafarm.com</a></li>
          <li><a href="location.html">Kajiado Central, Kenya</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2025 Rena Global Merchants Ltd. All rights reserved.</span>
      <span>Rena Farm &mdash; Kajiado Central, Kenya</span>
    </div>
  </div>
</footer>

<button class="back-to-top" id="rfBackTop" title="Back to top" aria-label="Back to top">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>
</button>

<nav class="mob-pill-nav" id="mobPillNav" aria-label="Site navigation">
  <a href="index.html" class="mob-pill-item" data-page="index.html">
    <i class="ph ph-house-simple"></i><span>Home</span>
  </a>
  <a href="about.html" class="mob-pill-item" data-page="about.html">
    <i class="ph ph-info"></i><span>About</span>
  </a>
  <a href="products.html" class="mob-pill-item" data-page="products.html" id="mobPillProducts">
    <i class="ph ph-storefront"></i><span>Products</span>
  </a>
  <a href="gallery.html" class="mob-pill-item" data-page="gallery.html">
    <i class="ph ph-images"></i><span>Gallery</span>
  </a>
  <a href="contact.html" class="mob-pill-item" data-page="contact.html">
    <i class="ph ph-phone"></i><span>Contact</span>
  </a>
  <button class="mob-pill-item" id="mobPillAccount">
    <i class="ph ph-user-circle"></i><span>Account</span>
  </button>
</nav>

<div class="mob-sub-panel" id="mobProductsPanel">
  <a href="products.html" class="mob-sub-item"><i class="ph ph-squares-four"></i><span>All</span></a>
  <a href="livestock.html" class="mob-sub-item"><i class="ph ph-cow"></i><span>Livestock</span></a>
  <a href="fodder.html" class="mob-sub-item"><i class="ph ph-leaf"></i><span>Fodder</span></a>
  <a href="products.html#dairy" class="mob-sub-item"><i class="ph ph-drop-half"></i><span>Dairy</span></a>
  <a href="products.html#poultry" class="mob-sub-item"><i class="ph ph-bird"></i><span>Poultry</span></a>
</div>

<div class="mob-sub-panel mob-sub-panel--list" id="mobAccountPanel"></div>`;

  /* ── INJECT HEADER ── */
  const headerSlot = document.getElementById('rf-header');
  if (headerSlot) headerSlot.outerHTML = HEADER_HTML;

  /* ── INJECT FOOTER ── */
  const footerSlot = document.getElementById('rf-footer');
  if (footerSlot) footerSlot.outerHTML = FOOTER_HTML;

  /* ── SET ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) link.classList.add('active');
  });
  const productPages = ['livestock.html', 'fodder.html', 'products.html', 'how-to-buy.html', 'enquire.html'];

  /* ── PILL NAV: active state ── */
  document.querySelectorAll('#mobPillNav .mob-pill-item[data-page]').forEach(item => {
    if (item.getAttribute('data-page') === currentPage) item.classList.add('active');
  });
  if (productPages.includes(currentPage)) {
    document.querySelector('#mobPillNav .mob-pill-item[data-page="products.html"]')?.classList.add('active');
  }

  /* ── MENU OVERLAY TOGGLE ── */
  const menuBtn   = document.getElementById('rfMenuBtn');
  const menuLabel = document.getElementById('rfMenuLabel');
  const overlay   = document.getElementById('rfNavOverlay');
  let overlayOpen = false;

  const siteHeaderEl  = document.getElementById('site-header');
  const backdrop      = document.getElementById('rfMenuBackdrop');
  const productsLink  = document.getElementById('rfProductsLink');
  const overlaySub    = document.getElementById('rfOverlaySub');

  function openOverlay() {
    overlayOpen = true;
    overlay?.classList.add('open');
    overlay?.setAttribute('aria-hidden', 'false');
    menuBtn?.classList.add('open');
    menuBtn?.setAttribute('aria-expanded', 'true');
    if (menuLabel) menuLabel.textContent = 'Close';
    siteHeaderEl?.classList.add('nav-hidden');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay() {
    overlayOpen = false;
    overlay?.classList.remove('open');
    overlay?.setAttribute('aria-hidden', 'true');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    if (menuLabel) menuLabel.textContent = 'Menu';
    siteHeaderEl?.classList.remove('nav-hidden');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
    productsLink?.classList.remove('sub-open');
    overlaySub?.classList.remove('open');
  }

  menuBtn?.addEventListener('click', () => overlayOpen ? closeOverlay() : openOverlay());
  document.getElementById('rfOverlayClose')?.addEventListener('click', closeOverlay);
  backdrop?.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlayOpen) closeOverlay(); });

  /* ── PRODUCTS SUB-MENU TOGGLE ── */
  productsLink?.addEventListener('click', e => {
    e.preventDefault();
    const isOpen = productsLink.classList.contains('sub-open');
    productsLink.classList.toggle('sub-open', !isOpen);
    overlaySub?.classList.toggle('open', !isOpen);
  });

  /* ── MOBILE SUB-PANELS ── */
  const mobProductsPanel = document.getElementById('mobProductsPanel');
  const mobAccountPanel  = document.getElementById('mobAccountPanel');

  document.getElementById('mobPillProducts')?.addEventListener('click', e => {
    if (window.innerWidth > 1024) return;
    e.preventDefault();
    const opening = !mobProductsPanel.classList.contains('open');
    mobProductsPanel.classList.toggle('open');
    if (opening) mobAccountPanel?.classList.remove('open');
  });

  document.getElementById('mobPillAccount')?.addEventListener('click', e => {
    if (window.innerWidth > 1024) return;
    e.preventDefault();
    if (mobAccountPanel?.innerHTML.trim()) {
      const opening = !mobAccountPanel.classList.contains('open');
      mobAccountPanel.classList.toggle('open');
      if (opening) mobProductsPanel?.classList.remove('open');
    } else {
      window.location.href = `login.html?return=${encodeURIComponent(window.location.href)}`;
    }
  });

  /* Close sub-panels on outside tap */
  document.addEventListener('click', e => {
    if (!e.target.closest('#mobPillProducts') && !e.target.closest('#mobProductsPanel')) {
      mobProductsPanel?.classList.remove('open');
    }
    if (!e.target.closest('#mobPillAccount') && !e.target.closest('#mobAccountPanel')) {
      mobAccountPanel?.classList.remove('open');
    }
  });

  /* ── SCROLL: header shadow, back-to-top, pill hide/show ── */
  const siteHeader = document.getElementById('site-header');
  const backToTop  = document.getElementById('rfBackTop');
  const mobPill    = document.getElementById('mobPillNav');
  let lastScrollY  = window.scrollY;
  let pillHideTimer;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (siteHeader) siteHeader.classList.toggle('scrolled', currentY > 20);
    if (backToTop)  backToTop.classList.toggle('visible', currentY > 400);

    if (mobPill) {
      if (currentY > lastScrollY && currentY > 80) {
        mobPill.classList.add('pill-hidden');
        document.getElementById('mobProductsPanel')?.classList.remove('open');
        document.getElementById('mobAccountPanel')?.classList.remove('open');
      } else {
        mobPill.classList.remove('pill-hidden');
      }
    }
    lastScrollY = currentY;
  }, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── SCROLL-IN ANIMATIONS ── */
  const animStyle = document.createElement('style');
  animStyle.textContent = `.rf-anim-ready{opacity:0;transform:translateY(22px);transition:opacity .45s ease,transform .45s ease}.rf-anim-ready.animate-in{opacity:1!important;transform:translateY(0)!important}`;
  document.head.appendChild(animStyle);

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  setTimeout(() => {
    document.querySelectorAll(
      '.card, .feature-item, .value-card, .product-card, .team-card, ' +
      '.fodder-card, .livestock-hero-card, .step-card, .event-card, ' +
      '.why-card, .payment-card, .gallery-item, .award-card'
    ).forEach(el => {
      el.classList.add('rf-anim-ready');
      animObserver.observe(el);
    });
  }, 100);

  /* ── REVIEW CAROUSEL: clone cards inside same track for seamless loop ── */
  const reviewTrack = document.getElementById('reviewTrack');
  if (reviewTrack) {
    Array.from(reviewTrack.children).forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      reviewTrack.appendChild(clone);
    });
  }

  /* ── FAQ ACCORDION (how-to-buy page) ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── EVENTS PAGE TABS ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(panel)?.classList.add('active');
    });
  });

  /* ── GALLERY FILTER ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

})();

// ── Account nav dropdown ──
if (typeof db !== 'undefined') {
  db.auth.getSession().then(async ({ data: { session } }) => {
    const btn      = document.getElementById('accountBtn')
    const icon     = document.getElementById('accountIcon')
    const initial  = document.getElementById('accountInitial')
    const dropdown = document.getElementById('accountDropdown')
    if (!btn || !dropdown) return

    const returnUrl = encodeURIComponent(window.location.href)

    const mobPillAccount = document.getElementById('mobPillAccount')

    if (session) {
      // Logged in state — always show person icon, not initial
      btn.classList.add('logged-in')
      icon.style.display    = 'block'
      initial.style.display = 'none'

      // Get profile name
      let displayName = session.user.email ?? 'Client'
      try {
        const { data } = await db.from('client_profiles').select('full_name').eq('id', session.user.id).single()
        if (data?.full_name) displayName = data.full_name
      } catch(e) {}

      initial.textContent = displayName.charAt(0).toUpperCase()

      // Pill account: brighter icon when logged in + populate sub-panel
      const mobPillAccountBtn = document.getElementById('mobPillAccount')
      if (mobPillAccountBtn) {
        mobPillAccountBtn.querySelector('i').className = 'ph ph-user-circle-check'
        mobPillAccountBtn.style.color = 'rgba(255,255,255,0.8)'
      }
      const mobAccPanel = document.getElementById('mobAccountPanel')
      if (mobAccPanel) {
        mobAccPanel.innerHTML = `
          <div class="mob-sub-acct-header">
            <div class="mob-sub-acct-name">${displayName}</div>
            <div class="mob-sub-acct-email">${session.user.email ?? ''}</div>
          </div>
          <div class="mob-sub-divider"></div>
          <a href="portal.html" class="mob-sub-item"><i class="ph ph-squares-four"></i><span>Overview</span></a>
          <a href="portal.html?tab=enquiries" class="mob-sub-item"><i class="ph ph-chat-circle-dots"></i><span>My Enquiries</span></a>
          <a href="portal.html?tab=messages" class="mob-sub-item"><i class="ph ph-envelope-simple"></i><span>Messages</span></a>
          <a href="portal.html?tab=profile" class="mob-sub-item"><i class="ph ph-user"></i><span>My Profile</span></a>
          <div class="mob-sub-divider"></div>
          <button class="mob-sub-item mob-sub-signout" onclick="(async()=>{await db.auth.signOut();window.location.href='index.html'})()">
            <i class="ph ph-sign-out"></i><span>Sign Out</span>
          </button>`
      }

      // Update overlay sign-in → account link
      const overlaySignin = document.getElementById('rfOverlaySignin');
      if (overlaySignin) {
        overlaySignin.href = 'portal.html';
        overlaySignin.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> ${displayName.split(' ')[0]}`;
      }
      dropdown.innerHTML = `
        <div class="dd-header">
          <div class="dd-name">${displayName}</div>
          <div class="dd-email">${session.user.email ?? ''}</div>
        </div>
        <a href="portal.html"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Overview</a>
        <a href="portal.html?tab=enquiries"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> My Enquiries</a>
        <a href="portal.html?tab=messages"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Messages</a>
        <a href="portal.html?tab=profile"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> My Profile</a>
        <div class="dd-divider"></div>
        <button class="dd-item dd-signout" onclick="(async()=>{await db.auth.signOut();window.location.href='index.html'})()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>`

    } else {
      // Guest state
      btn.classList.remove('logged-in')
      icon.style.display    = 'block'
      initial.style.display = 'none'

      dropdown.innerHTML = `
        <div class="dd-header">
          <div class="dd-name">My Account</div>
          <div class="dd-email">Sign in to track your orders</div>
        </div>
        <a href="login.html?return=${returnUrl}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> Sign In</a>
        <a href="register.html?return=${returnUrl}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> Create Account</a>`
    }
  })

  // Click-toggle account dropdown
  const accountBtn  = document.getElementById('accountBtn')
  const accountWrap = document.getElementById('accountWrap')
  if (accountBtn && accountWrap) {
    accountBtn.addEventListener('click', e => {
      e.stopPropagation()
      accountWrap.classList.toggle('open')
    })
    // Close on outside click
    document.addEventListener('click', e => {
      if (!accountWrap.contains(e.target)) accountWrap.classList.remove('open')
    })
    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') accountWrap.classList.remove('open')
    })
  }

  // Handle tab param on portal
  if (window.location.pathname.includes('portal.html')) {
    const tab = new URLSearchParams(window.location.search).get('tab')
    if (tab) {
      setTimeout(() => {
        // Find the matching tab button (supports both old and new onclick formats)
        const tabs = ['overview', 'enquiries', 'messages', 'profile']
        const idx  = tabs.indexOf(tab)
        if (idx >= 0 && typeof switchTab === 'function') {
          const btn = document.querySelectorAll('.p-tab-btn')[idx] || null
          switchTab(tab, btn)
        }
      }, 600)
    }
  }
}
