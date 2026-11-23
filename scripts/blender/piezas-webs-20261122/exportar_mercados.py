from PIL import Image
import numpy as np, os
def ventana(h, w, m):
    def eje(n):
        x = np.arange(n); d = np.minimum(x, n - 1 - x) / (n * m)
        d = np.clip(d, 0, 1); return d * d * (3 - 2 * d)
    return np.outer(eje(h), eje(w))
for p in ('reloj', 'barometro'):
    for v, sz in (('apaisada', (1000, 764)), ('cuadrada', (1000, 1000))):
        im = Image.open(f'render/{p}_{v}.png').convert('RGBA').resize(sz, Image.LANCZOS)
        a = np.array(im).astype(np.float32)
        al = a[:, :, 3] * ventana(sz[1], sz[0], 0.06)
        al[al < 3] = 0
        a[:, :, 3] = al
        out = Image.fromarray(a.astype(np.uint8), 'RGBA')
        f = f'webp/{p}_{v}.webp'
        out.save(f, quality=90, method=6)
        b = np.array(Image.open(f).convert('RGBA'))[:, :, 3]
        print(f, sz, os.path.getsize(f), 'alfa borde max', max(b[0].max(), b[-1].max(), b[:, 0].max(), b[:, -1].max()))
