# Imágenes originales de las cuatro webs

Fecha: 12-11-2026. Generadas para el rediseño expresamente solicitado por el fundador.

Herramienta: `image_gen.imagegen` integrada; no CLI ni API externa manual. Sin imágenes de referencia. No se han utilizado fotografías anteriores del portal. El modelo exacto no fue expuesto por la herramienta.

Los WebP principales se encuentran en `src/assets/ecosistema/`. Los PNG originales se conservan localmente en el prototipo histórico:

| Uso | Original conservado | Archivo web | Dimensiones web | Bytes |
|---|---|---|---|---|
| Economía | `economia-perspectiva-original.png` | `economia-perspectiva.webp` | 1000 × 1000, alfa | 179550 |
| Patrimonio | `patrimonio-hogar-original.png` | `patrimonio-hogar.webp` | 1000 × 1250 | 215678 |
| Bienestar | `bienestar-paseo-original.png` | `bienestar-paseo.webp` | 1400 × 933 | 313858 |
| Academia | `academia-ideas-original.png` | `academia-ideas.webp` | 1000 × 1000, alfa | 118156 |

Conversión técnica con Sharp: tamaño máximo indicado, WebP calidad 87, alphaQuality 100. Se preserva el alfa de las piezas escultóricas. No se retocan sus contenidos; el encuadre de las fotografías lo realiza CSS `object-fit` en la página.

Las fotografías son escenas generadas, no retratos de colaboradores, clientes o familias identificadas, ni testimonios. Las imágenes son decorativas en la interfaz y no contienen datos, afirmaciones o enlaces necesarios para entenderla.

## Prompts finales

### economia-perspectiva

`transparent_background: true`

```text
Use case: stylized-concept. Asset: central editorial artwork for an elegant Spanish educational economics website, connected to a wider art-gallery ecosystem. A single sculptural circular optical lens made from thick polished deep midnight-blue glass, held upright in a minimal champagne brushed metal gyroscopic frame, off-center intersecting rings with an airy open silhouette. A pale sky-blue glass disc adds layered refraction. This is a fine art studio still-life about looking carefully and understanding perspective. Three-quarter view, tactile glass and restrained metal, warm natural studio light, subtle shadow, exquisite photorealistic 3D, quietly spectacular. Square composition, generous margin, centered object 78% of frame, genuinely transparent background. No pedestal, no people, no text, numbers, charts, coins, logos or watermarks. No neon or futuristic tech interface.
```

### academia-ideas

`transparent_background: true`

```text
Use case: stylized-concept. Asset: playful yet sophisticated educational website hero artwork, for adults and families. Create a single carefully composed sculptural still-life: an elegantly folded thick ivory paper form like the sculptural fanned pages of an open book, one tall translucent pale ice-blue rounded arch rising through it, and one small deep midnight navy polished sphere resting nearby. The paper folds create rhythmic curves and have real tactile paper edges. A very subtle soft sage element can appear inside the arch. Warm art-gallery product photography, softly lit from upper left, beautiful material detail, curious but mature, visual metaphor for an open mind. Three-quarter angle. Square composition with generous margin, centered subject occupying 78%. Genuinely transparent background, no floor or horizon or pedestal. No written words, text, letters, numbers, logos, coins, screens, people or watermark.
```

### patrimonio-hogar

`transparent_background: false`

```text
Use case: photorealistic-natural. Asset: distinctive editorial photograph for a sophisticated Spanish family wealth education website, warm but not luxury marketing. A tranquil lived-in Mediterranean family dining room with light oak dining table, off-white linen chairs, an arched doorway leading to a sunlit garden. A mature woman about 60 and an adult woman about 35 sit together at the far side of the table in relaxed conversation, seen from a natural three-quarter side angle, warmly connected, not posing and not looking at camera. Casual natural clothing in muted cream and blue. A notebook and a ceramic bowl on the table, olive branches outside. Quiet afternoon sunlight, plaster walls with tactile texture, gentle shadows, editorial magazine photography, subtle grain, believable domestic intimacy, balanced professional composition. The room and architecture dominate, people in the middle distance. Vertical 4:5 composition, subjects centered enough for rounded arch crop, generous space above, camera at sitting eye level. No text, documents with visible writing, logos, banking symbols, money, charts, laptop, staged handshake or watermark.
```

### bienestar-paseo

`transparent_background: false`

```text
Use case: photorealistic-natural. Asset: quiet lifestyle editorial photograph for a Spanish family wellbeing educational website. A candid cinematic view of a mother around40 and an adult daughter around20 walking together along a sunny Mediterranean garden path, seen mostly from behind and slightly side-on, naturally talking, relaxed everyday linen and cotton clothing in cream and sage. Subtle affection, no posing, no looking at camera, no yoga or exercise pose. Dense green olive trees, soft meadow grasses and dappled morning light, outdoors with a real path receding toward the middle. Intimate and authentic, high-end travel editorial photography, gently warm true-to-life colors, soft film-like texture, with deep foliage greens and honey highlights. Horizontal 3:2 crop, people in the right half, scene airy, real natural light. No text, logos, health claims, screens, medical equipment, watermark or extra people.
```
