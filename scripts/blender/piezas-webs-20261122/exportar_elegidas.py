"""Exporta las dos piezas elegidas a WebP de 1000 px con alfa.
En el ábaco se recorta el velo tenue que el suelo de sombra deja hasta los bordes."""
from PIL import Image
for n, out, black in (('globo', 'economia-mundo', 0), ('abaco', 'academia-abaco', 16)):
    im = Image.open(f'elegidas/{n}.png').convert('RGBA')
    if black:
        r, g, b, a = im.split()
        a = a.point(lambda v: 0 if v <= black else round((v - black) * 255 / (255 - black)))
        im = Image.merge('RGBA', (r, g, b, a))
    im = im.resize((1000, 1000), Image.LANCZOS)
    im.save(f'elegidas/{out}.webp', quality=90, method=6, exact=False)
    a = im.getchannel('A'); px = a.load()
    print(out, 'alfa en bordes:', max(max(px[x, 0], px[x, 999], px[0, x], px[999, x]) for x in range(1000)))
