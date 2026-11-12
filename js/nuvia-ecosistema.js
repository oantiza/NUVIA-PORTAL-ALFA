// Navegación del ecosistema. Sin telemetría, persistencia ni APIs.
{
  // Las anclas publicadas siguen sirviendo tras cambiar la composición de las
  // portadas. Solo se actúa en las nuevas homes; los motores interiores conservan
  // sus propios fragmentos, parámetros e historial.
  const originalRoot = new URL('../', document.currentScript.src);
  const homeAnchors = {
    economia: {
      'economia-title': '#ec-title',
      'economia-informes': '#informes',
      'recursos-economia': '#recursos',
      'titulo-recursos-economia': '#recursos'
    },
    patrimonio: {
      'patrimonio-title': '.pa-opening h1',
      'patrimonio-concepto': '.pa-areas-intro',
      'patrimonio-ambitos': '#recursos',
      'recursos-patrimonio': '#recursos',
      'titulo-recursos-patrimonio': '#recursos'
    },
    bienestar: {
      'bienestar-title': '#bi-title',
      'bienestar-concepto': '.bi-opening-description',
      'pilares-bienestar': '#recursos',
      'titulo-pilares-bienestar': '#recursos'
    },
    academia: {
      academy: '#ac-title',
      'academy-title': '#ac-title',
      'recursos-academia': '#recursos'
    }
  };
  const hubAnchors = {
    inicio: '#contenido',
    espacios: '#webs',
    mercados: '.hub-door--economia',
    'titulo-mercados': '.hub-door--economia',
    patrimonio: '.hub-door--patrimonio',
    'titulo-patrimonio': '.hub-door--patrimonio',
    'familia-salud': '.hub-door--bienestar',
    'titulo-familia-salud': '.hub-door--bienestar',
    academia: '.hub-door--academia',
    'titulo-academia': '.hub-door--academia',
    'lecturas-con-criterio': '.hub-connections a[href$="lecturas.html"]'
  };
  const restoreLegacyAnchor = () => {
    let fragment;
    try { fragment = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    if (!fragment) return;
    const hub = document.body.classList.contains('hub-page');
    if (hub && ['que-es-nuvia', 'titulo-proyecto'].includes(fragment)) {
      const destination = new URL('que-es-nuvia.html', originalRoot);
      destination.search = window.location.search;
      window.location.replace(destination.href);
      return;
    }
    const home = Object.keys(homeAnchors).find(key => document.body.classList.contains(`web-page--${key}`));
    // El fragmento no viaja al servidor. Las dos rutas de aprendizaje históricas
    // y el glosario siguen abriendo las vistas originales, también en hashchange.
    if (home === 'academia') {
      const legacyTabs = { 'ruta-aprendizaje': 'inicio', 'ruta-aprendizaje-titulo': 'inicio', glosario: 'glosario' };
      const tab = Object.hasOwn(legacyTabs, fragment) ? legacyTabs[fragment] : null;
      if (tab && !new URLSearchParams(window.location.search).has('tab')) {
        const destination = new URL('academia.html', originalRoot);
        destination.search = window.location.search;
        destination.searchParams.set('tab', tab);
        destination.hash = window.location.hash;
        window.location.replace(destination.href);
        return;
      }
    }
    const anchors = hub ? hubAnchors : homeAnchors[home];
    const target = anchors && Object.hasOwn(anchors, fragment) ? anchors[fragment] : null;
    if (target) document.querySelector(target)?.scrollIntoView({ block: 'start' });
  };
  requestAnimationFrame(restoreLegacyAnchor);
  window.addEventListener('hashchange', () => requestAnimationFrame(restoreLegacyAnchor));
  document.addEventListener('keydown', (event) => {
    const selector = document.querySelector('.eco-switch');
    if (event.key === 'Escape' && selector?.open) {
      selector.open = false;
      selector.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', (event) => {
    const selector = document.querySelector('.eco-switch');
    if (selector && !selector.contains(event.target)) selector.open = false;
  });
  // Refleja las vistas que el motor original cambia sin recargar el documento.
  if (document.body.dataset.ecoTheme) {
    const syncNavigation = () => {
      const current = new URL(window.location.href);
      const page = current.pathname.split('/').pop();
      const parentPages = {
        'guia-fiscal.html': 'jubilacion.html', 'guia-planificacion.html': 'jubilacion.html',
        'guia-ahorro.html': 'fiscalidad.html', 'guia-calendario.html': 'fiscalidad.html', 'guia-sucesiones.html': 'fiscalidad.html',
        'la-respiracion-como-el-escultor-del-cerebro.html': 'respiracion-relajacion.html', 'que-es-meditar.html': 'respiracion-relajacion.html',
        'curso.html': 'academia.html?tab=cursos'
      };
      const section = new URL(parentPages[page] || current.href, current);
      if (page === 'mercados.html') {
        const selected = document.querySelector('.markets-viewnav button:is([aria-current="page"],[aria-pressed="true"],.is-active)');
        const reports = selected ? selected.textContent.trim() === 'Informes' : section.searchParams.get('vista') === 'informes';
        if (reports) section.searchParams.set('vista', 'informes');
        else section.searchParams.delete('vista');
      }
      if (page === 'academia.html') {
        const tab = section.searchParams.get('tab');
        if (['fundamentos', 'activos', 'pib'].includes(tab)) section.searchParams.set('tab', 'esenciales');
        if (tab === 'interes') section.searchParams.set('tab', 'calculadora');
        if (tab === 'inicio') section.searchParams.delete('tab');
        if (tab === 'portada') section.searchParams.delete('tab');
      }
      if (page === 'cartera.html') {
        const view = section.searchParams.get('vista');
        if (['technical', 'fundamental'].includes(view)) section.searchParams.set('vista', 'companies');
        if (['portfolio', 'models'].includes(view)) section.searchParams.delete('vista');
      }
      for (const link of document.querySelectorAll('.web-local a')) {
        const destination = new URL(link.href);
        let active = section.pathname === destination.pathname;
        const key = section.pathname.endsWith('/academia.html') ? 'tab' : section.pathname.endsWith('/temas.html') ? 'topic' : 'vista';
        if (active) active = (section.searchParams.get(key) || '') === (destination.searchParams.get(key) || '');
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
      // La marca y el selector describen la página, no el apartado padre.
      // Se recalculan al cambiar de vista para no anunciar «Portada» en una
      // calculadora abierta por el controlador sin recargar el HTML estático.
      const locationKey = url => {
        const copy = new URL(url);
        for (const key of [...copy.searchParams.keys()]) if (!['tab', 'vista', 'topic'].includes(key)) copy.searchParams.delete(key);
        if (copy.pathname.endsWith('/academia.html') && copy.searchParams.get('tab') === 'portada') copy.searchParams.delete('tab');
        copy.searchParams.sort();
        return copy.pathname + copy.search;
      };
      for (const link of document.querySelectorAll('.web-header-row a, .web-footer a')) {
        if (locationKey(link.href) === locationKey(current)) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
    };
    new MutationObserver(syncNavigation).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('popstate', syncNavigation);
    document.addEventListener('click', () => requestAnimationFrame(syncNavigation));
    syncNavigation();
  }
}
