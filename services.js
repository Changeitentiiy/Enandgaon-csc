(function () {
  const DEFAULT_NUMBER = '917988807962';

  async function fetchSiteConfig() {
    try {
      const response = await fetch('config.json', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Config fetch failed');
      }
      return await response.json();
    } catch (error) {
      console.warn('Using offline fallback for dynamic service buttons:', error);
      return null;
    }
  }

  function getWhatsAppLink(number, serviceTitle) {
    const message = `नमस्ते विष्णु जी, मुझे ${serviceTitle} सेवा चाहिए।`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function renderServiceCard(service, config) {
    const marketPrice = service.marketPrice ? `
      <span style="text-decoration: line-through; color: #dc2626;">बाजार: ₹${service.marketPrice}</span>
    ` : '';

    const priceBlock = service.price ? `
      <div class="srv-pricing">
        ${marketPrice}
        <span style="color: var(--green, #15803d); font-weight: 800;">हमारा चार्ज: ₹${service.price} मात्र</span>
      </div>
    ` : '';

    const iconClass = service.icon || 'fa-circle-check';
    const buttonText = service.buttonText || 'सहायता लें';

    return `
      <div class="srv-card">
        <div class="srv-icon"><i class="fa-solid ${iconClass}"></i></div>
        <h3>${service.title || ''}</h3>
        <p>${service.description || ''}</p>
        ${priceBlock}
        <a href="${getWhatsAppLink(config.whatsappNumber || DEFAULT_NUMBER, service.title || 'सेवा')}" class="srv-btn" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-whatsapp"></i> ${buttonText}
        </a>
      </div>
    `;
  }

  function renderServicesForPage(config, pageType) {
    if (!config || !config.services) return;

    const services = config.services[pageType] || [];
    const container = document.getElementById(`${pageType}Grid`) || document.querySelector(`[data-service-grid="${pageType}"]`);

    if (!container || !Array.isArray(services) || services.length === 0) return;

    container.innerHTML = services.map((service) => renderServiceCard(service, config)).join('');
  }

  function updateOperatorInfo(config) {
    if (!config) return;

    const operatorNameEls = document.querySelectorAll('[data-operator-name]');
    const operatorImageEls = document.querySelectorAll('[data-operator-image]');
    const operatorImgEls = document.querySelectorAll('.operator-img, .op-avatar-img');
    const phoneEls = document.querySelectorAll('[data-operator-phone]');

    operatorNameEls.forEach((el) => {
      el.textContent = config.operatorName || 'विष्णु कुमार';
    });

    operatorImageEls.forEach((img) => {
      img.src = config.operatorImage || 'operator.jpg';
    });

    operatorImgEls.forEach((img) => {
      img.src = config.operatorImage || 'operator.jpg';
      img.alt = config.operatorName || 'विष्णु कुमार';
    });

    phoneEls.forEach((el) => {
      const phoneValue = config.operatorPhone || '7988807962';
      el.href = `tel:${phoneValue}`;
      el.textContent = `+91 ${phoneValue}`;
    });
  }

  window.fetchSiteConfig = fetchSiteConfig;
  window.renderServicesForPage = renderServicesForPage;
  window.updateOperatorInfo = updateOperatorInfo;
  window.renderServiceCard = renderServiceCard;

  document.addEventListener('DOMContentLoaded', async function () {
    const pageType = document.body.dataset.pageType || 'home';
    const config = await fetchSiteConfig();

    if (config) {
      renderServicesForPage(config, pageType);
      updateOperatorInfo(config);
    }
  });
})();
