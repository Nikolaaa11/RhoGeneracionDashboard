import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, Treemap } from "recharts";

/* ───────────────────────────────────────────
   DATA MODEL (extracted from Proyecto_Vicky_4.pbix)
   Tables: Datos(EGRESO,ABONOS), Presupuesto1(SOLICITADO),
   Fechas, Centro_Negocio, General_, Detallado2, Aporte_K
   ─────────────────────────────────────────── */

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const monthlyData = [
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

const centrosNegocio = [
  { name: "Planta Solar Atacama", egreso: 48200000, presupuesto: 52000000 },
  { name: "Proyecto Agrovoltaico Maule", egreso: 35600000, presupuesto: 38400000 },
  { name: "Piloto O'Higgins", egreso: 22100000, presupuesto: 20800000 },
  { name: "I+D Coquimbo", egreso: 18400000, presupuesto: 19200000 },
  { name: "Oficina Central Santiago", egreso: 14200000, presupuesto: 15000000 },
  { name: "Mantención Paneles Norte", egreso: 11600000, presupuesto: 12000000 },
  { name: "Logística & Bodega", egreso: 9600000, presupuesto: 10800000 },
];

const categoriasGeneral = [
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

const aportesCapital = [
  { name: "Aporte CORFO", presupuesto: 15000000, egreso: 14400000 },
  { name: "Capital Propio", presupuesto: 42000000, egreso: 38600000 },
  { name: "Crédito Bancario", presupuesto: 28000000, egreso: 26200000 },
  { name: "Subvención SERCOTEC", presupuesto: 8000000, egreso: 7400000 },
];

// ── Icons (Lucide-style SVG inline) ──
const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  finance: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  table: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  ),
  sun: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  building: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/>
      <line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/>
      <line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/>
      <line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/>
    </svg>
  ),
  chevron: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  arrowUp: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  ),
  arrowDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  ),
  filter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
};

// ── Formatting ──
const fmtCLP = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString("es-CL")}`;
};
const fmtFull = (n) => `$${n.toLocaleString("es-CL")}`;
const fmtPct = (n) => `${(n * 100).toFixed(1)}%`;

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10,
      padding: "12px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      fontSize: 13, lineHeight: 1.6
    }}>
      <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
          <span style={{ color: "#6B7280" }}>{p.name}:</span>
          <span style={{ fontWeight: 500, color: "#111827", fontVariantNumeric: "tabular-nums" }}>{fmtFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ── Treemap Custom Content ──
const TreemapContent = ({ x, y, width, height, name, egreso }) => {
  if (width < 60 || height < 40) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6}
        style={{ fill: "rgba(245,158,11,0.12)", stroke: "rgba(245,158,11,0.25)", strokeWidth: 1 }} />
      <text x={x + 8} y={y + 18} fontSize={11} fontWeight={600} fill="#111827"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {width > 100 ? name : name?.split(" ")[0]}
      </text>
      <text x={x + 8} y={y + 34} fontSize={12} fontWeight={500} fill="#D97706"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {fmtCLP(egreso)}
      </text>
    </g>
  );
};

// ── Main Component ──
export default function RhoDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedCentro, setSelectedCentro] = useState("Todos");
  const [selectedGeneral, setSelectedGeneral] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const generalCategories = ["Todos", ...new Set(categoriasGeneral.map(c => c.general))];
  const centroNames = ["Todos", ...centrosNegocio.map(c => c.name)];

  const filteredTable = useMemo(() => {
    let data = categoriasGeneral;
    if (selectedGeneral !== "Todos") data = data.filter(r => r.general === selectedGeneral);
    if (searchTerm) data = data.filter(r =>
      r.detallado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.general.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return data;
  }, [selectedGeneral, searchTerm]);

  const totals = useMemo(() => {
    const egreso = monthlyData.reduce((s, m) => s + m.egreso, 0);
    const presupuesto = monthlyData.reduce((s, m) => s + m.presupuesto, 0);
    const abonos = monthlyData.reduce((s, m) => s + m.abonos, 0);
    return { egreso, presupuesto, abonos, ejecucion: egreso / presupuesto };
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "presupuesto", label: "Presupuesto vs Egreso", icon: Icons.chart },
    { id: "centros", label: "Centros de Negocio", icon: Icons.building },
    { id: "detalle", label: "Detalle Operacional", icon: Icons.table },
    { id: "aportes", label: "Aportes de Capital", icon: Icons.finance },
  ];

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100%",
      background: "#FFFFFF",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      color: "#111827", overflow: "hidden",
    }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260, minWidth: 260, background: "#F9FAFB",
        borderRight: "1px solid #F3F4F6",
        display: "flex", flexDirection: "column",
        padding: "24px 12px",
      }}>
        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "0 12px", marginBottom: 32,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #F59E0B, #D97706)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14,
            boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
          }}>Rho</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", letterSpacing: "-0.02em" }}>
              Rho Generación
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>
              Energía Agrovoltaica
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveView(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, border: "none",
                cursor: "pointer", fontSize: 13.5, fontWeight: 500,
                transition: "all 150ms ease-out",
                background: activeView === item.id ? "rgba(245,158,11,0.08)" : "transparent",
                color: activeView === item.id ? "#D97706" : "#6B7280",
              }}>
              <span style={{ opacity: activeView === item.id ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom: Fund badge */}
        <div style={{ marginTop: "auto", padding: "16px 12px" }}>
          <div style={{
            padding: "12px 14px", borderRadius: 10,
            background: "#FFFFFF", border: "1px solid #E5E7EB",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, marginBottom: 4 }}>FONDO</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>CEHTA ESG</div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>AFIS S.A. · Portafolio</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{
        flex: 1, overflow: "auto",
        padding: "28px 36px",
        background: "#FFFFFF",
      }}>

        {/* Header */}
        <header style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 28,
        }}>
          <div>
            <h1 style={{
              fontSize: 22, fontWeight: 600, color: "#111827",
              letterSpacing: "-0.03em", margin: 0,
            }}>
              {navItems.find(n => n.id === activeView)?.label || "Dashboard"}
            </h1>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "4px 0 0", fontWeight: 400 }}>
              Rho Generación SpA · Ejercicio 2025
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{
              padding: "6px 14px", borderRadius: 999,
              background: "rgba(245,158,11,0.08)", color: "#D97706",
              fontSize: 12, fontWeight: 600,
            }}>
              {Icons.sun} Agrovoltaico
            </span>
          </div>
        </header>

        {/* ════════════════════════════════════════ */}
        {/* VIEW: DASHBOARD */}
        {/* ════════════════════════════════════════ */}
        {activeView === "dashboard" && (
          <>
            {/* KPI Row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
              marginBottom: 28,
            }}>
              {[
                { label: "Total Egresos", value: fmtCLP(totals.egreso), sub: "Ejecución acumulada", change: -2.1, color: "#111827" },
                { label: "Presupuesto Total", value: fmtCLP(totals.presupuesto), sub: "Solicitado anual", change: null, color: "#111827" },
                { label: "Total Abonos", value: fmtCLP(totals.abonos), sub: "Ingresos recibidos", change: 12.4, color: "#10B981" },
                { label: "Ejecución Ppto.", value: fmtPct(totals.ejecucion), sub: "Egreso / Solicitado", change: null, color: totals.ejecucion > 0.95 ? "#EF4444" : "#F59E0B" },
              ].map((kpi, i) => (
                <div key={i} style={{
                  background: "#FFFFFF", borderRadius: 12,
                  border: "1px solid #F3F4F6", padding: "20px 22px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "box-shadow 200ms ease-out",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF", marginBottom: 8, letterSpacing: "0.02em" }}>
                    {kpi.label}
                  </div>
                  <div style={{
                    fontSize: 26, fontWeight: 600, color: kpi.color,
                    letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}>
                    {kpi.value}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    marginTop: 8, fontSize: 12,
                  }}>
                    {kpi.change !== null && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 2,
                        color: kpi.change > 0 ? "#10B981" : "#EF4444",
                        fontWeight: 600,
                      }}>
                        {kpi.change > 0 ? Icons.arrowUp : Icons.arrowDown}
                        {Math.abs(kpi.change)}%
                      </span>
                    )}
                    <span style={{ color: "#9CA3AF" }}>{kpi.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 }}>
              {/* Presupuesto vs Egreso Chart */}
              <div style={{
                background: "#FFFFFF", borderRadius: 12,
                border: "1px solid #F3F4F6", padding: "20px 22px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>
                      Presupuesto vs Egreso Mensual
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Comparativa ejecución 2025</div>
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: "#F59E0B" }} />
                      <span style={{ color: "#6B7280" }}>Solicitado</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: "#111827" }} />
                      <span style={{ color: "#6B7280" }}>Egreso</span>
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData} barGap={2} barCategoryGap="18%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="presupuesto" name="Solicitado" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="egreso" name="Egreso" fill="#111827" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Treemap Centros de Negocio */}
              <div style={{
                background: "#FFFFFF", borderRadius: 12,
                border: "1px solid #F3F4F6", padding: "20px 22px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em", marginBottom: 4 }}>
                  Egresos por Centro de Negocio
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>Distribución proporcional</div>
                <ResponsiveContainer width="100%" height={220}>
                  <Treemap data={centrosNegocio} dataKey="egreso" nameKey="name" content={<TreemapContent />} />
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Table */}
            <div style={{
              background: "#FFFFFF", borderRadius: 12,
              border: "1px solid #F3F4F6",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>
                  Top Líneas de Gasto
                </div>
                <button onClick={() => setActiveView("detalle")} style={{
                  fontSize: 12, fontWeight: 500, color: "#F59E0B",
                  background: "none", border: "none", cursor: "pointer",
                }}>Ver todo →</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                    {["Categoría","Detalle","Solicitado","Egreso","Ejecución"].map(h => (
                      <th key={h} style={{
                        fontSize: 11, fontWeight: 500, color: "#9CA3AF",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        padding: "10px 16px", textAlign: h === "Categoría" || h === "Detalle" ? "left" : "right",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categoriasGeneral.slice(0, 6).map((row, i) => {
                    const pct = row.egreso / row.solicitado;
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #F9FAFB" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>
                          <span style={{
                            padding: "3px 8px", borderRadius: 6,
                            background: "#F9FAFB", fontSize: 11, fontWeight: 500,
                            color: "#6B7280",
                          }}>{row.general}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#111827" }}>
                          {row.detallado}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "right", color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>
                          {fmtCLP(row.solicitado)}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "right", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                          {fmtCLP(row.egreso)}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                            <div style={{
                              width: 48, height: 4, borderRadius: 2, background: "#F3F4F6", overflow: "hidden",
                            }}>
                              <div style={{
                                width: `${Math.min(pct * 100, 100)}%`, height: "100%", borderRadius: 2,
                                background: pct > 0.95 ? "#EF4444" : pct > 0.85 ? "#F59E0B" : "#10B981",
                              }} />
                            </div>
                            <span style={{
                              fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums",
                              color: pct > 0.95 ? "#EF4444" : pct > 0.85 ? "#F59E0B" : "#10B981",
                            }}>
                              {(pct * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════ */}
        {/* VIEW: PRESUPUESTO VS EGRESO */}
        {/* ════════════════════════════════════════ */}
        {activeView === "presupuesto" && (
          <>
            <div style={{
              background: "#FFFFFF", borderRadius: 12,
              border: "1px solid #F3F4F6", padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24,
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, letterSpacing: "-0.02em" }}>
                Ejecución Presupuestaria Mensual
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyData} barGap={3} barCategoryGap="14%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} width={44} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="presupuesto" name="Solicitado" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="egreso" name="Egreso" fill="#1F2937" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="abonos" name="Abonos" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly detail cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {monthlyData.map((m, i) => {
                const pct = m.egreso / m.presupuesto;
                return (
                  <div key={i} style={{
                    background: "#FFFFFF", borderRadius: 10,
                    border: "1px solid #F3F4F6", padding: "14px 16px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", marginBottom: 8 }}>{m.mes} 2025</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>Solicitado</span>
                      <span style={{ fontSize: 12, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{fmtCLP(m.presupuesto)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>Egreso</span>
                      <span style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtCLP(m.egreso)}</span>
                    </div>
                    <div style={{
                      width: "100%", height: 3, borderRadius: 2, background: "#F3F4F6", overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${Math.min(pct * 100, 100)}%`, height: "100%", borderRadius: 2,
                        background: pct > 1 ? "#EF4444" : pct > 0.9 ? "#F59E0B" : "#10B981",
                      }} />
                    </div>
                    <div style={{
                      fontSize: 11, fontWeight: 600, marginTop: 4, textAlign: "right",
                      color: pct > 1 ? "#EF4444" : pct > 0.9 ? "#F59E0B" : "#10B981",
                    }}>
                      {(pct * 100).toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ════════════════════════════════════════ */}
        {/* VIEW: CENTROS DE NEGOCIO */}
        {/* ════════════════════════════════════════ */}
        {activeView === "centros" && (
          <>
            <div style={{
              background: "#FFFFFF", borderRadius: 12,
              border: "1px solid #F3F4F6", padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24,
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, letterSpacing: "-0.02em" }}>
                Presupuesto vs Egreso por Centro de Negocio
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={centrosNegocio} layout="vertical" barGap={2} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                  <YAxis type="category" dataKey="name" width={180}
                    tick={{ fontSize: 12, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="presupuesto" name="Solicitado" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={14} />
                  <Bar dataKey="egreso" name="Egreso" fill="#1F2937" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Centro detail cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {centrosNegocio.map((c, i) => {
                const pct = c.egreso / c.presupuesto;
                const diff = c.presupuesto - c.egreso;
                return (
                  <div key={i} style={{
                    background: "#FFFFFF", borderRadius: 12,
                    border: "1px solid #F3F4F6", padding: "18px 20px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>{c.name}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>Solicitado</div>
                        <div style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtCLP(c.presupuesto)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#9CA3AF" }}>Egreso</div>
                        <div style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtCLP(c.egreso)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600,
                        color: diff >= 0 ? "#10B981" : "#EF4444",
                      }}>
                        {diff >= 0 ? "+" : ""}{fmtCLP(diff)} {diff >= 0 ? "disponible" : "sobrepasado"}
                      </span>
                      <span style={{
                        padding: "3px 8px", borderRadius: 6,
                        fontSize: 11, fontWeight: 600,
                        background: pct > 1 ? "rgba(239,68,68,0.08)" : pct > 0.9 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
                        color: pct > 1 ? "#EF4444" : pct > 0.9 ? "#D97706" : "#10B981",
                      }}>
                        {(pct * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ════════════════════════════════════════ */}
        {/* VIEW: DETALLE OPERACIONAL (Table) */}
        {/* ════════════════════════════════════════ */}
        {activeView === "detalle" && (
          <div style={{
            background: "#FFFFFF", borderRadius: 12,
            border: "1px solid #F3F4F6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}>
            {/* Filters */}
            <div style={{
              padding: "16px 22px", borderBottom: "1px solid #F3F4F6",
              display: "flex", gap: 12, alignItems: "center",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 12px", borderRadius: 8,
                border: "1px solid #E5E7EB", background: "#FFFFFF",
                fontSize: 13,
              }}>
                <span style={{ color: "#9CA3AF" }}>{Icons.search}</span>
                <input
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar detalle..."
                  style={{
                    border: "none", outline: "none", fontSize: 13,
                    color: "#111827", background: "transparent", width: 160,
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#9CA3AF" }}>{Icons.filter}</span>
                <select
                  value={selectedGeneral} onChange={(e) => setSelectedGeneral(e.target.value)}
                  style={{
                    padding: "7px 10px", borderRadius: 8,
                    border: "1px solid #E5E7EB", fontSize: 13,
                    color: "#374151", background: "#FFFFFF",
                    cursor: "pointer", outline: "none",
                  }}>
                  {generalCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: "auto" }}>
                {filteredTable.length} registros
              </span>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                  {["General", "Detallado", "Solicitado", "Egreso", "Abonos", "Ejecución"].map(h => (
                    <th key={h} style={{
                      fontSize: 11, fontWeight: 500, color: "#9CA3AF",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      padding: "11px 16px",
                      textAlign: ["General", "Detallado"].includes(h) ? "left" : "right",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTable.map((row, i) => {
                  const pct = row.egreso / row.solicitado;
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #F9FAFB" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "3px 8px", borderRadius: 6,
                          background: "#F3F4F6", fontSize: 11, fontWeight: 500, color: "#6B7280",
                        }}>{row.general}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "#111827" }}>
                        {row.detallado}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "right", color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>
                        {fmtFull(row.solicitado)}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "right", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                        {fmtFull(row.egreso)}
                      </td>
                      <td style={{
                        padding: "12px 16px", fontSize: 13, textAlign: "right", fontVariantNumeric: "tabular-nums",
                        color: row.abonos > 0 ? "#10B981" : "#D1D5DB",
                      }}>
                        {row.abonos > 0 ? fmtFull(row.abonos) : "—"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                          <div style={{ width: 52, height: 4, borderRadius: 2, background: "#F3F4F6", overflow: "hidden" }}>
                            <div style={{
                              width: `${Math.min(pct * 100, 100)}%`, height: "100%", borderRadius: 2,
                              background: pct > 0.95 ? "#EF4444" : pct > 0.85 ? "#F59E0B" : "#10B981",
                            }} />
                          </div>
                          <span style={{
                            fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right",
                            color: pct > 0.95 ? "#EF4444" : pct > 0.85 ? "#F59E0B" : "#10B981",
                          }}>
                            {(pct * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "#F9FAFB", borderTop: "2px solid #E5E7EB" }}>
                  <td colSpan={2} style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600 }}>TOTAL</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {fmtFull(filteredTable.reduce((s, r) => s + r.solicitado, 0))}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {fmtFull(filteredTable.reduce((s, r) => s + r.egreso, 0))}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#10B981" }}>
                    {fmtFull(filteredTable.reduce((s, r) => s + r.abonos, 0))}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>
                      {(filteredTable.reduce((s, r) => s + r.egreso, 0) / filteredTable.reduce((s, r) => s + r.solicitado, 0) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* ════════════════════════════════════════ */}
        {/* VIEW: APORTES DE CAPITAL */}
        {/* ════════════════════════════════════════ */}
        {activeView === "aportes" && (
          <>
            <div style={{
              background: "#FFFFFF", borderRadius: 12,
              border: "1px solid #F3F4F6", padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24,
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, letterSpacing: "-0.02em" }}>
                Estructura de Capital
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={aportesCapital} barGap={3} barCategoryGap="24%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} width={44} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="presupuesto" name="Solicitado" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="egreso" name="Ejecutado" fill="#1F2937" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {aportesCapital.map((a, i) => {
                const pct = a.egreso / a.presupuesto;
                return (
                  <div key={i} style={{
                    background: "#FFFFFF", borderRadius: 12,
                    border: "1px solid #F3F4F6", padding: "20px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 14 }}>{a.name}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                      {fmtCLP(a.egreso)}
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                      de {fmtCLP(a.presupuesto)} solicitado
                    </div>
                    <div style={{
                      width: "100%", height: 4, borderRadius: 2, background: "#F3F4F6", marginTop: 12, overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${pct * 100}%`, height: "100%", borderRadius: 2,
                        background: "linear-gradient(90deg, #F59E0B, #D97706)",
                      }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#D97706", marginTop: 6, textAlign: "right" }}>
                      {(pct * 100).toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </main>
    </div>
  );
}
