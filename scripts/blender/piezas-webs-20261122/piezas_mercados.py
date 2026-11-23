"""Piezas escultóricas para las portadas de Economía y Academia de NUVIA.

Uso:
  blender -b --factory-startup -P piezas.py -- <pieza> <salida.png> <lado_px> <muestras> [guardar.blend]

Piezas de Economía:  globo · columnas · engranajes
Piezas de Academia:  abaco · libros · bloques

Materiales compartidos con la escultura de la portada: vidrio azul profundo (Economía),
bronce cepillado (Patrimonio), vidrio verde esmerilado (Bienestar) y vidrio azul claro (Academia).
"""
import os
import sys
from math import radians, sin, cos, pi

import bpy
import bmesh
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
PIEZA, OUT, SIDE, SAMPLES = argv[0], os.path.abspath(argv[1]), int(argv[2]), int(argv[3])
RATIO = float(os.environ.get('RATIO', '1.0'))
BLEND = os.path.abspath(argv[4]) if len(argv) > 4 and argv[4] != '-' else None

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
OBJS = []


# ───────────────────────── materiales ─────────────────────────
def principled(name, **kw):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    b = mat.node_tree.nodes['Principled BSDF']
    for k, v in kw.items():
        if k in b.inputs:
            b.inputs[k].default_value = v
        else:
            print('AVISO: sin entrada', k)
    return mat


def glass(name, color, density, rough=0.07, ior=1.5, scatter=0.0):
    """Vidrio macizo: transmisión con absorción en volumen. Los rayos de sombra lo
    atraviesan teñidos, para que ilumine lo que tiene detrás sin cáusticas ruidosas."""
    mat = principled(name, **{'Base Color': (1, 1, 1, 1), 'Roughness': rough, 'IOR': ior,
                              'Transmission Weight': 1.0, 'Specular IOR Level': 0.5})
    nt = mat.node_tree
    b = nt.nodes['Principled BSDF']
    out = nt.nodes['Material Output']
    vol = nt.nodes.new('ShaderNodeVolumeAbsorption')
    vol.inputs['Color'].default_value = (*color, 1)
    vol.inputs['Density'].default_value = density
    if scatter > 0:
        sca = nt.nodes.new('ShaderNodeVolumeScatter')
        sca.inputs['Color'].default_value = (*[min(1.0, c * 1.5 + 0.1) for c in color], 1)
        sca.inputs['Density'].default_value = density * scatter
        add = nt.nodes.new('ShaderNodeAddShader')
        nt.links.new(vol.outputs[0], add.inputs[0])
        nt.links.new(sca.outputs[0], add.inputs[1])
        nt.links.new(add.outputs[0], out.inputs['Volume'])
    else:
        nt.links.new(vol.outputs[0], out.inputs['Volume'])
    lp = nt.nodes.new('ShaderNodeLightPath')
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    tr.inputs['Color'].default_value = (0.93, 0.93, 0.93, 1)
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Shadow Ray'], mix.inputs['Fac'])
    nt.links.new(b.outputs['BSDF'], mix.inputs[1])
    nt.links.new(tr.outputs['BSDF'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    return mat


NAVY = (0.03, 0.26, 0.72)     # azul profundo de Economía
SKY = (0.55, 0.78, 0.97)      # azul claro de Academia
GREEN = (0.42, 0.70, 0.40)    # verde de Bienestar


def navy(density, rough=0.07):
    return glass('Vidrio_azul_profundo', NAVY, density, rough)


def sky(density, rough=0.10):
    return glass('Vidrio_azul_claro', SKY, density, rough, scatter=0.12)


def green(density, rough=0.26):
    return glass('Vidrio_verde_esmerilado', GREEN, density, rough, scatter=0.45)


def grain(mat, scale, strength, distance=0.002):
    nt = mat.node_tree
    b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = scale
    noise.inputs['Detail'].default_value = 4.0
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = strength
    bump.inputs['Distance'].default_value = distance
    nt.links.new(tc.outputs['Object'], noise.inputs['Vector'])
    nt.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return mat


def metal(name, color, rough=0.28, aniso=0.0):
    mat = principled(name, **{'Base Color': (*color, 1), 'Metallic': 1.0, 'Roughness': rough,
                              'Anisotropic': aniso, 'Coat Weight': 0.12, 'Coat Roughness': 0.18})
    return grain(mat, 420.0, 0.035)


def gold(rough=0.24, aniso=0.0):
    return metal('Oro_champan_cepillado', (0.88, 0.63, 0.29), rough, aniso)


def bronze(rough=0.33, aniso=0.0):
    return metal('Bronce_cepillado', (0.66, 0.47, 0.27), rough, aniso)


def matte(name, color, rough=0.62, scale=260.0, strength=0.10):
    """Superficie mate (laca, tela) con un grano fino."""
    mat = principled(name, **{'Base Color': (*color, 1), 'Roughness': rough, 'Sheen Weight': 0.3,
                              'Sheen Roughness': 0.5, 'Specular IOR Level': 0.35})
    return grain(mat, scale, strength, 0.003)


def ivory():
    return matte('Marfil_mate', (0.80, 0.74, 0.61), 0.52)


def wood(axis):
    """Madera clara barnizada, con la veta a lo largo del eje indicado."""
    mat = principled('Madera_clara_' + axis, **{'Roughness': 0.42, 'Coat Weight': 0.18, 'Coat Roughness': 0.22,
                                               'Specular IOR Level': 0.4})
    nt = mat.node_tree
    b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = tuple(0.10 if a == axis else 2.4 for a in 'XYZ')
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 7.0
    noise.inputs['Detail'].default_value = 9.0
    noise.inputs['Roughness'].default_value = 0.68
    noise.inputs['Distortion'].default_value = 1.4
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.34
    ramp.color_ramp.elements[0].color = (0.50, 0.34, 0.19, 1)
    ramp.color_ramp.elements[1].position = 0.70
    ramp.color_ramp.elements[1].color = (0.76, 0.59, 0.38, 1)
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.06
    bump.inputs['Distance'].default_value = 0.004
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], noise.inputs['Vector'])
    nt.links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    nt.links.new(noise.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return mat


def pages():
    """Canto de las páginas: bandas finas horizontales."""
    mat = principled('Paginas', **{'Roughness': 0.7})
    nt = mat.node_tree
    b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    wave = nt.nodes.new('ShaderNodeTexWave')
    wave.wave_type = 'BANDS'
    wave.bands_direction = 'Z'
    wave.inputs['Scale'].default_value = 46.0
    wave.inputs['Distortion'].default_value = 0.6
    wave.inputs['Detail'].default_value = 1.0
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.35
    bump.inputs['Distance'].default_value = 0.003
    ramp = nt.nodes.new('ShaderNodeMixRGB')
    ramp.inputs['Color1'].default_value = (0.66, 0.60, 0.48, 1)
    ramp.inputs['Color2'].default_value = (0.86, 0.81, 0.69, 1)
    nt.links.new(tc.outputs['Object'], wave.inputs['Vector'])
    nt.links.new(wave.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(wave.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return mat


# ───────────────────────── geometría ─────────────────────────
def empty(name, loc=(0, 0, 0), rot=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None)
    scene.collection.objects.link(e)
    e.location = loc
    e.rotation_euler = rot
    if parent:
        e.parent = parent
    return e


def add_bevel(ob, width, seg, angle=40.0):
    m = ob.modifiers.new('Bisel', 'BEVEL')
    m.width = width
    m.segments = seg
    m.limit_method = 'ANGLE'
    m.angle_limit = radians(angle)
    w = ob.modifiers.new('Normales', 'WEIGHTED_NORMAL')
    w.keep_sharp = False
    w.weight = 60


def finish(name, bm, mat, bevel=None, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, angle=40.0, piece=True):
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = rot
    if mat:
        me.materials.append(mat)
    if bevel:
        add_bevel(ob, bevel[0], bevel[1], angle)
    if parent:
        ob.parent = parent
    if piece:
        OBJS.append(ob)
    return ob


def box(name, size, mat, bevel=(0.02, 4), **kw):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    return finish(name, bm, mat, bevel=bevel, **kw)


def cyl(name, r, h, mat, seg=96, bevel=None, r2=None, **kw):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg,
                          radius1=r, radius2=r if r2 is None else r2, depth=h)
    return finish(name, bm, mat, bevel=bevel, **kw)


def sphere(name, r, mat, **kw):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=128, v_segments=64, radius=r)
    return finish(name, bm, mat, **kw)


def rod(name, p1, p2, r, mat, seg=24, bevel=None, parent=None):
    p1, p2 = Vector(p1), Vector(p2)
    d = p2 - p1
    ob = cyl(name, r, d.length, mat, seg=seg, bevel=bevel, parent=parent)
    ob.location = (p1 + p2) / 2
    ob.rotation_mode = 'QUATERNION'
    ob.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
    return ob


def lathe(name, prof, mat, seg=160, closed=False, **kw):
    """Revolución alrededor de Z de un perfil [(r, z)]."""
    bm = bmesh.new()
    rings = []
    for r, z in prof:
        if r < 1e-6:
            rings.append([bm.verts.new((0, 0, z))])
        else:
            rings.append([bm.verts.new((r * cos(2 * pi * j / seg), r * sin(2 * pi * j / seg), z)) for j in range(seg)])
    n = len(prof)
    for i in (range(n) if closed else range(n - 1)):
        a, b = rings[i], rings[(i + 1) % n]
        for j in range(seg):
            j2 = (j + 1) % seg
            if len(a) == 1 and len(b) == 1:
                continue
            if len(a) == 1:
                bm.faces.new((a[0], b[j], b[j2]))
            elif len(b) == 1:
                bm.faces.new((a[j], b[0], a[j2]))
            else:
                bm.faces.new((a[j], b[j], b[j2], a[j2]))
    return finish(name, bm, mat, **kw)


def rounded_rect(w, t, rc, n_arc=8):
    hw, ht = w / 2, t / 2
    rc = min(rc, hw * 0.98, ht * 0.98)
    pts = []
    for cx, cy, a0 in [(hw - rc, ht - rc, 0), (-hw + rc, ht - rc, 90), (-hw + rc, -ht + rc, 180), (hw - rc, -ht + rc, 270)]:
        for k in range(n_arc + 1):
            a = radians(a0 + 90 * k / n_arc)
            pts.append((cx + rc * cos(a), cy + rc * sin(a)))
    return pts


def torus(name, R, r, mat, seg=200, **kw):
    prof = [(R + r * cos(2 * pi * k / 20), r * sin(2 * pi * k / 20)) for k in range(20)]
    return lathe(name, prof, mat, seg=seg, closed=True, **kw)


def band(name, R, w_radial, h_axial, mat, seg=220, **kw):
    """Aro de sección rectangular redondeada."""
    prof = [(R + p, q) for p, q in rounded_rect(w_radial, h_axial, min(w_radial, h_axial) * 0.45)]
    return lathe(name, prof, mat, seg=seg, closed=True, **kw)


def prism(name, outline, depth, mat, bevel=(0.015, 4), **kw):
    """Extrusión en Y de un contorno [(x, z)]."""
    bm = bmesh.new()
    front = [bm.verts.new((x, -depth / 2, z)) for x, z in outline]
    back = [bm.verts.new((x, depth / 2, z)) for x, z in outline]
    f1 = bm.faces.new(front)
    f2 = bm.faces.new(list(reversed(back)))
    n = len(outline)
    for i in range(n):
        bm.faces.new((front[i], front[(i + 1) % n], back[(i + 1) % n], back[i]))
    bmesh.ops.triangulate(bm, faces=[f1, f2], ngon_method='EAR_CLIP')
    return finish(name, bm, mat, bevel=bevel, **kw)


def gear(name, N, m, thick, mat, phase=0.0, bore=0.07, web=0.5, holes=0, bevel=(0.01, 3), loc=(0, 0, 0)):
    """Rueda dentada en el plano XZ (eje Y): corona gruesa, alma fina calada y cubo."""
    R = N * m / 2
    ra, rf, p = R + m, R - 1.25 * m, 2 * pi / N
    fr = [-0.5, -0.40, -0.30, -0.235, -0.16, -0.08, 0.0, 0.08, 0.16, 0.235, 0.30, 0.40]
    rr = [rf, rf, rf, R, ra, ra, ra, ra, ra, R, rf, rf]
    angs, outer = [], []
    for k in range(N):
        for f, r in zip(fr, rr):
            angs.append(phase + (k + f) * p)
            outer.append(r)
    M = len(angs)
    ht = thick / 2
    r_rim = rf - 0.10 * R - 0.2 * m
    r_hub = max(bore * 2.4, 0.24 * R)
    st = [(None, ht), (rf - 0.3 * m, ht), (r_rim, ht), (r_rim - 0.035, ht * web),
          (r_hub + 0.035, ht * web), (r_hub, ht * 1.12), (bore, ht * 1.12)]
    bm = bmesh.new()
    loops = {}
    for s in (1, -1):
        L = []
        for r, h in st:
            L.append([bm.verts.new(((outer[j] if r is None else r) * cos(angs[j]), -s * h,
                                    (outer[j] if r is None else r) * sin(angs[j]))) for j in range(M)])
        loops[s] = L
        for i in range(len(st) - 1):
            for j in range(M):
                j2 = (j + 1) % M
                bm.faces.new((L[i][j], L[i][j2], L[i + 1][j2], L[i + 1][j]))
    for j in range(M):
        j2 = (j + 1) % M
        bm.faces.new((loops[1][0][j], loops[1][0][j2], loops[-1][0][j2], loops[-1][0][j]))
        bm.faces.new((loops[1][-1][j], loops[1][-1][j2], loops[-1][-1][j2], loops[-1][-1][j]))
    ob = finish(name, bm, mat, loc=loc)
    if holes:
        a0, a1 = r_hub + 0.035, r_rim - 0.035
        rh = min((a1 - a0) / 2 - 0.035, pi * (a0 + a1) / 2 / holes * 0.62)
        cb = bmesh.new()
        for k in range(holes):
            ang = phase + 2 * pi * (k + 0.5) / holes
            res = bmesh.ops.create_cone(cb, cap_ends=True, cap_tris=False, segments=64,
                                        radius1=rh, radius2=rh, depth=thick * 2)
            c = Vector(((a0 + a1) / 2 * cos(ang), 0, (a0 + a1) / 2 * sin(ang)))
            for v in res['verts']:
                v.co = Vector((v.co.x, v.co.z, v.co.y)) + c
        cutter = finish(name + '_calado', cb, None, loc=loc, piece=False)
        cutter.hide_render = True
        cutter.display_type = 'WIRE'
        bo = ob.modifiers.new('Calado', 'BOOLEAN')
        bo.operation = 'DIFFERENCE'
        bo.object = cutter
        bo.solver = 'EXACT'
    add_bevel(ob, bevel[0], bevel[1])
    return ob


def mesh_phase(theta, ph_a, Na, Nb):
    """Fase de la rueda B para engranar con A, que queda en la dirección theta vista desde A."""
    pa, pb = 2 * pi / Na, 2 * pi / Nb
    f = ((theta - ph_a) % pa) / pa
    return theta + pi - ((0.5 - f) % 1.0) * pb


# ───────────────────────── piezas de Economía ─────────────────────────
def pieza_globo():
    """El mundo: esfera de vidrio azul con su retícula de meridianos y una órbita."""
    R = 1.0
    eje = empty('Eje_del_mundo', rot=(radians(-12), radians(-23.4), 0))
    g = gold(0.24, 0.4)
    sphere('Mundo', R, navy(1.85, 0.05), parent=eje)
    for k in range(6):
        torus('Meridiano_%d' % k, R + 0.003, 0.0115, g, rot=(radians(90), 0, radians(30 * k)), parent=eje)
    for lat in (-60, -30, 30, 60):
        torus('Paralelo_%d' % lat, R * cos(radians(lat)) + 0.003, 0.0115, g,
              loc=(0, 0, R * sin(radians(lat))), parent=eje)
    band('Ecuador', R + 0.006, 0.02, 0.05, g, parent=eje)
    for s in (1, -1):
        cyl('Casquete', 0.085, 0.05, g, bevel=(0.012, 4), loc=(0, 0, s * (R + 0.012)), parent=eje)
        sphere('Remate', 0.052, g, loc=(0, 0, s * (R + 0.27)), parent=eje)
    cyl('Eje', 0.021, 2 * R + 0.54, g, seg=32, parent=eje)
    orbita = empty('Orbita', rot=(radians(66), radians(10), radians(24)))
    band('Aro_orbita', 1.40, 0.046, 0.115, g, parent=orbita)
    a = radians(238)
    sphere('Satelite', 0.15, sky(5.0, 0.05), loc=(1.40 * cos(a), 1.40 * sin(a), 0), parent=orbita)
    return dict(az=-24, el=12, ground=None, margin=0.93)


def pieza_columnas():
    """Los mercados: columnas de vidrio de alturas distintas y la línea que las une."""
    heights = [1.20, 1.70, 0.95, 1.96, 1.45]
    a, gap = 0.44, 0.15
    total = len(heights) * a + (len(heights) - 1) * gap
    hp = 0.08
    g = gold(0.24)
    box('Peana', (total + 0.46, a + 0.46, hp), bronze(0.34), bevel=(0.022, 5), loc=(0, 0, hp / 2))
    mats = [navy(8.5), navy(8.5), sky(5.5, 0.08), navy(8.5), navy(8.5)]
    nodes = []
    for i, h in enumerate(heights):
        x = -total / 2 + a / 2 + i * (a + gap)
        z0 = hp + 0.003
        box('Columna_%d' % (i + 1), (a, a, h), mats[i], bevel=(0.04, 6), loc=(x, 0, z0 + h / 2))
        top = z0 + h
        node = Vector((x, 0, top + 0.27))
        rod('Vastago_%d' % (i + 1), (x, 0, top + 0.002), node, 0.007, g, seg=16)
        sphere('Nodo_%d' % (i + 1), 0.058, g, loc=node)
        nodes.append(node)
    for i in range(len(nodes) - 1):
        rod('Tramo_%d' % (i + 1), nodes[i], nodes[i + 1], 0.015, g, seg=20)
    return dict(az=-31, el=13, ground=0.0)


def pieza_columnas_ancha():
    """Mercados, versión apaisada: siete columnas más finas y una peana larga."""
    heights = [0.80, 1.15, 0.95, 1.45, 1.20, 1.80, 1.55]
    a, gap = 0.34, 0.14
    total = len(heights) * a + (len(heights) - 1) * gap
    hp = 0.07
    g = gold(0.24)
    box('Peana', (total + 0.46, a + 0.40, hp), bronze(0.34), bevel=(0.02, 5), loc=(0, 0, hp / 2))
    nodes = []
    for i, h in enumerate(heights):
        x = -total / 2 + a / 2 + i * (a + gap)
        mat = sky(5.5, 0.08) if i == 3 else navy(8.5)
        z0 = hp + 0.003
        box('Columna_%d' % (i + 1), (a, a, h), mat, bevel=(0.035, 6), loc=(x, 0, z0 + h / 2))
        top = z0 + h
        node = Vector((x, 0, top + 0.22))
        rod('Vastago_%d' % (i + 1), (x, 0, top + 0.002), node, 0.006, g, seg=16)
        sphere('Nodo_%d' % (i + 1), 0.048, g, loc=node)
        nodes.append(node)
    for i in range(len(nodes) - 1):
        rod('Tramo_%d' % (i + 1), nodes[i], nodes[i + 1], 0.012, g, seg=20)
    return dict(az=-22, el=10, ground=0.0, margin=0.86)


def pieza_noticias():
    """Mercados y noticias: tres hojas de vidrio en abanico (la prensa) junto a columnas y su línea."""
    g = gold(0.24)
    hp = 0.07
    heights = [0.70, 1.00, 0.85, 1.30, 1.55]
    a, gap = 0.32, 0.13
    x0 = 0.28
    total = len(heights) * a + (len(heights) - 1) * gap
    W = x0 + total + 0.30 + 1.30
    box('Peana', (4.05, 0.95, hp), bronze(0.34), bevel=(0.02, 5), loc=(0.62, 0, hp / 2))
    nodes = []
    for i, h in enumerate(heights):
        x = x0 + a / 2 + i * (a + gap)
        mat = sky(5.5, 0.08) if i == 2 else navy(8.5)
        box('Columna_%d' % (i + 1), (a, a, h), mat, bevel=(0.035, 6), loc=(x, 0.05, hp + 0.003 + h / 2))
        top = hp + 0.003 + h
        node = Vector((x, 0.05, top + 0.2))
        rod('Vastago_%d' % (i + 1), (x, 0.05, top + 0.002), node, 0.006, g, seg=16)
        sphere('Nodo_%d' % (i + 1), 0.046, g, loc=node)
        nodes.append(node)
    for i in range(len(nodes) - 1):
        rod('Tramo_%d' % (i + 1), nodes[i], nodes[i + 1], 0.012, g, seg=20)
    # la prensa: tres hojas de vidrio de alturas y giros distintos
    for k, (rz, dx, hh, mat) in enumerate([(24, -1.12, 1.15, navy(30, 0.06)), (4, -0.76, 1.45, sky(22, 0.08)), (-18, -0.40, 1.25, navy(30, 0.06))]):
        box('Hoja_%d' % (k + 1), (0.62, 0.05, hh), mat, bevel=(0.012, 4), loc=(dx, -0.05 * k, hp + 0.003 + hh / 2), rot=(0, 0, radians(rz)))
        for r_ in range(3):   # renglones de texto: filetes dorados finos
            zz = hp + 0.003 + hh * (0.62 - 0.12 * r_)
            box('Renglon_%d_%d' % (k + 1, r_), (0.38 - 0.06 * r_, 0.058, 0.014), g, bevel=(0.004, 2),
                loc=(dx, -0.05 * k, zz), rot=(0, 0, radians(rz)))
    return dict(az=-20, el=10, ground=0.0, margin=0.86)


# ───────────────────────── Mercados: reloj de arena y barómetro ─────────────────────────
def lamina(name, outline, thick, mat, bevel=(0.004, 3), **kw):
    """Lámina plana en XY, de espesor thick (en Z), con el contorno [(x, y)]."""
    bm = bmesh.new()
    top = [bm.verts.new((x, y, thick / 2)) for x, y in outline]
    bot = [bm.verts.new((x, y, -thick / 2)) for x, y in outline]
    f1 = bm.faces.new(top)
    f2 = bm.faces.new(list(reversed(bot)))
    n = len(outline)
    for i in range(n):
        bm.faces.new((top[i], bot[i], bot[(i + 1) % n], top[(i + 1) % n]))
    bmesh.ops.triangulate(bm, faces=[f1, f2], ngon_method='EAR_CLIP')
    return finish(name, bm, mat, bevel=bevel, **kw)


def sector(name, r0, r1, a0, a1, h, mat, n=48, **kw):
    """Sector de corona circular en XY (ángulos en grados, desde +Y en sentido horario)."""
    bm = bmesh.new()
    angs = [radians(a0 + (a1 - a0) * k / n) for k in range(n + 1)]
    def v(r, a, z):
        return bm.verts.new((r * sin(a), r * cos(a), z))
    ot = [v(r1, a, h / 2) for a in angs]
    it = [v(r0, a, h / 2) for a in angs]
    ob_ = [v(r1, a, -h / 2) for a in angs]
    ib = [v(r0, a, -h / 2) for a in angs]
    for k in range(n):
        bm.faces.new((ot[k], it[k], it[k + 1], ot[k + 1]))
        bm.faces.new((ob_[k], ob_[k + 1], ib[k + 1], ib[k]))
        bm.faces.new((ot[k], ot[k + 1], ob_[k + 1], ob_[k]))
        bm.faces.new((it[k], ib[k], ib[k + 1], it[k + 1]))
    bm.faces.new((ot[0], ob_[0], ib[0], it[0]))
    bm.faces.new((ot[n], it[n], ib[n], ob_[n]))
    return finish(name, bm, mat, bevel=(0.004, 2), **kw)


def pieza_reloj():
    """Reloj de arena: dos bulbos de vidrio azul, armazón de oro y arena a media caída."""
    g = gold(0.24, 0.4)
    sand = matte('Arena_azul', (0.02, 0.10, 0.46), 0.34, 900.0, 0.15)
    sb = sand.node_tree.nodes['Principled BSDF']
    sb.inputs['Coat Weight'].default_value = 0.35
    sb.inputs['Coat Roughness'].default_value = 0.25
    Hb, R, rn, w = 1.0, 0.50, 0.075, 0.034
    T = 0.93
    def r_out(z):
        t = min(abs(z) / Hb, T)
        return rn + (R - rn) * sin(pi * t ** 1.27) ** 0.85
    def r_in(z):
        return max(r_out(z) - w, 0.042)
    N = 64
    zs = [T * Hb * k / N for k in range(N + 1)]
    up_out = [(r_out(z), z) for z in reversed(zs)]            # arriba -> cuello
    lo_out = [(r_out(z), -z) for z in zs[1:]]                 # cuello -> abajo
    lo_in = [(r_in(z), -z) for z in reversed(zs)]             # abajo -> cuello
    up_in = [(r_in(z), z) for z in zs[1:]]                    # cuello -> arriba
    glass_mat = glass('Vidrio_azul_claro', SKY, 30.0, 0.03)
    lathe('Bulbos', up_out + lo_out + lo_in + up_in, glass_mat, seg=200, closed=True, bevel=None)
    # arena
    zsand = 0.50
    prof = [(0.0, 0.012)] + [(r_in(z) - 0.007, z) for z in [0.012 + (zsand - 0.012) * k / 30 for k in range(31)]]
    rw = r_in(zsand) - 0.007
    prof += [(rw * (1 - k / 10.0), zsand - 0.15 * (1 - (1 - k / 10.0) ** 2)) for k in range(1, 11)]
    lathe('Arena_arriba', prof, sand, seg=160)
    z_e = -0.60
    r_e = r_in(z_e) - 0.007
    peak = z_e + r_e * 0.62
    prof = [(0.0, peak)] + [(r_e * k / 12.0, peak - (peak - z_e) * (k / 12.0) ** 1.15) for k in range(1, 13)]
    prof += [(r_in(z) - 0.007, z) for z in [z_e - (T * Hb - 0.6 - 0.01) * k / 20 for k in range(1, 21)]]
    prof += [(0.0, -T * Hb + 0.012)]
    lathe('Arena_abajo', prof, sand, seg=160)
    cyl('Hilo_de_arena', 0.0125, 0.03 - peak, sand, seg=24, loc=(0, 0, (peak + 0.03) / 2))
    # armazón
    Rp, Rpl = 0.66, 0.84
    for sgn, nm in ((1, 'Tapa_superior'), (-1, 'Tapa_inferior')):
        zc = sgn * (T * Hb + 0.055)
        cyl(nm, Rpl, 0.11, g, seg=160, bevel=(0.028, 6), loc=(0, 0, zc))
        torus('Aro_' + nm, Rpl - 0.13, 0.012, g, loc=(0, 0, zc + sgn * 0.058))
        cyl('Moldura_' + nm, Rpl * 0.62, 0.035, g, seg=128, bevel=(0.012, 4), loc=(0, 0, zc + sgn * 0.085))
    for k, ang in enumerate((90, 210, 330)):
        x, y = Rp * cos(radians(ang)), Rp * sin(radians(ang))
        rod('Varilla_%d' % k, (x, y, -1.07), (x, y, 1.07), 0.030, g, seg=40)
        for sgn in (1, -1):
            sphere('Remate_%d_%d' % (k, sgn), 0.052, g, loc=(x, y, sgn * 1.105))
        cyl('Collar_%d' % k, 0.05, 0.035, g, seg=40, bevel=(0.008, 3), loc=(x, y, 0.0))
        sphere('Pie_%d' % k, 0.072, g, loc=(x * 0.92, y * 0.92, -1.185 - 0.0))
    sphere('Perla_azul', 0.095, sky(7.0, 0.05), loc=(0, 0, 1.175))
    return dict(az=-26, el=9, ground=-1.185 - 0.072, margin=0.90)


def pieza_barometro():
    """Barómetro de sobremesa: esfera de vidrio azul, escala sin cifras y aguja en el centro del recorrido."""
    g = gold(0.24, 0.4)
    br = bronze(0.33)
    base_h = 0.085
    cyl('Base', 0.66, base_h, br, seg=160, bevel=(0.028, 6), loc=(0, 0, base_h / 2))
    torus('Aro_base', 0.30, 0.016, g, loc=(0, 0, base_h + 0.004))
    cyl('Cuello', 0.105, 0.42, br, seg=64, bevel=(0.012, 4), loc=(0, 0, base_h + 0.18))
    torus('Collar', 0.108, 0.026, g, loc=(0, 0, base_h + 0.07))
    zc = 1.62
    fa = empty('Esfera', loc=(0, 0, zc), rot=(radians(84), 0, 0))
    cyl('Caja', 1.14, 0.30, br, seg=200, bevel=(0.045, 7), loc=(0, 0, -0.15), parent=fa)
    band('Bisel', 1.065, 0.17, 0.22, g, seg=240, loc=(0, 0, 0.06), parent=fa)
    torus('Bisel_perla', 1.15, 0.014, g, seg=240, loc=(0, 0, 0.0), parent=fa)
    cyl('Fondo_marfil', 0.985, 0.02, matte('Fondo_claro', (0.95, 0.93, 0.86), 0.5), seg=200, loc=(0, 0, -0.02), parent=fa)
    cyl('Esfera_vidrio', 0.985, 0.10, navy(11.0, 0.05), seg=200, loc=(0, 0, 0.04), parent=fa)
    zt = 0.0955
    for i in range(61):
        a = -135 + 4.5 * i
        major = i % 5 == 0
        ln, rc = (0.15, 0.835) if major else (0.075, 0.87)
        box('Marca_%d' % i, (0.018 if major else 0.011, ln, 0.012), g, bevel=(0.003, 2),
            loc=(rc * sin(radians(a)), rc * cos(radians(a)), zt), rot=(0, 0, -radians(a)), parent=fa)
    torus('Anillo_exterior', 0.945, 0.007, g, seg=200, loc=(0, 0, zt), parent=fa)
    torus('Anillo_medio', 0.60, 0.006, g, seg=200, loc=(0, 0, zt), parent=fa)
    torus('Anillo_interior', 0.27, 0.007, g, seg=160, loc=(0, 0, zt), parent=fa)
    sector('Zona_azul_claro', 0.64, 0.76, -24, 24, 0.022, matte('Esmalte_azul_claro', (0.55, 0.78, 0.97), 0.3), loc=(0, 0, 0.096), parent=fa)
    ref = empty('Aguja_de_referencia', loc=(0, 0, 0.118), rot=(0, 0, -radians(-52)), parent=fa)
    lamina('Referencia', [(0, 0.66), (0.010, 0.52), (0.013, 0.0), (-0.013, 0.0), (-0.010, 0.52)], 0.012, br, parent=ref)
    sphere('Referencia_perla', 0.026, br, loc=(0, 0.69, 0), parent=ref)
    ag = empty('Aguja', loc=(0, 0, 0.148), rot=(0, 0, -radians(9)), parent=fa)
    lamina('Aguja_hoja', [(0, 0.80), (0.014, 0.58), (0.022, 0.20), (0.020, -0.02), (0.012, -0.10), (-0.012, -0.10),
                          (-0.020, -0.02), (-0.022, 0.20), (-0.014, 0.58)], 0.016, g, bevel=(0.004, 3), parent=ag)
    torus('Aguja_contrapeso', 0.052, 0.012, g, loc=(0, -0.20, 0), parent=ag)
    cyl('Eje_central', 0.085, 0.07, g, seg=96, bevel=(0.012, 4), loc=(0, 0, 0.145), parent=fa)
    sphere('Perla_central', 0.052, sky(6.0, 0.05), loc=(0, 0, 0.185), parent=fa)
    # cubierta de vidrio abombada (casquete delgado)
    Rc, rb, z0, wall = 2.7, 0.985, 0.13, 0.022
    def cap(rr, k, off):
        a = rb / 1.0
        return (rr, z0 + (Rc - (Rc ** 2 - rr ** 2) ** 0.5) + off)
    rs = [rb * (1 - k / 40.0) for k in range(41)]
    outer = [cap(r, 0, 0) for r in rs]
    inner = [cap(r, 0, -wall) for r in reversed(rs)]
    lathe('Cubierta', outer + inner, glass('Vidrio_claro', (0.90, 0.95, 1.0), 0.5, 0.012), seg=200, closed=True, parent=fa)
    return dict(az=-24, el=10, ground=0.0, margin=0.90)


def pieza_engranajes():
    """Todo está conectado: cuatro ruedas que engranan, una por cada web."""
    m = 0.085
    N1, N2, N3, N4 = 22, 14, 10, 11
    R1, R2, R3, R4 = (N * m / 2 for N in (N1, N2, N3, N4))
    t12, t23, t14 = radians(38), radians(-62), radians(250)
    c1 = Vector((0, 0, 0))
    c2 = c1 + (R1 + R2) * Vector((cos(t12), 0, sin(t12)))
    c3 = c2 + (R2 + R3) * Vector((cos(t23), 0, sin(t23)))
    c4 = c1 + (R1 + R4) * Vector((cos(t14), 0, sin(t14)))
    ph1 = t12
    ph2 = mesh_phase(t12, ph1, N1, N2)
    ph3 = mesh_phase(t23, ph2, N2, N3)
    ph4 = mesh_phase(t14, ph1, N1, N4)
    th = 0.27
    g = gold(0.24)
    gear('Rueda_economia', N1, m, th, navy(13.0, 0.07), phase=ph1, bore=0.085, web=0.42, holes=6, loc=c1)
    gear('Rueda_patrimonio', N2, m, th, bronze(0.31), phase=ph2, bore=0.07, web=0.5, holes=5, loc=c2)
    gear('Rueda_academia', N3, m, th, sky(6.0, 0.08), phase=ph3, bore=0.06, web=0.6, loc=c3)
    gear('Rueda_bienestar', N4, m, th, green(5.0, 0.22), phase=ph4, bore=0.06, web=0.6, loc=c4)
    for c, b in ((c1, 0.085), (c2, 0.07), (c3, 0.06), (c4, 0.06)):
        cyl('Eje', b - 0.004, th * 1.12 + 0.10, g, seg=48, bevel=(0.008, 3), loc=c, rot=(radians(90), 0, 0))
        cyl('Tapa', b * 1.75, 0.03, g, seg=64, bevel=(0.008, 3), loc=c + Vector((0, -(th * 0.56 + 0.05), 0)),
            rot=(radians(90), 0, 0))
    return dict(az=-30, el=9, ground=None)


# ───────────────────────── piezas de Academia ─────────────────────────
def pieza_abaco():
    """Aprender a contar: un ábaco con una fila por cada web de NUVIA."""
    W, H, foot = 2.5, 1.95, 0.07
    px, py = 0.13, 0.17
    wz, wx, wy = wood('Z'), wood('X'), wood('Y')
    g = gold(0.24)
    for s in (-1, 1):
        x = s * (W / 2 - px / 2)
        box('Montante', (px, py, H - foot), wz, bevel=(0.03, 6), loc=(x, 0, foot + (H - foot) / 2))
        box('Pie', (px + 0.08, 0.66, foot), wy, bevel=(0.022, 5), loc=(x, 0, foot / 2))
    inner = W - 2 * px
    box('Travesano_superior', (inner + 0.02, py, 0.12), wx, bevel=(0.03, 6), loc=(0, 0, H - 0.06))
    box('Travesano_inferior', (inner + 0.02, py, 0.12), wx, bevel=(0.03, 6), loc=(0, 0, foot + 0.06))
    z_lo, z_hi = foot + 0.12, H - 0.12
    rows = 4
    step = (z_hi - z_lo) / (rows + 1)
    Ro, hw = 0.15, 0.102
    t0 = radians(80)
    prof = [(Ro * cos(-t0 + 2 * t0 * k / 28), hw / sin(t0) * sin(-t0 + 2 * t0 * k / 28)) for k in range(29)]
    row_mats = [sky(5.0, 0.07), green(4.2, 0.24), principled('Bronce_pulido', **{'Base Color': (0.66, 0.45, 0.24, 1), 'Metallic': 1.0, 'Roughness': 0.26}), navy(16.0, 0.06)]   # de abajo arriba
    splits = [(5, 2), (2, 5), (4, 3), (3, 4)]
    pitch = 2 * hw + 0.004
    x_min, x_max = -inner / 2, inner / 2
    for i in range(rows):
        z = z_lo + step * (i + 1)
        rod('Varilla_%d' % (i + 1), (x_min - 0.03, 0, z), (x_max + 0.03, 0, z), 0.019, g, seg=24)
        nl, nr = splits[i]
        xs = [x_min + 0.012 + hw + k * pitch for k in range(nl)] + [x_max - 0.012 - hw - k * pitch for k in range(nr)]
        for j, x in enumerate(xs):
            lathe('Cuenta_%d_%d' % (i + 1, j + 1), prof, row_mats[i], seg=96, closed=True,
                  loc=(x, 0, z), rot=(0, radians(90), 0))
    return dict(az=-29, el=11, ground=0.0, margin=0.90, drop=0.045)


def book(name, w, d, h, cover, paper, z0, rotz, xy=(0, 0), tc=0.028, over=0.04):
    root = empty(name, loc=(xy[0], xy[1], z0 + h / 2), rot=(0, 0, radians(rotz)))
    xl, xr, a = -w / 2, w / 2, 0.32 * h
    O, I = [(xr, h / 2)], [(xr, h / 2 - tc)]
    for k in range(25):
        t = radians(90 + 180 * k / 24)
        O.append((xl + a + a * cos(t), (h / 2) * sin(t)))
        I.append((xl + a + (a - tc) * cos(t), (h / 2 - tc) * sin(t)))
    O.append((xr, -h / 2))
    I.append((xr, -h / 2 + tc))
    bm = bmesh.new()
    Of, If = [bm.verts.new((x, -d / 2, z)) for x, z in O], [bm.verts.new((x, -d / 2, z)) for x, z in I]
    Ob, Ib = [bm.verts.new((x, d / 2, z)) for x, z in O], [bm.verts.new((x, d / 2, z)) for x, z in I]
    for i in range(len(O) - 1):
        bm.faces.new((Of[i], Of[i + 1], If[i + 1], If[i]))
        bm.faces.new((Ob[i], Ob[i + 1], Ib[i + 1], Ib[i]))
        bm.faces.new((Of[i], Of[i + 1], Ob[i + 1], Ob[i]))
        bm.faces.new((If[i], If[i + 1], Ib[i + 1], Ib[i]))
    bm.faces.new((Of[0], If[0], Ib[0], Ob[0]))
    bm.faces.new((Of[-1], If[-1], Ib[-1], Ob[-1]))
    finish(name + '_cubierta', bm, cover, bevel=(0.007, 3), parent=root)
    px0, px1 = xl + a, xr - over
    box(name + '_paginas', (px1 - px0, d - 2 * over, h - 2 * tc - 0.006), paper, bevel=(0.006, 2),
        loc=((px0 + px1) / 2, 0, 0), parent=root)
    return root, z0 + h


def ribbon(name, reach, drop, width, mat, parent, x):
    """Cinta de registro: sale del canto de las páginas y cae."""
    path = [(-0.30, 0.0), (reach, 0.0)]
    rc = 0.035
    for k in range(1, 9):
        t = radians(90 - 90 * k / 8)
        path.append((reach + rc * cos(t), -rc + rc * sin(t)))
    path.append((reach + rc + 0.012, -drop))
    th = 0.0045
    outline = [(px, pz + th) for px, pz in path[:2]]
    for k in range(1, 9):
        t = radians(90 - 90 * k / 8)
        outline.append((reach + (rc + th) * cos(t), -rc + (rc + th) * sin(t)))
    outline.append((reach + rc + 0.012 + th, -drop))
    outline += list(reversed(path))
    return prism(name, outline, width, mat, bevel=None, loc=(x, 0, 0), rot=(0, 0, radians(-90)), parent=parent)


def pieza_libros():
    """Leer para comprender: cuatro libros, uno por cada web, y una esfera de vidrio."""
    paper = pages()
    covers = [matte('Tela_azul_profundo', (0.012, 0.040, 0.135), 0.55, 520, 0.18),
              matte('Tela_bronce', (0.42, 0.27, 0.12), 0.55, 520, 0.18),
              matte('Tela_verde', (0.16, 0.27, 0.13), 0.55, 520, 0.18),
              matte('Tela_azul_claro', (0.40, 0.58, 0.78), 0.55, 520, 0.18)]
    specs = [(2.10, 1.50, 0.36, 5, (0.0, 0.0)), (1.90, 1.36, 0.30, -8, (0.04, 0.02)),
             (1.66, 1.20, 0.26, 10, (-0.03, -0.02)), (1.42, 1.02, 0.21, -5, (0.05, 0.03))]
    z = 0.0
    roots = []
    for i, (w, d, h, rz, xy) in enumerate(specs):
        root, z = book('Libro_%d' % (i + 1), w, d, h, covers[i], paper, z + 0.002, rz, xy)
        roots.append(root)
    cinta = matte('Cinta_oro', (0.70, 0.49, 0.20), 0.45, 700, 0.12)
    ribbon('Cinta_1', specs[0][1] / 2 - 0.04, 0.34, 0.075, cinta, roots[0], 0.42)
    ribbon('Cinta_3', specs[2][1] / 2 - 0.04, 0.24, 0.07, cinta, roots[2], 0.20)
    sphere('Esfera_clara', 0.30, sky(3.2, 0.05), loc=(0.16, 0.02, z + 0.302))
    sphere('Esfera_oro', 0.095, gold(0.22), loc=(-0.33, -0.22, z + 0.097))
    return dict(az=-33, el=15, ground=0.0)


def pieza_bloques():
    """Construir pieza a pieza: las formas básicas, cada una en un material de NUVIA."""
    iv = ivory()
    s = 0.62
    box('Cubo', (s, s, s), iv, bevel=(0.03, 6), loc=(-0.44, 0, s / 2), rot=(0, 0, radians(6)))
    cyl('Columna', 0.29, s, bronze(0.31), seg=128, bevel=(0.022, 5), loc=(0.45, 0, s / 2))
    W, H, rc, hs = 1.52, 0.80, 0.40, 0.14
    out = [(-W / 2, 0), (-W / 2, H), (W / 2, H), (W / 2, 0), (rc, 0), (rc, hs)]
    n = 40
    out += [(rc * cos(pi * k / n), hs + rc * sin(pi * k / n)) for k in range(1, n)]
    out += [(-rc, hs), (-rc, 0)]
    z1 = s + 0.003
    prism('Arco', out, 0.46, sky(4.2, 0.09), bevel=(0.03, 6), loc=(0.01, 0, z1))
    z2 = z1 + H + 0.003
    prism('Tejado', [(-0.47, 0), (0.47, 0), (0, 0.46)], 0.46, green(4.0, 0.24), bevel=(0.03, 6), loc=(-0.20, 0, z2))
    sphere('Esfera', 0.27, navy(7.0, 0.05), loc=(1.12, -0.42, 0.27))
    cyl('Cono', 0.24, 0.56, gold(0.24), seg=128, r2=0.012, bevel=(0.012, 4), loc=(-1.22, -0.26, 0.28))
    return dict(az=-27, el=13, ground=0.0)


# ───────────────────────── estudio y render ─────────────────────────
def area(name, loc, size, k, color, target):
    l = bpy.data.lights.new(name, 'AREA')
    l.shape = 'RECTANGLE'
    l.size, l.size_y = size
    l.energy = k * (Vector(loc) - target).length_squared
    l.color = color
    o = bpy.data.objects.new(name, l)
    scene.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (target - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    return o


def emission(name, color, lo, hi):
    """Luz con degradado vertical: más tenue abajo, para que el vidrio tenga profundidad."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = (*color, 1)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = 0.25
    mr.inputs['From Max'].default_value = 0.75
    mr.inputs['To Min'].default_value = lo
    mr.inputs['To Max'].default_value = hi
    nt.links.new(tc.outputs['Generated'], sep.inputs[0])
    nt.links.new(sep.outputs['Y'], mr.inputs['Value'])
    nt.links.new(mr.outputs['Result'], em.inputs['Strength'])
    nt.links.new(em.outputs[0], nt.nodes['Material Output'].inputs['Surface'])
    return m


def floor_material(r0, r1):
    """Suelo que solo recoge la sombra cerca de la pieza y se desvanece hacia fuera."""
    m = principled('Suelo_sombra', **{'Base Color': (0.9, 0.89, 0.87, 1), 'Roughness': 0.9})
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    out = nt.nodes['Material Output']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    ln = nt.nodes.new('ShaderNodeVectorMath')
    ln.operation = 'LENGTH'
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.interpolation_type = 'SMOOTHSTEP'
    mr.inputs['From Min'].default_value = r0
    mr.inputs['From Max'].default_value = r1
    mr.inputs['To Min'].default_value = 1.0
    mr.inputs['To Max'].default_value = 0.0
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(tc.outputs['Object'], ln.inputs[0])
    nt.links.new(ln.outputs['Value'], mr.inputs['Value'])
    nt.links.new(mr.outputs['Result'], mix.inputs['Fac'])
    nt.links.new(tr.outputs['BSDF'], mix.inputs[1])
    nt.links.new(b.outputs['BSDF'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    return m


def studio(az, el, ground, lens=90, margin=0.82, drop=0.0):
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for ob in OBJS:
        ev = ob.evaluated_get(dg)
        me = ev.to_mesh()
        mw = ev.matrix_world.copy()
        step = max(1, len(me.vertices) // 3000)
        pts += [mw @ me.vertices[i].co for i in range(0, len(me.vertices), step)]
        ev.to_mesh_clear()
    mn = Vector([min(p[i] for p in pts) for i in range(3)])
    mx = Vector([max(p[i] for p in pts) for i in range(3)])
    base = (mn + mx) / 2
    center = base.copy()
    az, el = radians(az), radians(el)
    d = Vector((sin(az) * cos(el), -cos(az) * cos(el), sin(el)))      # del centro a la cámara
    quat = d.to_track_quat('Z', 'Y')
    rot = quat.to_matrix()
    right, up = rot @ Vector((1, 0, 0)), rot @ Vector((0, 1, 0))
    xs = [(p - center).dot(right) for p in pts]
    ys = [(p - center).dot(up) for p in pts]
    center = center + right * ((max(xs) + min(xs)) / 2) + up * ((max(ys) + min(ys)) / 2)
    t = (36 / 2) / lens * margin
    ty = t * RATIO
    dist = max(max(abs((p - center).dot(right)) / t, abs((p - center).dot(up)) / ty) + (p - center).dot(d) for p in pts)
    cam = bpy.data.cameras.new('Camara')
    cam.lens = lens
    cam.sensor_width = 36
    cam.clip_end = 500
    cam_ob = bpy.data.objects.new('Camara', cam)
    scene.collection.objects.link(cam_ob)
    center = center + up * (drop * 2 * dist * (36 / 2) / lens)   # baja la pieza en el encuadre
    cam_ob.location = center + d * dist
    cam_ob.rotation_euler = quat.to_euler()
    scene.camera = cam_ob

    L = max(max(xs) - min(xs), max(ys) - min(ys)) / 2

    def P(r, u, f):
        return center + (right * r + up * u + d * f) * L

    area('Principal', P(-2.7, 3.0, 2.6), (3.6 * L, 3.6 * L), 5.0, (1.0, 0.98, 0.95), center)
    area('Relleno', P(3.4, 0.5, 2.3), (2.6 * L, 4.2 * L), 0.9, (0.93, 0.96, 1.0), center)
    area('Contra', P(1.4, 3.0, -3.2), (5.0 * L, 1.8 * L), 3.4, (1.0, 0.97, 0.92), center)
    area('Cenital', P(0.0, 4.6, 0.3), (3.0 * L, 3.0 * L), 0.45, (1.0, 1.0, 1.0), center)

    # Telón luminoso tras la pieza: lo ven los rayos que atraviesan el vidrio, no la cámara.
    bpy.ops.mesh.primitive_plane_add(size=18 * L, location=center - d * 4.5 * L)
    telon = bpy.context.active_object
    telon.name = 'Telon_estudio'
    telon.rotation_euler = quat.to_euler()
    telon.data.materials.append(emission('Telon_blanco', (1.0, 0.985, 0.96), 0.40, 1.02))
    telon.visible_camera = False
    telon.visible_shadow = False

    if ground is not None:
        half = max(mx.x - mn.x, mx.y - mn.y) / 2
        bpy.ops.mesh.primitive_plane_add(size=12 * L, location=(base.x, base.y, ground))
        suelo = bpy.context.active_object
        suelo.name = 'Suelo_sombra'
        suelo.data.materials.append(floor_material(half * 0.95, half * 1.45))
        suelo.is_shadow_catcher = True

    world = bpy.data.worlds.new('Mundo')
    scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes['Background']
    bg.inputs['Strength'].default_value = 0.6
    hdri = os.path.join(bpy.utils.resource_path('LOCAL'), 'datafiles', 'studiolights', 'world', 'studio.exr')
    if os.path.exists(hdri):
        env = nt.nodes.new('ShaderNodeTexEnvironment')
        env.image = bpy.data.images.load(hdri)
        mp = nt.nodes.new('ShaderNodeMapping')
        mp.inputs['Rotation'].default_value = (0, 0, az + radians(70))
        tc = nt.nodes.new('ShaderNodeTexCoord')
        nt.links.new(tc.outputs['Generated'], mp.inputs['Vector'])
        nt.links.new(mp.outputs['Vector'], env.inputs['Vector'])
        nt.links.new(env.outputs['Color'], bg.inputs['Color'])
    else:
        print('AVISO: sin entorno de estudio')
        bg.inputs['Color'].default_value = (0.93, 0.94, 0.96, 1)
        bg.inputs['Strength'].default_value = 0.3


def render():
    scene.render.engine = 'CYCLES'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'OPTIX'
        prefs.get_devices()
        for dev in prefs.devices:
            dev.use = dev.type == 'OPTIX'
        scene.cycles.device = 'GPU'
        print('GPU:', [dev.name for dev in prefs.devices if dev.use])
    except Exception as e:
        print('AVISO: sin GPU,', e)
        scene.cycles.device = 'CPU'
    c = scene.cycles
    c.samples = SAMPLES
    c.use_adaptive_sampling = True
    c.adaptive_threshold = 0.006 if SAMPLES >= 400 else 0.012
    c.use_denoising = True
    c.max_bounces = 24
    c.transmission_bounces = 24
    c.glossy_bounces = 8
    c.diffuse_bounces = 4
    c.volume_bounces = 2
    c.transparent_max_bounces = 24
    c.caustics_refractive = False
    c.caustics_reflective = False
    c.sample_clamp_indirect = 8.0
    r = scene.render
    r.film_transparent = True
    r.resolution_x = SIDE
    r.resolution_y = int(round(SIDE * RATIO))
    r.resolution_percentage = 100
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_mode = 'RGBA'
    r.image_settings.color_depth = '16' if SIDE >= 1500 else '8'
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'
    r.filepath = OUT
    if BLEND:
        bpy.ops.wm.save_as_mainfile(filepath=BLEND)
    bpy.ops.render.render(write_still=True)
    print('hecho', OUT)


PIEZAS = {'reloj': pieza_reloj, 'barometro': pieza_barometro, 'columnas_ancha': pieza_columnas_ancha, 'noticias': pieza_noticias, 'globo': pieza_globo, 'columnas': pieza_columnas, 'engranajes': pieza_engranajes,
          'abaco': pieza_abaco, 'libros': pieza_libros, 'bloques': pieza_bloques}
cfg = PIEZAS[PIEZA]()
studio(cfg['az'], cfg['el'], cfg['ground'], margin=cfg.get('margin', 0.82), drop=cfg.get('drop', 0.0))
render()
