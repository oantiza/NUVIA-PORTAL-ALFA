/* Regresión real de guardado → edición → carga. Usa un contexto aislado,
   únicamente datos ficticios y el origen local del auditor. No toca la
   sesión del lector ni servicios remotos. Forma parte de checkFormControls. */
export async function checkViviendaScenario(page) {
  const problems = [];
  const origin = new URL(page.url()).origin;
  const context = await page.context().browser().newContext({ viewport: page.viewportSize() || { width: 1440, height: 1000 } });
  const key = 'nuvia-vivienda-maqueta-v1';
  try {
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const sample = await context.newPage();
    sample.setDefaultTimeout(10000);
    await sample.goto(new URL('vivienda.html', page.url()).href);
    const amount = sample.locator('input[name="purchasePrice"]');
    await amount.waitFor();
    await amount.fill('420000');
    const before = await sample.locator('.viv-figure__value,.viv-table__row').allTextContents();
    await sample.getByRole('button', { name: 'Guardar en este navegador', exact: true }).click();
    const stored = await sample.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
    if (stored?.s?.purchasePrice !== 420000 || stored?.ofertas?.length !== 3) problems.push('Vivienda: guardar no conserva el escenario y las tres comparaciones en el formato existente');
    await amount.fill('500000');
    const changed = await sample.locator('.viv-figure__value,.viv-table__row').allTextContents();
    if (JSON.stringify(changed) === JSON.stringify(before)) problems.push('Vivienda: editar el precio no recalcula el resultado antes de cargar');
    await sample.getByRole('button', { name: 'Cargar escenario guardado', exact: true }).click();
    if (await amount.inputValue() !== '420000') problems.push('Vivienda: cargar recupera el estado pero el campo sigue mostrando el precio editado');
    const after = await sample.locator('.viv-figure__value,.viv-table__row').allTextContents();
    if (JSON.stringify(after) !== JSON.stringify(before)) problems.push('Vivienda: los resultados y la tabla no corresponden al escenario guardado al cargarlo');
    const afterStorage = await sample.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
    if (JSON.stringify(afterStorage) !== JSON.stringify(stored)) problems.push('Vivienda: cargar altera los datos guardados');
    // Volver a guardar debe sustituir la misma entrada, sin crear un formato nuevo.
    await amount.fill('430000');
    await sample.getByRole('button', { name: 'Guardar en este navegador', exact: true }).click();
    const replaced = await sample.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
    if (replaced?.s?.purchasePrice !== 430000) problems.push('Vivienda: guardar no sustituye el escenario anterior');
  } catch (error) {
    problems.push('Vivienda: no se pudo completar guardar → editar → cargar: ' + error.message);
  } finally {
    await context.close();
  }
  return problems;
}
