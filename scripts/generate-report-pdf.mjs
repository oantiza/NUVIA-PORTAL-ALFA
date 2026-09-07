import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

let destino = resolve('docs/pdf/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906.pdf');
const destinoFallback = resolve('docs/pdf/ARQUITECTURA_Y_ESTRUCTURA_PORTAL_NUVIA_20260906-con-diagrama.pdf');
const imgBuffer = await readFile(resolve('docs/pdf/diagrama-estructura-2x.png'));
const imgBase64 = `data:image/png;base64,${imgBuffer.toString('base64')}`;

const CSS = `
@page { size: A4; margin: 18mm 16mm 16mm; }
:root{
  --navy-950:#06172f; --navy-900:#0b2347; --navy-700:#284c75;
  --green-700:#4a5d23; --green-300:#b9cc8b;
  --bronze-500:#b69152; --bronze-200:#dcc59c;
  --cloud:#f4f6f9; --paper-light:#faf7ee;
  --ink:#0b2347; --copy:#40506a; --muted:#5b6472;
  --line:rgba(11,35,71,.13);
  --sans:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
  --serif:"Fraunces",Georgia,serif;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--sans);color:var(--ink);font-size:9.5pt;line-height:1.55;
     -webkit-print-color-adjust:exact;print-color-adjust:exact}

/* ── Portada ─────────────────────────────────────────────── */
.cover{height:297mm;display:flex;flex-direction:column;position:relative;page-break-after:always;
       background:linear-gradient(155deg,#06172f 0%,#0b2347 52%,#1d4468 100%);
       margin:-18mm -16mm 0;padding:30mm 18mm 24mm;color:#f8f4ea;overflow:hidden}
.cover .arcs{position:absolute;inset:0}
.cover .in{position:relative;height:100%;display:flex;flex-direction:column}
.cover .brand{font-family:var(--serif);font-size:18pt;letter-spacing:.2em;font-weight:300}
.cover .brand span{display:block;font-family:var(--sans);font-size:7pt;letter-spacing:.34em;
                   color:var(--green-300);text-transform:uppercase;font-weight:600;margin-top:4px}
.cover .mid{margin-top:auto;margin-bottom:24mm}
.cover .kick{font-size:8pt;letter-spacing:.28em;text-transform:uppercase;
             color:var(--green-300);font-weight:600;margin-bottom:8mm}
.cover h1{font-family:var(--serif);font-size:32pt;font-weight:200;line-height:1.1;color:#fff}
.cover .sub{font-family:var(--serif);font-size:13pt;font-weight:300;font-style:italic;
            color:rgba(255,255,255,.78);margin-top:6mm}
.cover .meta{border-top:1px solid rgba(255,255,255,.22);padding-top:5mm;
             font-size:8pt;color:rgba(255,255,255,.65);letter-spacing:.05em}

/* ── Contenido ───────────────────────────────────────────── */
.doc{padding-top:2mm}
h1{font-family:var(--serif);font-size:17pt;font-weight:300;color:var(--navy-900);
   margin:0 0 3.5mm;padding-bottom:2mm;border-bottom:2px solid var(--bronze-500);
   page-break-after:avoid}
h2{font-family:var(--serif);font-size:13pt;font-weight:400;color:var(--navy-900);
   margin:6mm 0 2.5mm;page-break-after:avoid;border-bottom:1px solid var(--line);padding-bottom:1.2mm}
h3{font-family:var(--serif);font-size:10.5pt;font-weight:600;color:var(--navy-900);
   margin:4.5mm 0 1.5mm;page-break-after:avoid}
h4{font-size:9pt;font-weight:600;color:var(--navy-700);margin:3mm 0 1.2mm}
p{margin-bottom:2.4mm;color:var(--copy)}
strong{color:var(--navy-900);font-weight:600}
em{font-style:italic}
ul,ol{margin:0 0 2.8mm 4.5mm;color:var(--copy)}
li{margin-bottom:1.2mm}
li>strong:first-child{color:var(--navy-900)}
hr{border:none;border-top:1px solid var(--line);margin:5mm 0}
a{color:var(--green-700);text-decoration:none}
code{font-family:"Consolas","Menlo",monospace;font-size:8.5pt;background:var(--cloud);
     padding:1px 4px;border-radius:3px;color:var(--navy-700)}

blockquote{background:var(--paper-light);border-left:3px solid var(--bronze-500);
           padding:2.5mm 4mm;margin:3mm 0;border-radius:0 4px 4px 0;
           page-break-inside:avoid}
blockquote p{margin:0;font-size:9pt;color:var(--navy-900)}

table{width:100%;border-collapse:collapse;font-size:8.5pt;margin:3.5mm 0;
      page-break-inside:avoid}
th{background:var(--navy-900);color:#fff;padding:2mm 2.5mm;text-align:left;
   font-size:7pt;letter-spacing:.08em;text-transform:uppercase;font-weight:600}
td{padding:1.8mm 2.5mm;border-bottom:1px solid var(--line);color:var(--copy);
   vertical-align:top}
td:first-child{font-weight:600;color:var(--navy-900)}
tbody tr:nth-child(even) td{background:var(--cloud)}

.box{background:var(--cloud);border:1px solid var(--line);border-radius:5px;padding:3mm 4mm;margin:3.5mm 0;page-break-inside:avoid}
.box-title{font-weight:600;color:var(--navy-900);font-size:9pt;margin-bottom:1.8mm}
.badge{display:inline-block;padding:1px 5px;border-radius:3px;font-size:7pt;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.badge-gold{background:#faeccd;color:#7a5214}
.badge-blue{background:#e0ebfa;color:#183b6b}

/* ── Figura del Diagrama ─────────────────────────────────── */
.diagram-figure{
  margin:4mm 0 5mm;
  padding:3.5mm;
  background:#fff;
  border:1px solid var(--line);
  border-radius:6px;
  page-break-inside:avoid;
  text-align:center;
}
.diagram-figure img{
  width:100%;
  max-width:100%;
  height:auto;
  display:block;
  border-radius:4px;
}
.diagram-figure figcaption{
  font-size:7.8pt;
  color:var(--muted);
  margin-top:2.5mm;
  font-style:italic;
  letter-spacing:.02em;
}
`;

const arcs = `<svg class="arcs" viewBox="0 0 210 247" preserveAspectRatio="none">
  <g fill="none" stroke="#fff" stroke-opacity=".05">
    <circle cx="215" cy="52" r="70"/><circle cx="215" cy="52" r="98"/>
    <circle cx="215" cy="52" r="128"/><circle cx="215" cy="52" r="160"/></g>
  <path d="M 18 196 C 52 196 74 182 94 166 C 116 148 134 130 158 121"
        fill="none" stroke="#b9cc8b" stroke-opacity=".3" stroke-width=".5"/>
  <circle cx="94" cy="166" r="1.1" fill="#b9cc8b" fill-opacity=".5"/>
  <circle cx="158" cy="121" r="1.1" fill="#b9cc8b" fill-opacity=".5"/>
</svg>`;

const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..700;1,9..144,300..400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>

<section class="cover">${arcs}<div class="in">
  <div class="brand">NUVIA<span>Family Wealth</span></div>
  <div class="mid">
    <div class="kick">Arquitectura &middot; Estructura Global</div>
    <h1>Arquitectura y Estructura Global del Portal</h1>
    <div class="sub">Home de entrada, 5 Homes de espacio, Colaboradores, Qu&eacute; es NUVIA y Navegaci&oacute;n dirigida</div>
  </div>
  <div class="meta">6 de septiembre de 2026 &middot; Documento de trabajo para el Fundador &middot; Fase Alfa &middot; Marco regulatorio v1.2</div>
</div></section>

<div class="doc">

  <h2>1. Visi&oacute;n General y Prop&oacute;sito de la Nueva Estructura</h2>
  <p>La directriz del fundador establece una jerarqu&iacute;a clara, limpia y sin ambig&uuml;edades. Resuelve el problema hist&oacute;rico de NUVIA: la mezcla entre <strong>portadas de espacio</strong> y <strong>herramientas de trabajo</strong> (como ocurr&iacute;a al confundir <em>Econom&iacute;a y Finanzas</em> con la p&aacute;gina de <em>Mercados</em>, o <em>Patrimonio</em> con una lista dispersa de simuladores).</p>
  <p>La estructura can&oacute;nica se organiza en cuatro niveles:</p>
  <ol>
    <li><strong>Nivel 1 &middot; Entrada Principal (Home Global):</strong> Puerta de entrada al portal, presentaci&oacute;n del prop&oacute;sito y mapa distribuidor hacia los 5 espacios.</li>
    <li><strong>Nivel 2 &middot; Los 5 Espacios (Home Propia por Espacio):</strong> Sedes propias de cada &aacute;mbito que explican qu&eacute; se aprende all&iacute;, ofrecen contexto familiar y distribuyen el acceso a sus recursos.</li>
    <li><strong>Nivel 3 &middot; Herramientas y Contenidos Especializados:</strong> Simuladores (vivienda, jubilaci&oacute;n, cartera), gu&iacute;as did&aacute;cticas, cursos y an&aacute;lisis de empresas.</li>
    <li><strong>Nivel 4 &middot; Identidad y Equipo:</strong> P&aacute;ginas institucionales de <em>Colaboradores</em> y <em>Qu&eacute; es NUVIA</em> (esp&iacute;ritu y filosof&iacute;a).</li>
  </ol>

  <figure class="diagram-figure">
    <img src="${imgBase64}" alt="Diagrama de Estructura Canónica de NUVIA">
    <figcaption>Figura 1: Mapa jer&aacute;rquico can&oacute;nico de NUVIA (Nivel 1 Entrada Principal &rarr; Nivel 2 Los 5 Espacios con Home propia &rarr; Nivel 3 Herramientas de Espacio &middot; Nivel Institucional / Identidad).</figcaption>
  </figure>

  <h2>2. Mapa Arquitect&oacute;nico y Rutas Can&oacute;nicas</h2>
  <table>
    <thead>
      <tr>
        <th>Destino</th>
        <th>Ruta can&oacute;nica propuesta</th>
        <th>Rol funcional</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Home de Entrada</td>
        <td><code>index.html</code></td>
        <td>Puerta de bienvenida global, mapa de los 5 espacios y accesos r&aacute;pidos cotidianos.</td>
        <td><span class="badge badge-gold">Consolidada</span></td>
      </tr>
      <tr>
        <td>Home: Econom&iacute;a y Finanzas</td>
        <td><code>economia.html</code></td>
        <td>Sede del espacio: contexto macroecon&oacute;mico, relaci&oacute;n con el hogar y derivaci&oacute;n a mercados, cartera y empresas.</td>
        <td><span class="badge badge-blue">Por dise&ntilde;ar</span></td>
      </tr>
      <tr>
        <td>Home: Patrimonio</td>
        <td><code>patrimonio.html</code></td>
        <td>Sede del espacio: mapa de la econom&iacute;a familiar (vivienda, retiro, impuestos) y acceso directo a simuladores.</td>
        <td><span class="badge badge-blue">Por dise&ntilde;ar</span></td>
      </tr>
      <tr>
        <td>Home: Familia, Salud y Bienestar</td>
        <td><code>bienestar.html</code></td>
        <td>Sede del espacio: estilo de vida, h&aacute;bitos saludables y serenidad familiar (sin diagn&oacute;stico m&eacute;dico).</td>
        <td><span class="badge badge-blue">Por dise&ntilde;ar</span></td>
      </tr>
      <tr>
        <td>Home: Academia NUVIA</td>
        <td><code>academia.html</code></td>
        <td>Sede del campus: itinerarios pedag&oacute;gicos, glosario, calculadoras did&aacute;cticas y acceso a cursos.</td>
        <td><span class="badge badge-blue">Por dise&ntilde;ar</span></td>
      </tr>
      <tr>
        <td>Home: Lecturas con Criterio</td>
        <td><code>lecturas.html</code></td>
        <td>Sede de la biblioteca: criterio editorial, selecciones bibliogr&aacute;ficas y ensayos de largo plazo.</td>
        <td><span class="badge badge-blue">Por dise&ntilde;ar</span></td>
      </tr>
      <tr>
        <td>Colaboradores</td>
        <td><code>colaboradores.html</code></td>
        <td>Minisecci&oacute;n / p&aacute;gina de equipo: fotograf&iacute;a, perfil y breve curr&iacute;culum de quienes aportan al portal.</td>
        <td><span class="badge badge-blue">Por dise&ntilde;ar</span></td>
      </tr>
      <tr>
        <td>Qu&eacute; es NUVIA</td>
        <td><code>que-es-nuvia.html</code></td>
        <td>Manifiesto fundacional, esp&iacute;ritu, valores (Claridad, Honestidad, Independencia) y l&iacute;mites &eacute;ticos.</td>
        <td><span class="badge badge-gold">Activa / Apta</span></td>
      </tr>
    </tbody>
  </table>

  <h2>3. Diagn&oacute;stico: Por qu&eacute; &laquo;no vale lo que hay&raquo; en las Homes Actuales</h2>
  <p>La orden del fundador es taxativa: <em>&laquo;las home de cada espacio est&aacute;n todav&iacute;a por dise&ntilde;ar / estructurar. NO me vale lo que hay&raquo;</em>. El an&aacute;lisis t&eacute;cnico confirma la necesidad de esta transformaci&oacute;n:</p>
  
  <h3>3.1. Econom&iacute;a y Finanzas (mercados.html)</h3>
  <p><strong>Problema actual:</strong> La p&aacute;gina arranca inmediatamente con las tarjetas de noticias macroecon&oacute;micas y el panel de cotizaciones de activos. Pretende ser a la vez la portada de un peri&oacute;dico financiero y la antesala de la anal&iacute;tica cuantitativa de carteras.</p>
  <p><strong>Carencia:</strong> El usuario llega sin anestesia a datos t&eacute;cnicos. Falta una verdadera <em>Home</em> que explique primero al ciudadano com&uacute;n qu&eacute; significan la inflaci&oacute;n o los tipos de inter&eacute;s en su d&iacute;a a d&iacute;a y qu&eacute; herramientas tiene NUVIA para ayudarle a entenderlos.</p>

  <h3>3.2. Patrimonio (temas.html)</h3>
  <p><strong>Problema actual:</strong> Es un contenedor gen&eacute;rico parametrizado (<code>?topic=jubilacion</code>, etc.). Resulta fr&iacute;o, t&eacute;cnico y puramente taxon&oacute;mico.</p>
  <p><strong>Carencia:</strong> No act&uacute;a como el centro neur&aacute;lgico del patrimonio familiar. Una familia necesita ver c&oacute;mo su hipoteca, sus impuestos anuales y su futura jubilaci&oacute;n forman parte de un mismo flujo vital interconectado.</p>

  <h3>3.3. Familia, Salud y Bienestar (temas.html?topic=bienestar)</h3>
  <p><strong>Problema actual:</strong> Figura relegada como un subtema dentro de la p&aacute;gina de patrimonio, perdiendo su identidad propia.</p>
  <p><strong>Carencia:</strong> El bienestar, los h&aacute;bitos y la relaci&oacute;n con el tiempo y el dinero requieren un espacio visualmente sereno, diferenciado y con entidad aut&oacute;noma.</p>

  <h3>3.4. Academia NUVIA (academia.html)</h3>
  <p><strong>Problema actual:</strong> Todo el cat&aacute;logo (p&iacute;ldoras de activos, glosario, calculadora de inter&eacute;s compuesto y acceso a cursos) est&aacute; comprimido en pesta&ntilde;as dentro de una &uacute;nica p&aacute;gina interactiva.</p>
  <p><strong>Carencia:</strong> Falta un vest&iacute;bulo pedag&oacute;gico que gu&iacute;e al estudiante: orientar seg&uacute;n el nivel de partida (desde quien no sabe nada de finanzas hasta quien quiere analizar fondos de inversi&oacute;n).</p>

  <h3>3.5. Lecturas con Criterio (lecturas.html)</h3>
  <p><strong>Problema actual:</strong> Se reduce a una cuadr&iacute;cula de libros con un filtro en JavaScript, sin jerarqu&iacute;a de lectura ni relato editorial.</p>
  <p><strong>Carencia:</strong> Debe ser la biblioteca reflexiva de NUVIA, explicando el porqu&eacute; de cada recomendaci&oacute;n editorial y agrupando las obras por temas vitales (psicolog&iacute;a del dinero, historia econ&oacute;mica, toma de decisiones).</p>

  <h2>4. Patr&oacute;n y Requerimientos de Dise&ntilde;o para las 5 Nuevas Homes</h2>
  <p>Cada una de las 5 Homes de espacio contar&aacute; con su propia identidad crom&aacute;tica y tonal, pero compartir&aacute; un <strong>esqueleto estructural com&uacute;n y armonizado</strong>:</p>

  <div class="box">
    <div class="box-title">Esquema Arquet&iacute;pico de Home de Espacio</div>
    <ol>
      <li><strong>Apertura Institucional del Espacio:</strong> Miga de pan contextual (Inicio &gt; [Espacio]), titular de perspectiva en Fraunces y p&aacute;rrafo de prop&oacute;sito conectado con la vida familiar.</li>
      <li><strong>Mapa de Recursos y Herramientas:</strong> Tarjetas visuales con indicador claro de funci&oacute;n (Herramienta / Simulador, Gu&iacute;a Did&aacute;ctica, An&aacute;lisis).</li>
      <li><strong>Concepto o Destacado Esencial:</strong> La noci&oacute;n fundamental que la familia debe asimilar en este &aacute;mbito.</li>
      <li><strong>Aviso de Fuentes, L&iacute;mites y Perspectiva Independiente:</strong> Recordatorio de rigor acad&eacute;mico y ausencia de asesoramiento.</li>
    </ol>
  </div>

  <h2>5. P&aacute;gina / Minisecci&oacute;n de Colaboradores</h2>
  <p>Conforme a lo indicado por el fundador, esta p&aacute;gina o minisecci&oacute;n tendr&aacute; un formato sencillo, transparente y honesto: <strong>&laquo;aparecer&aacute;n los colaboradores de la web con una foto suya y un peque&ntilde;o curr&iacute;culum&raquo;</strong>.</p>
  
  <h3>5.1. Estructura de la ficha de colaborador</h3>
  <ul>
    <li><strong>Fotograf&iacute;a:</strong> Retrato sobrio, natural y sin artificios comerciales, integrado con la paleta visual de NUVIA.</li>
    <li><strong>Nombre y especialidad:</strong> Nombre completo y titulaci&oacute;n o &aacute;rea de especializaci&oacute;n profesional (ej. <em>Economista</em>, <em>Analista cuantitativo</em>, <em>Divulgador fiscal</em>).</li>
    <li><strong>Peque&ntilde;o curr&iacute;culum:</strong> P&aacute;rrafo sint&eacute;tico (3 a 5 l&iacute;neas) describiendo su trayectoria, experiencia y vocaci&oacute;n educativa.</li>
    <li><strong>Contribuci&oacute;n a NUVIA:</strong> Menci&oacute;n a los contenidos o herramientas en los que colabora (ej. <em>Autor en Academia</em>, <em>Modelos de Cartera</em>, <em>Revisi&oacute;n did&aacute;ctica de gu&iacute;as</em>).</li>
  </ul>

  <h3>5.2. Gobernanza regulatoria obligatoria (&sect;9 del Marco)</h3>
  <blockquote>
    <p><strong>Cero captaci&oacute;n de clientes:</strong> No se incluir&aacute;n formularios de contacto directo, solicitudes de reuni&oacute;n, n&uacute;meros de tel&eacute;fono ni correos comerciales. Prohibida la comercializaci&oacute;n de productos y separaci&oacute;n estricta respecto a cualquier entidad bancaria vinculada.</p>
  </blockquote>

  <h2>6. P&aacute;gina Institucional: &laquo;Qu&eacute; es NUVIA&raquo; (Esp&iacute;ritu y Filosof&iacute;a)</h2>
  <p>La p&aacute;gina <code>que-es-nuvia.html</code> permanece como el basti&oacute;n institucional del proyecto. Su funci&oacute;n es explicar a cualquier ciudadano qu&eacute; hace &uacute;nico a este portal:</p>
  <ul>
    <li><strong>La Definici&oacute;n Can&oacute;nica:</strong> &laquo;NUVIA es un lugar donde las familias aprenden a entender su dinero&raquo;.</li>
    <li><strong>Los Tres Pilares:</strong> Comprender la realidad patrimonial, Cuidar el capital frente a comisiones e inflaci&oacute;n, y Transmitir conocimiento y valores a las siguientes generaciones.</li>
    <li><strong>Los Cuatro Valores:</strong> Claridad radical, Honestidad sobre l&iacute;mites e incertidumbre, total Independencia comercial y Respeto por los profesionales colegiados.</li>
    <li><strong>El Lema:</strong> &laquo;NUVIA informa, explica y calcula. T&uacute; comprendes y decides&raquo;.</li>
  </ul>

  <h2>7. Direcci&oacute;n de la Cabecera Global (Header)</h2>
  <p>La cabecera del portal debe articular de forma limpia y directa el acceso tanto a las <strong>Homes de cada espacio</strong> como a sus <strong>herramientas internas</strong> y a las <strong>p&aacute;ginas institucionales</strong>.</p>

  <h3>7.1. Arquitectura de los men&uacute;s desplegables (Escritorio)</h3>
  <p>El primer destino dentro de cada men&uacute; desplegable es siempre la <strong>Home del Espacio</strong>:</p>
  <ul>
    <li><strong>Econom&iacute;a y Finanzas &blacktriangledown;:</strong> <code>&rarr; Portada del espacio (Home)</code> &middot; Mercados y noticias &middot; Laboratorio de cartera &middot; An&aacute;lisis de empresas</li>
    <li><strong>Patrimonio &blacktriangledown;:</strong> <code>&rarr; Portada del espacio (Home)</code> &middot; Vivienda y coste de vida &middot; Jubilaci&oacute;n &middot; Fiscalidad e impuestos &middot; Gu&iacute;as patrimoniales</li>
    <li><strong>Familia, Salud y Bienestar:</strong> <code>&rarr; Portada del espacio (Home)</code> (enlace directo)</li>
    <li><strong>Academia NUVIA &blacktriangledown;:</strong> <code>&rarr; Portada del campus (Home)</code> &middot; Conocimientos esenciales &middot; Glosario financiero &middot; Cursos monogr&aacute;ficos</li>
    <li><strong>Lecturas con Criterio &blacktriangledown;:</strong> <code>&rarr; Portada del espacio (Home)</code> &middot; Cat&aacute;logo de libros y fichas</li>
    <li><strong>Bloque Institucional Secundario:</strong> <code>Colaboradores</code> (directo a colaboradores.html) &middot; <code>Qu&eacute; es NUVIA</code> (directo a que-es-nuvia.html)</li>
  </ul>

  <h3>7.2. Geometr&iacute;a y Rendimiento en Tablet (768 px &ndash; 1024 px)</h3>
  <ul>
    <li><strong>Altura contenida:</strong> Mantener el l&iacute;mite geom&eacute;trico optimizado en la auditor&iacute;a (~109 px a 768 px de ancho), impidiendo que la cabecera devore la primera pantalla &uacute;til.</li>
    <li><strong>Organizaci&oacute;n en dos alturas:</strong> Fila superior con logotipo institucional y accesos a <em>Colaboradores</em> y <em>Qu&eacute; es NUVIA</em>; fila inferior con los 5 espacios distribuidos de forma t&aacute;ctil (m&iacute;nimo 44 px de &aacute;rea t&aacute;ctil accesible).</li>
  </ul>

  <h2>8. Hoja de Ruta y Plan de Ejecuci&oacute;n T&eacute;cnico</h2>
  <ol>
    <li><strong>Fase 1 &middot; Maquetaci&oacute;n de colaboradores.html:</strong> Creaci&oacute;n de la ficha institucional limpia con fotograf&iacute;a y rese&ntilde;a curricular sin enlaces de captaci&oacute;n comercial.</li>
    <li><strong>Fase 2 &middot; Dise&ntilde;o estructural de las 5 Homes de espacio:</strong> Implementaci&oacute;n de la plantilla base en las sedes de Econom&iacute;a, Patrimonio, Bienestar, Academia y Lecturas.</li>
    <li><strong>Fase 3 &middot; Actualizaci&oacute;n del Header y Enrutamiento Global:</strong> Ajuste de la navegaci&oacute;n unificada en todas las p&aacute;ginas y sincronizaci&oacute;n del script <code>nuvia-site-unified.js</code>.</li>
    <li><strong>Fase 4 &middot; Verificaci&oacute;n y Auditor&iacute;a Playwright:</strong> Ejecuci&oacute;n de pruebas de enrutamiento y comprobaci&oacute;n de renderizado visual (WCAG AA, suelo 12 px, 0 desbordes).</li>
  </ol>

</div>

</body></html>`;

console.log('Iniciando Playwright...');
const b = await chromium.launch();
const pg = await b.newPage();
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.waitForTimeout(1000);

try {
  await pg.pdf({
    path: destino,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '16mm', left: '16mm', right: '16mm' }
  });
  console.log('PDF con diagrama generado con éxito en:', destino);
} catch (err) {
  if (err.code === 'EBUSY') {
    console.warn('Archivo principal bloqueado (abierto por visor). Guardando en fallback:', destinoFallback);
    await pg.pdf({
      path: destinoFallback,
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '16mm', left: '16mm', right: '16mm' }
    });
    console.log('PDF con diagrama generado con éxito en:', destinoFallback);
  } else {
    throw err;
  }
}

await pg.close();
await b.close();
