export const sites = [
  {
    key: 'economia', name: 'Economía y Finanzas', short: 'Economía y Finanzas',
    purpose: 'Entender el mundo que mueve tu dinero.',
    copy: 'Actualidad económica, mercados y análisis para poner los datos en contexto y formar tu propio criterio.',
    topics: 'Mercados · Informes · Cartera · Empresas',
    photo: 'economia-card-mercados-20260918.webp', hero: 'economia-panoramica-20260909.webp',
    intro: 'De la actualidad a los datos.', description: 'Elige entre seguir el contexto económico o explorar herramientas de análisis descriptivo.',
    nav: ['Informes', 'Mercados', 'Cartera', 'Empresas'],
    resources: [
      ['informes', 'Informes de mercado', 'Lectura y contexto', 'Informe diario y semanal para seguir la evolución de los mercados con fuentes y fecha.', 'mercados.html?vista=informes#lectura-informe', 'Consultar informes'],
      ['mercados', 'Mercados y noticias', 'Actualidad', 'Noticias, indicadores y cotizaciones para comprender el entorno económico.', 'mercados.html', 'Explorar mercados'],
      ['cartera', 'Cartera y analítica', 'Laboratorio', 'Composición, riesgo y escenarios definidos por ti. Métodos explicados y límites a la vista.', 'cartera.html', 'Abrir el laboratorio'],
      ['empresas', 'Análisis y valoración de empresas', 'Datos y métodos', 'Datos del negocio, información financiera y métodos académicos con fuentes, supuestos y límites identificados.', 'cartera.html?vista=companies', 'Explorar empresas'],
    ],
    feature: ['¿Un concepto nuevo?', 'Antes de seguir, puedes hacer una pausa en Academia.', 'El glosario y los conocimientos esenciales ayudan a dar sentido a los términos que aparecen en los mercados.', 'academia.html', 'Explorar Academia'],
    note: 'Información y análisis descriptivo. Los cálculos no determinan qué comprar, vender o mantener ni la adecuación de una inversión para una persona.'
  },
  {
    key: 'patrimonio', name: 'Patrimonio', short: 'Patrimonio',
    purpose: 'Las grandes decisiones empiezan por comprender.',
    copy: 'Vivienda, impuestos y jubilación. Guías y simuladores para mirar tu economía familiar con perspectiva.',
    topics: 'Vivienda · Jubilación · Impuestos · Planificación',
    photo: 'planificacion-patrimonial-familia-20260923.webp', hero: 'patrimonio-panoramica-20260909.webp',
    intro: 'Una visión de conjunto para cada etapa.', description: 'Comprende los conceptos y explora escenarios con sus datos, supuestos y limitaciones.',
    nav: ['Vivienda', 'Jubilación', 'Impuestos', 'Planificación'],
    resources: [
      ['vivienda', 'Vivienda y coste de vida', 'Guía y simulador', 'Explora los costes de la vivienda y su relación con el presupuesto familiar.', 'vivienda.html', 'Explorar vivienda'],
      ['jubilacion', 'Jubilación', 'Guías y simulador', 'Comprende los ingresos futuros y cómo cambian los escenarios bajo distintos supuestos.', 'jubilacion.html', 'Explorar jubilación'],
      ['impuestos', 'Impuestos', 'Guías y herramientas', 'Fiscalidad del ahorro, calendario fiscal, sucesiones y donaciones explicados con claridad.', 'fiscalidad.html', 'Comprender los impuestos'],
      ['planificacion', 'Planificación patrimonial', 'Guía educativa', 'Relaciona las piezas de la economía familiar y las preguntas que surgen al mirar a largo plazo.', 'temas.html?topic=planificacion-patrimonial', 'Leer la guía'],
    ],
    feature: ['Aprender a mirar los supuestos', 'Un escenario es una forma de explorar.', 'Las hipótesis ayudan a entender cómo cambia un resultado. No son una predicción ni una decisión tomada por ti.', 'metodologia.html', 'Conocer la metodología'],
    note: 'Contenido educativo e informativo. Las guías y simulaciones no constituyen asesoramiento financiero, fiscal o jurídico personalizado.'
  },
  {
    key: 'bienestar', name: 'Familia, Salud y Bienestar', short: 'Bienestar',
    purpose: 'También importa cómo vivimos.',
    copy: 'Cuerpo, mente, hábitos y tiempo propio. Un espacio de divulgación para aprender y ampliar la mirada sobre el bienestar.',
    topics: 'Respiración · Movimiento · Nutrición · Descanso',
    photo: 'bienestar-card-respiracion-20261002.webp', hero: 'bienestar-panoramica-20260909.webp',
    intro: 'Cuerpo, mente y salud.', description: 'Cuatro temas para explorar con calma. Cada sección muestra sus publicaciones disponibles.',
    nav: ['Respiración', 'Movimiento', 'Nutrición', 'Descanso'],
    resources: [
      ['respiracion', 'Respiración y relajación', '2 artículos disponibles', 'La respiración como el escultor del cerebro y ¿Qué es meditar? Textos de Isabel Florido Mayor.', 'respiracion-relajacion.html', 'Ver publicaciones'],
      ['movimiento', 'Movimiento consciente', 'Artículos en preparación', 'Un espacio dedicado al movimiento y a la conciencia corporal.', 'movimiento-consciente.html', 'Visitar la sección'],
      ['nutricion', 'Nutrición equilibrada', 'Artículos en preparación', 'Un espacio de divulgación sobre alimentación y hábitos cotidianos.', 'nutricion-equilibrada.html', 'Visitar la sección'],
      ['descanso', 'Descanso, límites y tiempo propio', 'Artículos en preparación', 'Un espacio para comprender el descanso y nuestra relación con el tiempo.', 'descanso-limites-tiempo-propio.html', 'Visitar la sección'],
    ],
    feature: ['Las personas detrás del contenido', 'Conocimiento con nombre y contexto.', 'Conoce a quienes firman las publicaciones y el ámbito de sus aportaciones a NUVIA.', 'colaboradores.html', 'Conocer a los colaboradores'],
    note: 'Divulgación general sobre salud y bienestar. No ofrece diagnósticos, tratamientos ni consejo sanitario individual.'
  },
  {
    key: 'academia', name: 'Academia NUVIA', short: 'Academia',
    purpose: 'Saber es patrimonio.',
    copy: 'Conceptos, cursos y herramientas para aprender a tu ritmo. Empieza por una pregunta y sigue construyendo tu criterio.',
    topics: 'Conceptos · Cursos · Interés compuesto · Glosario',
    photo: 'academia-aprender-en-familia-20260909.webp', hero: 'academia-panoramica-20260909.webp',
    intro: 'Elige cómo quieres aprender.', description: 'Una consulta breve, un concepto esencial o un curso: tú eliges el punto de partida.',
    nav: ['Esenciales', 'Cursos', 'Interés compuesto', 'Glosario'],
    resources: [
      ['esenciales', 'Conocimientos esenciales', 'Comprender las bases', 'Ideas para entender el dinero, la economía y su relación con la vida cotidiana.', 'academia.html?tab=esenciales', 'Explorar conocimientos'],
      ['cursos', 'Cursos', 'Aprender con continuidad', 'Accede al catálogo y al curso Dinero con criterio para avanzar a tu ritmo.', 'academia.html?tab=cursos', 'Ver cursos'],
      ['herramientas', 'Interés compuesto', 'Aprender experimentando', 'Explora el efecto matemático del tiempo, las aportaciones y las hipótesis de rentabilidad.', 'academia.html?tab=calculadora', 'Abrir el simulador'],
      ['glosario', 'Glosario financiero', 'Resolver una duda', 'Consulta el significado de un término y vuelve a tu lectura con más contexto.', 'academia.html?tab=glosario', 'Consultar el glosario'],
    ],
    feature: ['Para seguir profundizando', 'De los fundamentos a los activos financieros.', 'Dos áreas de conocimiento que amplían los conceptos esenciales y ayudan a comprender cómo funcionan los instrumentos.', 'academia.html?tab=fundamentos', 'Explorar fundamentos'],
    note: 'Formación y herramientas educativas. Los ejemplos y simulaciones explican conceptos; no constituyen recomendaciones de inversión.'
  },
];
