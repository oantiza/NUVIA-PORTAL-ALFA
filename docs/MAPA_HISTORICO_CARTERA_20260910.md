# Mapa histórico de cartera · 10-09-2026

Orden del fundador: «arréglalo para que no pase con ningún activo», tras comprobar
que JPMorgan Europe Equity Plus A no aparecía en el mapa de supuestos pese a
disponer de historial y composición global completa.

## Cambio

El mapa visible utiliza las series históricas de los instrumentos. No consulta
categorías, exposición interna, posiciones cortas, convertibles ni «otros» para
decidir si dibuja el punto. Así puede representar cualquier clase de activo con
serie utilizable. Las funciones anteriores de supuestos permanecen disponibles
para sus consumidores; el nuevo mapa no mezcla sus cifras con datos históricos.

Los cinco perfiles se calculan con los mismos cuatro instrumentos que ya utiliza
el comparador de evolución: IE00B03HD191 y IE00BYX5NX33 para bolsa;
LU0113257694 y LU0132601682 para bonos. Son cestas de fondos, no índices puros.
Los nombres e ISIN se muestran en el desplegable metodológico.

## Método común

- Intersección exacta de fechas entre cartera y referencias, sin interpolar ni
  completar precios. Se muestran fechas y observaciones efectivamente utilizadas.
- Reparto inicial en la primera fecha común y evolución sin rebalanceo. Cada serie
  se rebasa de nuevo en esa fecha antes de combinarla; así no se arrastran cambios
  de peso de un periodo anterior.
- Los perfiles destinan inicialmente 10, 30, 50, 70 y 90 % a la cesta de bolsa;
  el resto a bonos. Cada uno de los dos instrumentos pesa la mitad de su cesta.
- Rentabilidad anualizada geométrica sobre años reales (365,25 días).
- Volatilidad: desviación típica muestral de retornos simples entre cierres por
  raíz de `n / años`. La frecuencia anual observada evita aplicar automáticamente
  252 a una serie con otro calendario. Es una estimación sensible al muestreo;
  se indican los intervalos superiores a siete días. No se supone que esos huecos
  equivalgan a rentabilidades diarias independientes.
- Se requieren tres cierres ordenados, positivos y finitos para calcular una
  varianza muestral. No se inventa un precio ni una cifra para un activo sin serie.

## Datos ausentes y respuestas tardías

La cobertura se calcula con los pesos originales, antes de cualquier exclusión.
Con historial parcial, el punto se llama «Parte con historial», se cuantifica el
peso cubierto, se nombran los activos ausentes y se declara el reescalado.

Si falta una de las cuatro referencias, falla su solicitud o no hay tres fechas
comunes, se conserva el punto de la cartera con su propio historial. No se sustituye
la referencia por un supuesto ni se cambia silenciosamente la cesta. El usuario
puede reintentar. Cada recálculo conserva su nodo de resultados: una respuesta
anterior no modifica la composición nueva.

## Verificación

Pruebas numéricas independientes para tipos y composiciones arbitrarios, la
exposición negativa del JPMorgan, anualización, cambio de fecha inicial, cobertura
parcial, referencias ausentes, falta de intersección y series inválidas.
Fixture interactivo en `docs/fixtures/mapa-historico.html` para casos completos,
parciales, errores y respuestas tardías.

Lectura real de Alfa: JPMorgan LU0289089384 genera un punto con cobertura del
100 % y cinco referencias entre 11-09-2023 y 01-09-2026 (736 retornos comunes).
También se comprobaron FONDIBAS, Nordea Alpha 15, BlackRock Systematic Style
Factor, la clase D del JPMorgan, un ETF de bonos, un ETF monetario y BBVA.
Los ocho instrumentos producen puntos y cinco referencias. Las evidencias de
lectura se conservan en `output/mapa-historico/`, excluido de publicación.

## Revisión interna del marco obligatorio

Finalidad descriptiva solicitada por el fundador. Calcula lo ocurrido a una
combinación de pesos; no incorpora circunstancias personales, juicio de idoneidad,
señales, puntuaciones de atractivo, órdenes o contratación. Ningún perfil se
propone como inversión. Fuente, periodo, fórmula, cobertura y composición de
referencias son consultables. No utiliza IA en el cálculo ni escribe datos
personales o instrumentos en la base. Se mantiene la separación de la actividad
profesional. La revisión jurídica externa permanece fuera del alcance alfa,
conforme al §0. No se atribuye una validación externa inexistente.
