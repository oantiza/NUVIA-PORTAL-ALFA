/** Transformaciones puras de los datos de fondos BDB a la ficha pública de Alfa. */

const NUMEROS_ASIGNACION = [
  'assetAllocEquity', 'assetAllocFixedIncome', 'assetAllocCash',
  'assetAllocConvertible', 'assetAllocPreferred', 'assetAllocOther',
];

const numero = (valor) => valor !== null && valor !== undefined && valor !== ''
  && Number.isFinite(Number(valor)) ? Number(valor) : null;

const redondea = (valor, decimales = 8) => Number(valor.toFixed(decimales));

function tieneValores(mapa) {
  return mapa && Object.values(mapa).some((valor) => Number.isFinite(valor) && valor !== 0);
}

export function asignacionGlobalOriginal(documento) {
  const global = documento?.globalAllocationMap;
  if (!global || typeof global !== 'object') return null;
  const valores = Object.fromEntries(NUMEROS_ASIGNACION.map((clave) => [clave, numero(global[clave]?.netAllocation)]));
  if (Object.values(valores).some((valor) => valor === null)) return null;
  const suma = Object.values(valores).reduce((total, valor) => total + valor, 0);
  if (Math.abs(suma - 100) > 0.001) return null;
  const detalle = {
    equity: redondea(valores.assetAllocEquity / 100),
    fixed_income: redondea(valores.assetAllocFixedIncome / 100),
    cash: redondea(valores.assetAllocCash / 100),
    convertibles: redondea(valores.assetAllocConvertible / 100),
    preferred: redondea(valores.assetAllocPreferred / 100),
    other: redondea(valores.assetAllocOther / 100),
  };
  return {
    as_of_date: String(documento.portfolioDateGlobal || documento.portfolioDate || '').slice(0, 10) || null,
    basis: 'net',
    detail: detalle,
    asset_mix: {
      equity: detalle.equity,
      fixed_income: detalle.fixed_income,
      cash: detalle.cash,
      other: redondea(detalle.convertibles + detalle.preferred + detalle.other),
    },
  };
}

export function costesPublicos(costes, reportDate = null) {
  const management = numero(costes?.management_fee_pct);
  const ter = numero(costes?.ter_pct);
  const mifid = numero(costes?.mifid_ongoing_pct);
  if ([management, ter, mifid].every((valor) => valor === null)) return null;
  const salida = {
    source: 'BDB',
    as_of_date: reportDate,
    management_fee_pct: management,
    ter_pct: ter,
    mifid_ongoing_pct: mifid,
  };
  if (management !== null) salida.management_fee = redondea(management / 100);
  if (ter !== null || mifid !== null) salida.ongoing_charge = redondea((ter ?? mifid) / 100);
  return salida;
}

export function perfilRentaFijaPublico(perfil, reportDate = null) {
  const duration = numero(perfil?.effective_duration);
  const credit = tieneValores(perfil?.credit_quality) ? perfil.credit_quality : null;
  const maturity = tieneValores(perfil?.maturity_allocation) ? perfil.maturity_allocation : null;
  if (duration === null && !credit && !maturity) return null;
  return {
    source: 'BDB', as_of_date: reportDate,
    effective_duration: duration, credit_quality: credit, maturity_allocation: maturity,
  };
}

export function exposicionesPublicas({ asignacion, maestra }) {
  const exposicion = maestra?.portfolio_exposure || {};
  const fecha = asignacion?.as_of_date || maestra?.holdings_summary?.as_of_date
    || maestra?.source_metadata?.report_date || null;
  return {
    source: 'BDB · asignación global original',
    asset_mix: asignacion?.asset_mix || null,
    asset_mix_detail: asignacion?.detail || null,
    asset_mix_basis: asignacion?.basis || null,
    asset_mix_as_of_date: asignacion?.as_of_date || null,
    regions: tieneValores(exposicion.equity_regions) ? exposicion.equity_regions : null,
    regions_as_of_date: tieneValores(exposicion.equity_regions) ? fecha : null,
    sectors: tieneValores(exposicion.sectors) ? exposicion.sectors : null,
    sectors_as_of_date: tieneValores(exposicion.sectors) ? fecha : null,
    confidence: numero(exposicion.exposure_confidence),
  };
}

export function conservaEnriquecimientoFondo(proyectado, existente) {
  if (proyectado?.instrument_type !== 'FUND' || existente?.data_enrichment?.system !== 'BDB') return proyectado;
  const salida = { ...proyectado };
  for (const campo of ['exposures', 'costs', 'fixed_income_profile', 'holdings_summary', 'data_enrichment']) {
    if (existente[campo] !== undefined) salida[campo] = existente[campo];
  }
  if (existente.quality) {
    salida.quality = {
      ...(proyectado.quality || {}),
      warnings: [...new Set([...(proyectado.quality?.warnings || []), ...(existente.quality.warnings || [])])]
        .filter((aviso) => aviso !== 'sin desglose de regiones y sectores en la alfa (EODHD no lo publica para fondos europeos)'),
    };
  }
  return salida;
}
