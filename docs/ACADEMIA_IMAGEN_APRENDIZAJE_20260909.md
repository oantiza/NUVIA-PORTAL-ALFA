# Academia NUVIA · Fotografía de aprendizaje en familia

Fecha: 09-09-2026.

Solicitud: sustituir la imagen de Academia por una escena más representativa del aprendizaje, con la izquierda más oscura y una composición adecuada al banner panorámico.

La imagen muestra a dos generaciones aprendiendo juntas en casa con portátil, libro y cuaderno. La actividad se concentra a la derecha y el fondo de estudio queda en penumbra a la izquierda para alojar el texto HTML.

Archivo del portal: `src/assets/home/academia-aprender-en-familia-20260909.webp`.

Salida original definitiva: `C:/Users/oanti/.codex/generated_images/01a081d9-eeec-7931-9296-ec09b0c6426b/exec-cb87af34-af84-46e8-98c0-cc3e1197b092.png`. Conversión a WebP, calidad 88, 2172 × 724 píxeles, sin deformar ni recortar el archivo.

Creación: herramienta integrada `image_gen`, generación fotográfica original y dos revisiones del encuadre y la orientación del portátil. Las personas son ficticias. Las referencias encontradas en la búsqueda no se incorporan como archivos del portal.

Alcance: imagen decorativa de la portada interior de Academia y su encuadre. Se conservan texto, rutas, recursos y herramientas. El contenido no presenta asesoramiento ni servicios financieros; no se realizan escrituras de datos personales ni cambios de backend.

Validación final: render de Academia a 768, 1440, 2560 y 3840 px, sin fallos de contraste, estructura ni desbordamiento; compilación estática y prueba existente de banners correctas. Revisión visual en navegador y restauración del tamaño habitual al terminar.

Publicación autorizada por el fundador: «Súbela y publica». Canal: GitHub Pages del repositorio oficial NUVIA-PORTAL-ALFA, mediante el flujo de compilación y despliegue de `dist/`.

## Prompt de generación

```text
Use case: photorealistic-natural.
Asset type: an ultra-wide photographic hero background for Academia NUVIA, a Spanish educational portal where families learn to understand money, concepts and long-term decisions at their own pace. Generate a BRAND NEW scene, not a website screenshot.
Primary request: a premium, convincing editorial photograph of learning together at home. On the RIGHT side, a mother around 45 and her young adult daughter around 22 sit side by side at a walnut desk, thoughtfully following an online lesson on a laptop and writing in an open notebook. Both look engaged and relaxed, focused on learning, not posing or looking at the camera. One person holds a pen naturally and writes; the other watches the laptop. Casual understated navy, ivory and muted olive clothing. Anatomically realistic hands, faces, posture.
Scene/backdrop: a contemporary lived-in study, elegant but approachable. Muted deep blue wall, dark timber shelving with a few unfussy books, subtle textured plaster, a warm reading light near the learners. On the laptop, a softly defocused educational lesson with a small lecturer thumbnail and a simple conceptual diagram, with NO readable text and NO trading dashboard. A notebook and one open reference book, nothing cluttered. No glass office, no banking consultation.
Composition: create a TRUE 3:1 panoramic photograph, around 3072x1024 or equivalent wide aspect ratio. Camera pulled back with a natural 35mm editorial perspective. Leave the LEFT 52% visually quiet, naturally dark blue shaded study wall and discreet shelving texture, ideal for later white HTML text. No people or bright lamps/windows in the left half. Keep BOTH people and the full laptop/notebook activity clustered between x=62% and x=87%. Essential heads, faces, hands, laptop screen and notebook must ALL fit in the middle vertical safe band y=30% to 70%, because this image will also be cropped into an extremely shallow 6.4:1 desktop hero. The top and bottom quarters are expendable room and desk foreground, with no essential subjects. Avoid making people huge, tight portrait crop, or placing heads near the upper edge.
Lighting: naturally dark left half, becoming gently illuminated toward the right. Warm soft side light on skin and notebook, cool navy shadows, real photographic detail retained. The right side should feel inviting and bright enough to see faces, but no blown highlights. Left darkness must arise from the room lighting, not an opaque painted panel. Seamless room and continuous perspective across the whole width.
Quality: high-end natural photographic realism, subtle film texture, believable human moment, precise materials, balanced sophisticated colors. No exaggerated smiles, no glossy stock-photo handshake, no oversized academic props.
Constraints: no typography, no visible labels, no brand/logo, no watermark, no financial recommendations, no money symbols, no floating graphics, no mortarboards, no diplomas, no artificial vignette or gradient overlay, no collage or seams.
```

## Prompt de ajuste

```text
Edit the reference image, preserving the same two women, their faces, clothing, warm/cool natural lighting, dark navy study on the left, library, desk, and overall realistic photographic style. This is the edit target. Improve ONLY the photographic framing and physical placement of the laptop for an ultra-wide website hero.

1. Pull the camera back substantially and slightly upward so the whole learning group is about 30% smaller within the scene. Place the complete heads, hands, laptop and notebook in a compact group on the right, between x=62% and x=88%, and strictly inside y=28% to y=72% of the 3:1 image. Add real uninterrupted room above and desk/room foreground below. The women's heads must NOT start near the top edge: at least 28% of image height must exist above the top of their hair. The notebook and laptop base must remain above 72% of image height. This safe band is essential so cropping from 3:1 to 6.4:1 leaves their faces, hands and learning materials visible.
2. Correct the laptop orientation: its screen must face the two women as they learn, and its plain matte dark BACK lid, with NO logo, must face the camera. The camera must NOT see a screen drawn on the outside back of the lid. Physically accurate single hinge, keyboard on the learners' side, no duplicate laptops.
Keep the adult daughter writing naturally with a pen in the notebook and the mother quietly studying alongside her. Preserve the warm lamp lighting from the right and naturally dark quiet left half. Keep left 52% mostly dark navy textured study wall for white website text. Continuous real photo, no panels, no added overlay, no letters or watermark. Output a 3:1 panorama at high resolution.
```

## Ajuste para pantallas muy anchas

La revisión a 2560 px detectó que el recorte se acercaba demasiado a las cabezas. Se solicitó ampliar el entorno fotográfico y reducir la escala del grupo, conservando la altura del banner.

```text
Edit target: the provided panoramic study photograph. Preserve this exact scene, the two women's identities, real lighting, dark left wall, furniture and correctly oriented laptop. Change ONLY the camera framing, pulling back by a further 35 percent while keeping the learning group on the right. This is for a shallow website banner and the current version still cuts the tops of heads when rendered on a wide monitor.

CRITICAL GEOMETRY: output 3:1. Imagine a horizontal strip from y=34% to y=65% of the full output. The top of BOTH women's hair, their faces, shoulders, hands, the entire notebook and the entire laptop must ALL be INSIDE that strip. The whole important learning activity must be scaled down to fit this middle 31% band, with clear empty room above and additional desk foreground below. Hair top MUST be at y=34% or lower, not y=25%. Do not zoom in to fill the height. Both women's heads must be complete, naturally proportioned and smaller than in the input. Group the action in x=64% to x=86%, with dark quiet unoccupied room to the left. Keep the mother and young adult daughter visibly learning together, not looking at the camera. Expand the actual photographed room naturally, with continuous architecture and materials. The camera sees the blank matte outside of the laptop lid and it faces the two learners correctly. No text, brands, logos, watermark, split panels or painted gradients. Natural high-end editorial photograph.
```
