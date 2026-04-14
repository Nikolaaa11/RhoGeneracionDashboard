// ═══════════════════════════════════════════════════════
// DATA REAL — Rho Generación SpA
// Fuente: CC Santander (2026_02_17_CC_SANTANDER_VA.xlsx)
// 519 transacciones operacionales de 607 total
// EXCLUYE: Reversas (neto $0), Fondos Mutuos, Préstamos
// ═══════════════════════════════════════════════════════

export const monthlyData = [
  { mes:"Ene", egreso:875883, abonos:0, presupuesto:0 },
  { mes:"Feb", egreso:38001, abonos:0, presupuesto:0 },
  { mes:"Mar", egreso:155268463, abonos:0, presupuesto:184739941 },
  { mes:"Abr", egreso:47229076, abonos:0, presupuesto:54169676 },
  { mes:"May", egreso:52055072, abonos:0, presupuesto:152669676 },
  { mes:"Jun", egreso:63724819, abonos:0, presupuesto:89323876 },
  { mes:"Jul", egreso:35199430, abonos:27490610, presupuesto:80146700 },
  { mes:"Ago", egreso:39683997, abonos:0, presupuesto:18646700 },
  { mes:"Sep", egreso:38393507, abonos:0, presupuesto:18646700 },
  { mes:"Oct", egreso:41756397, abonos:0, presupuesto:19523892 },
  { mes:"Nov", egreso:90873572, abonos:0, presupuesto:26722193 },
  { mes:"Dic", egreso:54802144, abonos:0, presupuesto:61186889 },
  { mes:"Ene'26", egreso:35159013, abonos:0, presupuesto:0 },
  { mes:"Feb'26", egreso:26329519, abonos:0, presupuesto:0 },
  { mes:"Mar'26", egreso:37439578, abonos:0, presupuesto:0 },
];

export const centrosNegocio = [
  { name:"Oficina", egreso:266267015, abonos:0, presupuesto:258492288 },
  { name:"La Ligua (San Expedito)", egreso:178183949, abonos:0, presupuesto:216059638 },
  { name:"Panimávida (BESS RHO)", egreso:174415262, abonos:0, presupuesto:141602625 },
  { name:"Codegua (Explícito)", egreso:42416764, abonos:0, presupuesto:71304376 },
  { name:"Santa Victoria 15 MW", egreso:27304376, abonos:27490610, presupuesto:27304376 },
  { name:"PMGD Quebrada Escobar", egreso:26807064, abonos:0, presupuesto:35850000 },
  { name:"RUIL", egreso:3508772, abonos:0, presupuesto:58000000 },
  { name:"PMGD Ranguil III", egreso:323275, abonos:0, presupuesto:11850000 },
  { name:"Agua Santa (Expedito II)", egreso:116959, abonos:0, presupuesto:0 },
];

export const categoriasGeneral = [
  { general:"Desarrollo_Proyecto", detallado:"Conexión", egreso:173567981, abonos:27490610, solicitado:224662468 },
  { general:"RRHH", detallado:"Administrativo", egreso:150911386, abonos:0, solicitado:154991904 },
  { general:"Desarrollo_Proyecto", detallado:"Terreno", egreso:91406726, abonos:0, solicitado:175000000 },
  { general:"Desarrollo_Proyecto", detallado:"Gestión Permisos", egreso:76286796, abonos:0, solicitado:103291979 },
  { general:"Desarrollo_Proyecto", detallado:"Gestión", egreso:54829734, abonos:0, solicitado:52758771 },
  { general:"Desarrollo_Proyecto", detallado:"Estudios Eléctricos", egreso:45873463, abonos:0, solicitado:21917996 },
  { general:"RRHH", detallado:"Directorio", egreso:34500000, abonos:0, solicitado:39000000 },
  { general:"RRHH", detallado:"Operaciones", egreso:34327631, abonos:0, solicitado:47500000 },
  { general:"Administración", detallado:"Gastos Varios", egreso:32272647, abonos:0, solicitado:3033600 },
  { general:"Administración", detallado:"Arriendo", egreso:7205271, abonos:0, solicitado:6350000 },
  { general:"Desarrollo_Proyecto", detallado:"Estudios Técnicos", egreso:5915911, abonos:0, solicitado:1189801 },
  { general:"Desarrollo_Proyecto", detallado:"Otros", egreso:5195810, abonos:0, solicitado:10214000 },
  { general:"Administración", detallado:"Viáticos", egreso:4886777, abonos:0, solicitado:5000000 },
  { general:"Operación", detallado:"Contabilidad", egreso:1392709, abonos:0, solicitado:2016784 },
  { general:"Operación", detallado:"Banco", egreso:767814, abonos:0, solicitado:600000 },
  { general:"Ventas", detallado:"Venta", egreso:2780, abonos:0, solicitado:0 },
];

export const aportesCapital = [
  { name:"Primer Abono CORFO", abonos:299248969, egreso:227585630 },
  { name:"Segundo Abono CORFO", abonos:317740254, egreso:245605308 },
  { name:"Tercer Abono CORFO", abonos:182383334, egreso:246149718 },
];

export const presupuestoGeneral = {
  RRHH: 241491904,
  Administración: 14383600,
  Operación: 2616784,
  Desarrollo_Proyecto: 595035015,
};

export const totalesReales = {
  egresoOp: 719343436,
  abonosOp: 27490610,
  capitalRecibido: 799372557,
  presupuesto: 853527303,
  fondosMutuos: { invertido:437000000, rescatado:359929251, intereses:10126378, saldo:144626378 },
  prestamos: { otorgados:36054460, devueltos:65074460, netoAFavor:29020000 },
};
