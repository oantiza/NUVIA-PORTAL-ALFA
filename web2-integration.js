(function () {
  'use strict';
  // NUVIA Portal Alfa — integración v2 (rediseño canónico).
  // La app antigua (core/) se eliminó el 21-08-2026 por encargo de Óscar: las
  // páginas rediseñadas son las únicas; de core/ solo quedan los PDF del curso.
  // En la portada hidrata la noticia del día y monta el ticker; en Mercados hidrata
  // los indicadores macroeconómicos y las noticias que acompañan a la destacada (hasta once) con la misma fuente de datos diaria,
  // manteniendo su cabecera, bordes y fundidos laterales. Sin red, queda el contenido estático.

  const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  if (page !== 'index.html' && page !== '' && page !== 'mercados.html') return;

  /* Los tres colores vivían aquí en crudo y no coincidían con los tokens: la
     flecha de «baja» era #a8c97a y --nv-trend-down es #72c99a, así que el
     indicador cambiaba de tono al hidratarse. Además llegaban por style.color,
     que gana a cualquier hoja. Ahora esto solo decide la clase; el color lo
     pone nuvia-pages.css, igual que en el HTML publicado. */
  const DIRECTION = {
    up: { symbol: '↗', clase: 'is-up' },
    down: { symbol: '↘', clase: 'is-down' },
    stable: { symbol: '→', clase: 'is-flat' },
  };
  const TENDENCIAS = ['is-up', 'is-down', 'is-flat'];
  const marcarTendencia = (elemento, clase) => {
    if (!elemento) return;
    elemento.classList.remove(...TENDENCIAS);
    elemento.classList.add(clase);
  };

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && typeof value === 'string') element.textContent = value;
  };

  const madridDateKey = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.valueOf())) return '';
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  };

  const readableAttempt = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) return '';
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(date).replace(/\./g, '');
  };

  const setNewsUpdateStatus = (state, message) => {
    const element = document.querySelector('[data-news-update-status]');
    if (!element) return;
    element.dataset.noticeState = state;
    element.textContent = `${message} Los textos explicativos son contexto temático automático; no resumen ni verifican los artículos enlazados.`;
  };

  const mountSecondaryNewsDialog = (newsItems) => {
    const dialog = document.getElementById('market-news-dialog');
    if (!dialog || dialog.dataset.mounted === 'true') return;

    const newsById = new Map(newsItems.map((item) => [item.id, item]));
    const dialogField = (field) => dialog.querySelector(`[data-news-dialog="${field}"]`);
    const openNews = (newsId) => {
      const newsItem = newsById.get(newsId);
      if (!newsItem) return;

      const image = dialogField('image');
      if (image) {
        image.src = newsItem.imageUrl || '';
        image.alt = newsItem.imageAlt || '';
      }
      ['category', 'date', 'title', 'summary', 'why'].forEach((field) => {
        const valueByField = {
          category: newsItem.category,
          date: newsItem.publishedAt,
          title: newsItem.title,
          summary: newsItem.summary,
          why: newsItem.whyItMatters,
        };
        const element = dialogField(field);
        if (element) element.textContent = valueByField[field] || '';
      });
      const dialogDate = dialogField('date');
      if (dialogDate) dialogDate.dateTime = newsItem.publishedAtIso || '';

      const body = dialogField('body');
      if (body) {
        body.replaceChildren();
        (Array.isArray(newsItem.body) ? newsItem.body : []).forEach((paragraph) => {
          const element = document.createElement('p');
          element.textContent = paragraph;
          body.appendChild(element);
        });
      }

      const sourceLink = dialogField('source-link');
      if (sourceLink) {
        sourceLink.href = newsItem.sourceUrl;
        sourceLink.setAttribute('aria-label', `Leer la noticia original en ${newsItem.sourceName}`);
      }
      const dialogSourceName = dialogField('source-name');
      if (dialogSourceName) dialogSourceName.textContent = `Leer en ${newsItem.sourceName}`;

      dialog.showModal();
    };

    // Cada tarjeta es entera pulsable: su botón (el titular) se extiende sobre
    // ella y el teclado lo activa como cualquier botón. Un solo oyente sirve
    // para todas, también para las que se crean después.
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest?.('[data-market-news-open]');
      if (trigger) openNews(trigger.dataset.marketNewsOpen);
    });
    dialog.querySelector('[data-news-dialog-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.dataset.mounted = 'true';
  };

  /* Noticias que acompañan a la destacada. Las dos primeras van junto a ella,
     con más presencia; el resto, en la rejilla a todo el ancho. Se crean desde
     los datos: sin datos no se muestra ningún titular inventado. Cada tema
     tiene un color de etiqueta de la paleta (azul, verde azulado, oliva). */
  const NEWS_TONES = {
    'Economía y mercados': 'mercados',
    'Tipos de interés y deuda': 'tipos',
    'Inflación y coste de vida': 'inflacion',
    'Vivienda y financiación': 'vivienda',
    'Empleo e ingresos': 'empleo',
  };
  const NEWS_ORDER = [
    'Economía y mercados',
    'Tipos de interés y deuda',
    'Inflación y coste de vida',
    'Empleo e ingresos',
    'Vivienda y financiación',
  ];
  const FEATURED_NEWS = 2;
  const FALLBACK_NEWS_IMAGE = 'src/assets/social/nuvia-social-source-generated-v1.png';

  const newsElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  };

  const buildNewsCard = (newsItem, variant) => {
    const card = newsElement('article', `markets-secondary-card markets-secondary-card--${variant}`);
    card.dataset.marketNewsId = newsItem.id;
    card.dataset.newsTone = NEWS_TONES[newsItem.category] || 'mercados';

    const media = newsElement('div', 'markets-secondary-card__media');
    const image = newsElement('img', 'markets-news-photo');
    image.src = newsItem.imageUrl || FALLBACK_NEWS_IMAGE;
    // Ilustración propia y decorativa, sin relación con el artículo: su texto
    // alternativo es vacío para no anunciar algo que no es la noticia.
    image.alt = newsItem.imageAlt || '';
    image.width = 640;
    image.height = 360;
    image.loading = 'lazy';
    image.decoding = 'async';
    media.appendChild(image);

    const body = newsElement('div', 'markets-secondary-card__body');
    body.appendChild(newsElement('span', 'markets-news-tag', newsItem.category || 'Economía'));
    const heading = newsElement('h4', 'markets-secondary-card__title');
    const trigger = newsElement('button', 'markets-secondary-card__trigger', newsItem.title);
    trigger.type = 'button';
    trigger.dataset.marketNewsOpen = newsItem.id;
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'market-news-dialog');
    trigger.setAttribute('aria-label', `Ampliar noticia: ${newsItem.title}`);
    heading.appendChild(trigger);
    body.appendChild(heading);

    const foot = newsElement('div', 'markets-secondary-card__foot');
    const meta = newsElement('span', 'markets-secondary-card__meta');
    const date = newsElement('time', 'markets-secondary-card__date', newsItem.publishedAt || '');
    date.dateTime = newsItem.publishedAtIso || '';
    meta.append(date, newsElement('span', 'markets-secondary-card__source', newsItem.sourceName || ''));
    const more = newsElement('span', 'markets-secondary-card__more', 'Ampliar →');
    more.setAttribute('aria-hidden', 'true');
    foot.append(meta, more);
    body.appendChild(foot);

    card.append(media, body);
    return card;
  };

  const renderSecondaryNews = (newsItems) => {
    const featured = document.querySelector('[data-market-news-slot="featured"]');
    const grid = document.querySelector('[data-market-news-slot="grid"]');
    if (!featured || !grid) return;
    const items = newsItems.filter((item) => item?.id && item?.title);
    featured.replaceChildren(...items.slice(0, FEATURED_NEWS).map((item) => buildNewsCard(item, 'featured')));
    // La rejilla se ordena por tema (orden fijo de NEWS_ORDER); dentro de cada
    // tema se conserva el orden de la selección. Las dos de la columna siguen
    // siendo las primeras de la selección, de temas distintos.
    const rank = (item) => {
      const position = NEWS_ORDER.indexOf(item.category);
      return position === -1 ? NEWS_ORDER.length : position;
    };
    const rest = items.slice(FEATURED_NEWS)
      .map((item, index) => ({ item, index }))
      .sort((a, b) => rank(a.item) - rank(b.item) || a.index - b.index)
      .map(({ item }) => item);
    grid.replaceChildren(...rest.map((item) => buildNewsCard(item, 'compact')));
    const more = grid.closest('.markets-more-news');
    if (more) more.dataset.newsState = items.length > FEATURED_NEWS ? 'ready' : 'empty';
    const count = document.querySelector('[data-market-news-count]');
    if (count) count.textContent = items.length === 1 ? '1 titular seleccionado' : `${items.length} titulares seleccionados`;
  };

  const markSecondaryNewsError = () => {
    const more = document.querySelector('.markets-more-news');
    if (more && !document.querySelector('[data-market-news-slot] .markets-secondary-card')) more.dataset.newsState = 'error';
    const count = document.querySelector('[data-market-news-count]');
    if (count && !document.querySelector('[data-market-news-slot] .markets-secondary-card')) count.textContent = 'Selección no disponible';
  };

  const hydrateDailyContent = async () => {
    setNewsUpdateStatus('loading', 'Comprobando la actualización de la selección. El contenido disponible conserva su fecha y fuente.');
    try {
      const response = await fetch('./data/daily-content.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const news = payload.dailyEconomicNews;

      if (news) {
        const update = payload.editorialUpdate || {};
        const publishedAt = new Date(news.sourcePublishedAtIso || 0);
        const ageHours = Number.isNaN(publishedAt.valueOf()) ? Infinity : Math.max(0, (Date.now() - publishedAt.valueOf()) / 3_600_000);
        const publishedToday = madridDateKey(publishedAt) === madridDateKey(new Date());
        let freshness = 'archive';
        let status = 'Archivo económico';
        if (update.status === 'failed') {
          freshness = ageHours <= 72 ? 'available' : 'archive';
          status = ageHours <= 72 ? 'Última noticia económica disponible' : 'Archivo económico';
        } else if (publishedToday) {
          freshness = 'today';
          status = 'Noticia económica del día';
        } else if (ageHours <= 36) {
          freshness = 'recent';
          status = 'Noticia económica reciente';
        } else if (ageHours <= 72) {
          freshness = 'available';
          status = 'Última noticia económica disponible';
        }
        setText('[data-daily-news="status"]', status);
        setText('[data-daily-news="date"]', news.selectionDate);
        setText('[data-daily-news="category"]', news.category);
        setText('[data-daily-news="title"]', news.title);
        setText('[data-daily-news="summary"]', news.summary);
        setText('[data-daily-news="why"]', news.whyItMatters);
        setText('[data-daily-news="source"]', `Fuente: ${news.sourceName} · Publicada el ${news.sourcePublishedAt}`);
        setText('[data-daily-news="source-name"]', news.sourceName);

        const lead = document.querySelector('.markets-lead-news');
        if (lead) lead.dataset.newsFreshness = freshness;
        const newsDate = document.querySelector('[data-daily-news="date"]');
        if (newsDate) newsDate.dateTime = news.sourcePublishedAtIso || '';

        const succeededAt = readableAttempt(update.lastSuccessAt);
        const lastSuccess = succeededAt ? ` Última selección registrada: ${succeededAt} (Madrid).` : '';
        if (update.status === 'ok' && succeededAt) {
          setNewsUpdateStatus('available', `Selección automática del ${succeededAt} (Madrid). Consulta la fecha de publicación y la fuente de cada noticia.`);
        } else if (update.status === 'degraded') {
          setNewsUpdateStatus('partial', `Actualización parcial. Consulta la fecha y la fuente de cada noticia disponible.${lastSuccess}`);
        } else if (update.status === 'failed') {
          setNewsUpdateStatus('error', `No se ha podido actualizar la selección. Se conserva el contenido disponible con su fecha y fuente.${lastSuccess}`);
        } else {
          setNewsUpdateStatus('unverified', 'Estado de actualización no disponible o incompleto. Consulta la fecha y la fuente de cada noticia; no se confirma una nueva selección.');
        }

        const sourceLink = document.querySelector('[data-daily-news="source-link"]');
        if (sourceLink && news.sourceUrl) sourceLink.href = news.sourceUrl;

        const image = document.querySelector('[data-daily-news="image"]');
        if (image && news.imageUrl) image.src = news.imageUrl;
        if (image && news.imageAlt) image.alt = news.imageAlt;

        document.querySelectorAll('[data-daily-impact]').forEach((element, index) => {
          if (news.impactPoints?.[index]) element.textContent = news.impactPoints[index];
        });
      } else {
        setNewsUpdateStatus('partial', 'La respuesta no incluye una noticia principal. Se conserva el contenido disponible; consulta su fecha y su fuente.');
      }

      setText('[data-macro-updated]', `Última comprobación de datos oficiales · ${payload.macroIndicatorsUpdatedAt}`);
      const indicators = Array.isArray(payload.dailyMacroIndicators) ? payload.dailyMacroIndicators : [];
      indicators.forEach((indicator) => {
        const card = document.querySelector(`[data-macro-id="${indicator.id}"]`);
        if (!card) return;
        const fields = {
          label: indicator.label,
          value: indicator.value,
          change: indicator.change,
          period: indicator.period,
          context: indicator.context,
        };
        Object.entries(fields).forEach(([field, value]) => {
          const element = card.querySelector(`[data-macro-field="${field}"]`);
          if (element && typeof value === 'string') element.textContent = value;
        });
        const source = card.querySelector('[data-macro-field="source"]');
        if (source) {
          source.textContent = `${indicator.sourceName} · ${indicator.referenceDate}`;
          source.href = indicator.sourceUrl;
        }
        const direction = DIRECTION[indicator.direction];
        if (direction) {
          const arrow = card.querySelector('[data-macro-field="direction"]');
          if (arrow) { arrow.textContent = direction.symbol; marcarTendencia(arrow, direction.clase); }
          marcarTendencia(card.querySelector('[data-macro-field="change"]'), direction.clase);
        }
      });

      const secondaryNews = Array.isArray(payload.secondaryEconomicNews) ? payload.secondaryEconomicNews : [];
      renderSecondaryNews(secondaryNews);
      mountSecondaryNewsDialog(secondaryNews);
    } catch (error) {
      setNewsUpdateStatus('error', 'No se ha podido comprobar la actualización. Consulta la fecha y la fuente de cada noticia disponible.');
      markSecondaryNewsError();
      console.warn('NUVIA Portal Alfa mantiene el último contenido editorial disponible.', error);
    }
  };

  const startHomeIntegration = () => {
    window.setTimeout(() => {
      hydrateDailyContent();
    }, 400);
  };

  if (document.readyState === 'complete') startHomeIntegration();
  else window.addEventListener('load', startHomeIntegration, { once: true });
})();
