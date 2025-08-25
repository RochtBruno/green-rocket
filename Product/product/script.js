(async function initProductPage() {
  const pageEl = document.getElementById('product-page');
  if (!pageEl) return;

  const qs = new URLSearchParams(window.location.search);
  const requestedProductId = qs.get('id');
  const requestedVarId = qs.get('var') || qs.get('variant');

  // Carrega JSON
  let data;
  try {
    const resp = await fetch('./product-data.json', { cache: 'no-cache' });
    data = await resp.json();
  } catch (e) {
    console.error('Failed to load product-data.json', e);
    return;
  }

  const products = Array.isArray(data.products) ? data.products : [];
  const product =
    products.find(p => p.id === requestedProductId) ||
    products.find(p => p.id === data.defaultId) ||
    products[0];

  if (!product) return;

  // DOM refs
  const titleEl = document.getElementById('product-title');
  const subEl = document.getElementById('product-subtitle');
  const priceEl = document.getElementById('product-price');
  const infoLinkEl = document.getElementById('info-link');
  const contactBtnEl = document.getElementById('contact-button');
  const mainImageEl = document.getElementById('main-image');
  const variationsEl = document.getElementById('variations');
  const sideInfoEl = document.getElementById('side-info');

  // Helpers
  const formatPrice = (value, currency = '$') => `${currency} ${Number(value ?? 0).toFixed(2)}`;
  const setMainImage = (url) => {
    if (!mainImageEl) return;
    mainImageEl.style.backgroundImage = url ? `url("${url}")` : '';
    mainImageEl.style.backgroundSize = 'cover';
    mainImageEl.style.backgroundPosition = 'center';
  };

  const getVariantThumb = (v) => v?.thumb || (Array.isArray(v?.images) && v.images[0]) || '';

  // Suporte a novo modelo (variações com dados) e legado
  const hasRichVariations =
    Array.isArray(product.variations) &&
    product.variations.length &&
    (product.variations[0].images || product.variations[0].thumb);

  // Estado atual
  let currentVariant = null;

  function renderInfoSections(sections = []) {
    if (!sideInfoEl) return;
    const header = sideInfoEl.querySelector('.info-header');
    sideInfoEl.innerHTML = '';
    if (header) sideInfoEl.appendChild(header);

    sections.forEach(sec => {
      const h4 = document.createElement('h4');
      h4.textContent = sec.title || '';

      const sub = document.createElement('p');
      sub.className = 'subtitle';
      sub.textContent = sec.subtitle || '';

      const desc = document.createElement('p');
      desc.className = 'description';
      desc.textContent = sec.description || '';

      sideInfoEl.append(h4, sub, desc);
    });

    const contact = document.createElement('a');
    contact.className = 'contact-button';
    contact.href = (currentVariant && currentVariant.contactUrl) || product.contactUrl || '../../Contact/contact.html';
    contact.textContent = 'Contact us';
    sideInfoEl.appendChild(contact);
  }

  function applyVariant(variant) {
    currentVariant = variant;

    // Atualiza URL (sem recarregar)
    const params = new URLSearchParams(window.location.search);
    params.set('id', product.id);
    if (variant?.id) params.set('var', variant.id);
    history.replaceState(null, '', `${location.pathname}?${params.toString()}`);

    // Título/sub/preço
    if (titleEl) titleEl.textContent = variant.title || product.title || product.groupTitle || '';
    if (subEl) subEl.textContent = variant.subtitle || product.subtitle || '';
    if (priceEl) priceEl.textContent = formatPrice(variant.price ?? product.price, variant.currency ?? product.currency);

    if (infoLinkEl) infoLinkEl.href = variant.infoLink || product.infoLink || '#';
    if (contactBtnEl) contactBtnEl.href = variant.contactUrl || product.contactUrl || '../../Contact/contact.html';

    // Define a imagem principal da variação ativa
    const gallery = Array.isArray(variant.images) && variant.images.length
      ? variant.images
      : (Array.isArray(product.images) ? product.images : [product.mainImage].filter(Boolean));
    setMainImage(gallery[0] || getVariantThumb(variant) || '');

    // Infos
    renderInfoSections(variant.infoSections || product.infoSections || []);

    // Título da aba
    document.title = `Green Rocket - ${variant.title || product.title || product.groupTitle || ''}`;

    // Atualiza o marcador ativo nas variações
    if (variationsEl) {
      variationsEl.querySelectorAll('.variation-box').forEach(b => {
        b.classList.toggle('active', b.dataset.varId === variant.id);
      });
    }
  }

  function renderVariationSelectors() {
    if (!variationsEl) return;

    const label = document.createElement('span');
    label.textContent = 'Variations';

    // limpa e mantém label
    variationsEl.innerHTML = '';
    variationsEl.appendChild(label);

    const list = hasRichVariations ? product.variations : [];
    list.forEach((v) => {
      const box = document.createElement('div');
      box.className = 'variation-box';
      box.title = v.title || v.name || '';
      box.dataset.varId = v.id || '';
      const bg = getVariantThumb(v);
      if (bg) box.style.backgroundImage = `url("${bg}")`;

      box.addEventListener('click', () => {
        applyVariant(v); // ao clicar, troca tudo e define main-image
      });

      if (currentVariant && currentVariant.id === v.id) {
        box.classList.add('active');
      }

      variationsEl.appendChild(box);
    });
  }

  // Inicialização
  if (hasRichVariations) {
    const defaultVarId = requestedVarId || product.defaultVariationId || product.variations[0].id;
    const initial = product.variations.find(v => v.id === defaultVarId) || product.variations[0];
    applyVariant(initial);
    renderVariationSelectors();
  } else {
    // Legado: sem variações ricas -> usa campos no nível do produto
    const images = Array.isArray(product.images) && product.images.length
      ? product.images
      : [product.mainImage].filter(Boolean);

    if (titleEl) titleEl.textContent = product.title || product.groupTitle || '';
    if (subEl) subEl.textContent = product.subtitle || '';
    if (priceEl) priceEl.textContent = formatPrice(product.price, product.currency);
    if (infoLinkEl && product.infoLink) infoLinkEl.href = product.infoLink;
    if (contactBtnEl && product.contactUrl) contactBtnEl.href = product.contactUrl;

    setMainImage(images[0] || '');
    renderInfoSections(product.infoSections || []);
    document.title = `Green Rocket - ${product.title || product.groupTitle || ''}`;
  }
})();