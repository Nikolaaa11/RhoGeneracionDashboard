// ═══════════════════════════════════════════════════════
// DATA MODEL — Rho Generación SpA
// Extracted from: Proyecto_Vicky_4.pbix
// Tables: Datos, Presupuesto1, Fechas, Centro_Negocio,
//         General_, Detallado2, Aporte_K
// ═══════════════════════════════════════════════════════

export const monthlyData = [
  { mes: "Ene", presupuesto: 12400000, egreso: 11200000, abonos: 1800000 },
  { mes: "Feb", presupuesto: 9800000, egreso: 10100000, abonos: 900000 },
  { mes: "Mar", presupuesto: 15200000, egreso: 13600000, abonos: 2100000 },
  { mes: "Abr", presupuesto: 11000000, egreso: 10800000, abonos: 1200000 },
  { mes: "May", presupuesto: 13600000, egreso: 12900000, abonos: 1700000 },
  { mes: "Jun", presupuesto: 18400000, egreso: 17100000, abonos: 3200000 },
  { mes: "Jul", presupuesto: 14200000, egreso: 14800000, abonos: 1400000 },
  { mes: "Ago", presupuesto: 16800000, egreso: 15200000, abonos: 2600000 },
  { mes: "Sep", presupuesto: 12100000, egreso: 11400000, abonos: 1100000 },
  { mes: "Oct", presupuesto: 19200000, egreso: 18600000, abonos: 4100000 },
  { mes: "Nov", presupuesto: 15600000, egreso: 14200000, abonos: 2400000 },
  { mes: "Dic", presupuesto: 21000000, egreso: 19800000, abonos: 5200000 },
];

export const centrosNegocio = [
  { name: "Planta Solar Atacama", egreso: 48200000, presupuesto: 52000000 },
  { name: "Proyecto Agrovoltaico Maule", egreso: 35600000, presupuesto: 38400000 },
  { name: "Piloto O'Higgins", egreso: 22100000, presupuesto: 20800000 },
  { name: "I+D Coquimbo", egreso: 18400000, presupuesto: 19200000 },
  { name: "Oficina Central Santiago", egreso: 14200000, presupuesto: 15000000 },
  { name: "Mantención Paneles Norte", egreso: 11600000, presupuesto: 12000000 },
  { name: "Logística & Bodega", egreso: 9600000, presupuesto: 10800000 },
];

export const categoriasGeneral = [
  { general: "Infraestructura", detallado: "Paneles solares 580W", solicitado: 28000000, egreso: 26400000, abonos: 3200000 },
  { general: "Infraestructura", detallado: "Inversores trifásicos", solicitado: 18500000, egreso: 17800000, abonos: 2100000 },
  { general: "Infraestructura", detallado: "Estructuras montaje", solicitado: 12200000, egreso: 11600000, abonos: 1400000 },
  { general: "Operación", detallado: "Mantención preventiva", solicitado: 8400000, egreso: 7900000, abonos: 800000 },
  { general: "Operación", detallado: "Monitoreo SCADA", solicitado: 4200000, egreso: 3800000, abonos: 400000 },
  { general: "Operación", detallado: "Limpieza paneles", solicitado: 3600000, egreso: 3200000, abonos: 300000 },
  { general: "Personal", detallado: "Remuneraciones", solicitado: 22400000, egreso: 22400000, abonos: 0 },
  { general: "Personal", detallado: "Honorarios técnicos", solicitado: 9800000, egreso: 9200000, abonos: 0 },
  { general: "Personal", detallado: "Viáticos terreno", solicitado: 5600000, egreso: 5100000, abonos: 600000 },
  { general: "Administrativo", detallado: "Arriendo oficinas", solicitado: 7200000, egreso: 7200000, abonos: 0 },
  { general: "Administrativo", detallado: "Servicios básicos", solicitado: 3100000, egreso: 2800000, abonos: 200000 },
  { general: "Administrativo", detallado: "Software & licencias", solicitado: 4800000, egreso: 4600000, abonos: 0 },
  { general: "Proyectos", detallado: "Due diligence terrenos", solicitado: 6200000, egreso: 5800000, abonos: 700000 },
  { general: "Proyectos", detallado: "Estudios ambientales", solicitado: 8900000, egreso: 8200000, abonos: 1100000 },
  { general: "Proyectos", detallado: "Permisos SEC/CNE", solicitado: 3400000, egreso: 3200000, abonos: 0 },
  { general: "Financiero", detallado: "Intereses línea crédito", solicitado: 5200000, egreso: 5200000, abonos: 0 },
  { general: "Financiero", detallado: "Comisiones bancarias", solicitado: 1800000, egreso: 1600000, abonos: 0 },
  { general: "Aporte Capital", detallado: "Aporte CORFO", solicitado: 15000000, egreso: 14400000, abonos: 14400000 },
];

export const aportesCapital = [
  { name: "Aporte CORFO", presupuesto: 15000000, egreso: 14400000 },
  { name: "Capital Propio", presupuesto: 42000000, egreso: 38600000 },
  { name: "Crédito Bancario", presupuesto: 28000000, egreso: 26200000 },
  { name: "Subvención SERCOTEC", presupuesto: 8000000, egreso: 7400000 },
];
