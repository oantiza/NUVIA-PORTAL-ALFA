// El contenido se sirve en HTML. Este módulo solo cambia la edición y su antigüedad.
(() => {
  const inicializados = new WeakSet();
  const seleccionar = (lector, tipo) => {
    const ediciones = [...lector.querySelectorAll('[data-report-edition]')];
    const elegida = ediciones.find((el) => el.dataset.reportEdition === tipo) || ediciones[0];
    ediciones.forEach((el) => { if (el.hidden !== (el !== elegida)) el.hidden = el !== elegida; });
    lector.querySelectorAll('[data-report-select]').forEach((el) => {
      if (el.dataset.reportSelect === elegida?.dataset.reportEdition) {
        if (el.getAttribute('aria-current') !== 'true') el.setAttribute('aria-current', 'true');
      } else if (el.hasAttribute('aria-current')) el.removeAttribute('aria-current');
    });
  };
  const iniciar = () => {
    // Antes de este reemplazo se estaría alterando la plantilla que captura React.
    if (document.querySelector('x-dc')) return;
    document.querySelectorAll('[data-report-reader]').forEach((lector) => {
      seleccionar(lector, new URLSearchParams(location.search).get('tipo')?.toUpperCase());
      if (!inicializados.has(lector) && lector.getClientRects().length) {
        inicializados.add(lector);
        if (location.hash === '#lectura-informe') lector.querySelector('#lectura-informe')?.scrollIntoView({ block: 'start' });
      }
    });
    const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());
    document.querySelectorAll('[data-report-age]').forEach((el) => {
      const dias = Math.floor((Date.parse(`${hoy}T12:00:00Z`) - Date.parse(`${el.dataset.reportAge}T12:00:00Z`)) / 86400000);
      const texto = dias < 0 ? 'Edición fechada' : dias > (el.dataset.reportType === 'SEMANAL' ? 10 : 2) ? 'Edición de archivo' : 'Última edición';
      if (el.textContent !== texto) el.textContent = texto;
    });
  };
  document.addEventListener('click', (event) => {
    const enlace = event.target.closest('[data-report-select]');
    if (!enlace || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    seleccionar(enlace.closest('[data-report-reader]'), enlace.dataset.reportSelect);
    history.pushState(null, '', enlace.href);
  });
  window.addEventListener('popstate', () => {
    document.querySelectorAll('[data-report-reader]').forEach((lector) => seleccionar(lector,
      new URLSearchParams(location.search).get('tipo')?.toUpperCase()));
  });
  // support.js monta x-dc después de cargar; también puede volver a crear la vista.
  let pendiente = false;
  const observar = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => { pendiente = false; iniciar(); });
  };
  new MutationObserver(observar).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  window.addEventListener('load', iniciar, { once: true });
  iniciar();
})();
