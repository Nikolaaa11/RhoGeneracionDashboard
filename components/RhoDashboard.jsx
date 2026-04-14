"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Treemap,
} from "recharts";
import {
  monthlyData, centrosNegocio, categoriasGeneral, aportesCapital,
} from "./data";

// ── Formatting ──
const fmtCLP = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString("es-CL")}`;
};
const fmtFull = (n) => `$${n.toLocaleString("es-CL")}`;
const fmtPct = (n) => `${(n * 100).toFixed(1)}%`;

// ── Icons (Lucide-style inline SVG) ──
const I = {
  grid: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  dollar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  bar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  table: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  bldg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></svg>,
  up: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  down: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

// ── Custom Tooltip ──
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:10, padding:"12px 16px", boxShadow:"0 4px 16px rgba(0,0,0,0.08)", fontSize:13 }}>
      <div style={{ fontWeight:600, color:"#111827", marginBottom:4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display:"flex", gap:8, alignItems:"center", lineHeight:1.8 }}>
          <span style={{ width:8, height:8, borderRadius:2, background:p.color, flexShrink:0 }}/>
          <span style={{ color:"#6B7280" }}>{p.name}:</span>
          <span style={{ fontWeight:500, color:"#111827", fontVariantNumeric:"tabular-nums" }}>{fmtFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ── Treemap cell ──
const TCell = ({ x, y, width, height, name, egreso }) => {
  if (width < 55 || height < 38) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6}
        style={{ fill:"rgba(245,158,11,0.10)", stroke:"rgba(245,158,11,0.22)", strokeWidth:1 }}/>
      <text x={x+8} y={y+17} fontSize={11} fontWeight={600} fill="#111827"
        style={{ fontFamily:"Inter, system-ui" }}>{width > 100 ? name : name?.split(" ")[0]}</text>
      <text x={x+8} y={y+33} fontSize={12} fontWeight={500} fill="#D97706"
        style={{ fontFamily:"Inter, system-ui" }}>{fmtCLP(egreso)}</text>
    </g>
  );
};

// ── Execution bar ──
const ExecBar = ({ pct, width = 48 }) => (
  <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"flex-end" }}>
    <div style={{ width, height:4, borderRadius:2, background:"#F3F4F6", overflow:"hidden" }}>
      <div style={{
        width:`${Math.min(pct*100,100)}%`, height:"100%", borderRadius:2,
        background: pct>0.95 ? "#EF4444" : pct>0.85 ? "#F59E0B" : "#10B981",
      }}/>
    </div>
    <span style={{
      fontSize:12, fontWeight:600, fontVariantNumeric:"tabular-nums", minWidth:32, textAlign:"right",
      color: pct>0.95 ? "#EF4444" : pct>0.85 ? "#F59E0B" : "#10B981",
    }}>{(pct*100).toFixed(0)}%</span>
  </div>
);

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
export default function RhoDashboard() {
  const [view, setView] = useState("dashboard");
  const [catFilter, setCatFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const cats = ["Todos", ...new Set(categoriasGeneral.map(c => c.general))];

  const filtered = useMemo(() => {
    let d = categoriasGeneral;
    if (catFilter !== "Todos") d = d.filter(r => r.general === catFilter);
    if (search) d = d.filter(r => (r.detallado + r.general).toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [catFilter, search]);

  const totals = useMemo(() => {
    const e = monthlyData.reduce((s, m) => s + m.egreso, 0);
    const p = monthlyData.reduce((s, m) => s + m.presupuesto, 0);
    const a = monthlyData.reduce((s, m) => s + m.abonos, 0);
    return { egreso: e, presupuesto: p, abonos: a, exec: e / p };
  }, []);

  const nav = [
    { id:"dashboard", label:"Dashboard", icon:I.grid },
    { id:"presupuesto", label:"Presupuesto vs Egreso", icon:I.bar },
    { id:"centros", label:"Centros de Negocio", icon:I.bldg },
    { id:"detalle", label:"Detalle Operacional", icon:I.table },
    { id:"aportes", label:"Aportes de Capital", icon:I.dollar },
  ];

  // ── Shared styles ──
  const card = { background:"#fff", borderRadius:12, border:"1px solid #F3F4F6", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" };
  const thStyle = (align = "left") => ({ fontSize:11, fontWeight:500, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em", padding:"11px 16px", textAlign:align });
  const tdStyle = (align = "left", bold = false) => ({ padding:"12px 16px", fontSize:13, textAlign:align, fontWeight:bold?500:400, fontVariantNumeric:"tabular-nums", color:bold?"#111827":"#6B7280" });

  return (
    <div style={{ display:"flex", height:"100vh", width:"100%", background:"#FFFFFF", fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,system-ui,sans-serif", color:"#111827", overflow:"hidden" }}>

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{ width:260, minWidth:260, background:"#F9FAFB", borderRight:"1px solid #F3F4F6", display:"flex", flexDirection:"column", padding:"24px 12px" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 12px", marginBottom:32 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#F59E0B,#D97706)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14, boxShadow:"0 2px 8px rgba(245,158,11,0.3)" }}>Rho</div>
          <div>
            <div style={{ fontWeight:600, fontSize:14, color:"#111827", letterSpacing:"-0.02em" }}>Rho Generación</div>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:500 }}>Energía Agrovoltaica</div>
          </div>
        </div>

        <nav style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13.5, fontWeight:500, transition:"all 150ms",
              background: view===n.id ? "rgba(245,158,11,0.08)" : "transparent",
              color: view===n.id ? "#D97706" : "#6B7280",
            }}>
              <span style={{ opacity:view===n.id?1:0.6 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop:"auto", padding:"16px 12px" }}>
          <div style={{ padding:"12px 14px", borderRadius:10, background:"#fff", border:"1px solid #E5E7EB", boxShadow:"0 1px 2px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:11, color:"#9CA3AF", fontWeight:500, marginBottom:4 }}>FONDO</div>
            <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>CEHTA ESG</div>
            <div style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>AFIS S.A. · Portafolio</div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main style={{ flex:1, overflow:"auto", padding:"28px 36px", background:"#FFFFFF" }}>
        {/* Header */}
        <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:600, letterSpacing:"-0.03em", margin:0 }}>
              {nav.find(n => n.id===view)?.label}
            </h1>
            <p style={{ fontSize:13, color:"#9CA3AF", margin:"4px 0 0" }}>Rho Generación SpA · Ejercicio 2025</p>
          </div>
          <span style={{ padding:"6px 14px", borderRadius:999, background:"rgba(245,158,11,0.08)", color:"#D97706", fontSize:12, fontWeight:600 }}>Agrovoltaico</span>
        </header>

        {/* ════════════ DASHBOARD ════════════ */}
        {view === "dashboard" && <>
          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
            {[
              { label:"Total Egresos", value:fmtCLP(totals.egreso), sub:"Ejecución acumulada", ch:-2.1 },
              { label:"Presupuesto Total", value:fmtCLP(totals.presupuesto), sub:"Solicitado anual", ch:null },
              { label:"Total Abonos", value:fmtCLP(totals.abonos), sub:"Ingresos recibidos", ch:12.4, vc:"#10B981" },
              { label:"Ejecución Ppto.", value:fmtPct(totals.exec), sub:"Egreso / Solicitado", ch:null, vc:totals.exec>0.95?"#EF4444":"#F59E0B" },
            ].map((k, i) => (
              <div key={i} style={{ ...card, padding:"20px 22px" }}>
                <div style={{ fontSize:12, fontWeight:500, color:"#9CA3AF", marginBottom:8, letterSpacing:"0.02em" }}>{k.label}</div>
                <div style={{ fontSize:26, fontWeight:600, color:k.vc||"#111827", letterSpacing:"-0.03em", fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{k.value}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8, fontSize:12 }}>
                  {k.ch!==null && <span style={{ display:"inline-flex", alignItems:"center", gap:2, color:k.ch>0?"#10B981":"#EF4444", fontWeight:600 }}>{k.ch>0?I.up:I.down}{Math.abs(k.ch)}%</span>}
                  <span style={{ color:"#9CA3AF" }}>{k.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:20, marginBottom:24 }}>
            <div style={{ ...card, padding:"20px 22px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:600, letterSpacing:"-0.02em" }}>Presupuesto vs Egreso Mensual</div>
                  <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>Comparativa ejecución 2025</div>
                </div>
                <div style={{ display:"flex", gap:14, fontSize:12 }}>
                  {[["#F59E0B","Solicitado"],["#111827","Egreso"]].map(([c,l]) => (
                    <span key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ width:8, height:8, borderRadius:2, background:c }}/><span style={{ color:"#6B7280" }}>{l}</span>
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barGap={2} barCategoryGap="18%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="mes" tick={{ fontSize:11, fill:"#9CA3AF" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:"#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1e6).toFixed(0)}M`} width={40}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="presupuesto" name="Solicitado" fill="#F59E0B" radius={[4,4,0,0]}/>
                  <Bar dataKey="egreso" name="Egreso" fill="#111827" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ ...card, padding:"20px 22px" }}>
              <div style={{ fontSize:15, fontWeight:600, letterSpacing:"-0.02em", marginBottom:4 }}>Egresos por Centro</div>
              <div style={{ fontSize:12, color:"#9CA3AF", marginBottom:16 }}>Distribución proporcional</div>
              <ResponsiveContainer width="100%" height={220}>
                <Treemap data={centrosNegocio} dataKey="egreso" nameKey="name" content={<TCell/>}/>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick table */}
          <div style={{ ...card, overflow:"hidden" }}>
            <div style={{ padding:"16px 22px", borderBottom:"1px solid #F3F4F6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:15, fontWeight:600, letterSpacing:"-0.02em" }}>Top Líneas de Gasto</div>
              <button onClick={() => setView("detalle")} style={{ fontSize:12, fontWeight:500, color:"#F59E0B", background:"none", border:"none", cursor:"pointer" }}>Ver todo →</button>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ borderBottom:"1px solid #F3F4F6" }}>
                {["Categoría","Detalle","Solicitado","Egreso","Ejecución"].map(h => (
                  <th key={h} style={thStyle(["Categoría","Detalle"].includes(h)?"left":"right")}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {categoriasGeneral.slice(0,6).map((r, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid #F9FAFB" }}>
                    <td style={tdStyle()}><span style={{ padding:"3px 8px", borderRadius:6, background:"#F9FAFB", fontSize:11, fontWeight:500, color:"#6B7280" }}>{r.general}</span></td>
                    <td style={tdStyle("left",true)}>{r.detallado}</td>
                    <td style={tdStyle("right")}>{fmtCLP(r.solicitado)}</td>
                    <td style={tdStyle("right",true)}>{fmtCLP(r.egreso)}</td>
                    <td style={{ padding:"12px 16px" }}><ExecBar pct={r.egreso/r.solicitado}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ════════════ PRESUPUESTO ════════════ */}
        {view === "presupuesto" && <>
          <div style={{ ...card, padding:24, marginBottom:24 }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:20, letterSpacing:"-0.02em" }}>Ejecución Presupuestaria Mensual</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} barGap={3} barCategoryGap="14%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                <XAxis dataKey="mes" tick={{ fontSize:12, fill:"#9CA3AF" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:"#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1e6).toFixed(0)}M`} width={44}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="presupuesto" name="Solicitado" fill="#F59E0B" radius={[4,4,0,0]}/>
                <Bar dataKey="egreso" name="Egreso" fill="#1F2937" radius={[4,4,0,0]}/>
                <Bar dataKey="abonos" name="Abonos" fill="#10B981" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {monthlyData.map((m, i) => {
              const p = m.egreso/m.presupuesto;
              return (
                <div key={i} style={{ ...card, padding:"14px 16px" }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#9CA3AF", marginBottom:8 }}>{m.mes} 2025</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:"#9CA3AF" }}>Solicitado</span>
                    <span style={{ fontSize:12, fontWeight:500, fontVariantNumeric:"tabular-nums" }}>{fmtCLP(m.presupuesto)}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:11, color:"#9CA3AF" }}>Egreso</span>
                    <span style={{ fontSize:12, fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{fmtCLP(m.egreso)}</span>
                  </div>
                  <div style={{ width:"100%", height:3, borderRadius:2, background:"#F3F4F6", overflow:"hidden" }}>
                    <div style={{ width:`${Math.min(p*100,100)}%`, height:"100%", borderRadius:2, background:p>1?"#EF4444":p>0.9?"#F59E0B":"#10B981" }}/>
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, marginTop:4, textAlign:"right", color:p>1?"#EF4444":p>0.9?"#F59E0B":"#10B981" }}>{(p*100).toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ════════════ CENTROS ════════════ */}
        {view === "centros" && <>
          <div style={{ ...card, padding:24, marginBottom:24 }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:20, letterSpacing:"-0.02em" }}>Presupuesto vs Egreso por Centro</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={centrosNegocio} layout="vertical" barGap={2} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false}/>
                <XAxis type="number" tick={{ fontSize:11, fill:"#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1e6).toFixed(0)}M`}/>
                <YAxis type="category" dataKey="name" width={190} tick={{ fontSize:12, fill:"#374151" }} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="presupuesto" name="Solicitado" fill="#F59E0B" radius={[0,4,4,0]} barSize={14}/>
                <Bar dataKey="egreso" name="Egreso" fill="#1F2937" radius={[0,4,4,0]} barSize={14}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {centrosNegocio.map((c, i) => {
              const p = c.egreso/c.presupuesto, d = c.presupuesto-c.egreso;
              return (
                <div key={i} style={{ ...card, padding:"18px 20px" }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>{c.name}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                    <div><div style={{ fontSize:11, color:"#9CA3AF" }}>Solicitado</div><div style={{ fontSize:15, fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{fmtCLP(c.presupuesto)}</div></div>
                    <div><div style={{ fontSize:11, color:"#9CA3AF" }}>Egreso</div><div style={{ fontSize:15, fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{fmtCLP(c.egreso)}</div></div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, fontWeight:600, color:d>=0?"#10B981":"#EF4444" }}>{d>=0?"+":""}{fmtCLP(d)} {d>=0?"disponible":"sobrepasado"}</span>
                    <span style={{ padding:"3px 8px", borderRadius:6, fontSize:11, fontWeight:600, background:p>1?"rgba(239,68,68,0.08)":p>0.9?"rgba(245,158,11,0.08)":"rgba(16,185,129,0.08)", color:p>1?"#EF4444":p>0.9?"#D97706":"#10B981" }}>{(p*100).toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ════════════ DETALLE ════════════ */}
        {view === "detalle" && (
          <div style={{ ...card, overflow:"hidden" }}>
            <div style={{ padding:"16px 22px", borderBottom:"1px solid #F3F4F6", display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", borderRadius:8, border:"1px solid #E5E7EB", fontSize:13 }}>
                <span style={{ color:"#9CA3AF" }}>{I.search}</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar detalle..." style={{ border:"none", outline:"none", fontSize:13, color:"#111827", background:"transparent", width:160 }}/>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#9CA3AF" }}>{I.filter}</span>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding:"7px 10px", borderRadius:8, border:"1px solid #E5E7EB", fontSize:13, color:"#374151", background:"#fff", cursor:"pointer", outline:"none" }}>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <span style={{ fontSize:12, color:"#9CA3AF", marginLeft:"auto" }}>{filtered.length} registros</span>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ borderBottom:"1px solid #F3F4F6" }}>
                {["General","Detallado","Solicitado","Egreso","Abonos","Ejecución"].map(h => (
                  <th key={h} style={thStyle(["General","Detallado"].includes(h)?"left":"right")}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid #F9FAFB" }}>
                    <td style={tdStyle()}><span style={{ padding:"3px 8px", borderRadius:6, background:"#F3F4F6", fontSize:11, fontWeight:500, color:"#6B7280" }}>{r.general}</span></td>
                    <td style={tdStyle("left",true)}>{r.detallado}</td>
                    <td style={tdStyle("right")}>{fmtFull(r.solicitado)}</td>
                    <td style={tdStyle("right",true)}>{fmtFull(r.egreso)}</td>
                    <td style={{ ...tdStyle("right"), color:r.abonos>0?"#10B981":"#D1D5DB" }}>{r.abonos>0?fmtFull(r.abonos):"—"}</td>
                    <td style={{ padding:"12px 16px" }}><ExecBar pct={r.egreso/r.solicitado} width={52}/></td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr style={{ background:"#F9FAFB", borderTop:"2px solid #E5E7EB" }}>
                <td colSpan={2} style={{ padding:"12px 16px", fontSize:13, fontWeight:600 }}>TOTAL</td>
                <td style={{ ...tdStyle("right",true) }}>{fmtFull(filtered.reduce((s,r)=>s+r.solicitado,0))}</td>
                <td style={{ ...tdStyle("right",true) }}>{fmtFull(filtered.reduce((s,r)=>s+r.egreso,0))}</td>
                <td style={{ ...tdStyle("right",true), color:"#10B981" }}>{fmtFull(filtered.reduce((s,r)=>s+r.abonos,0))}</td>
                <td style={{ padding:"12px 16px", textAlign:"right" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#F59E0B" }}>{(filtered.reduce((s,r)=>s+r.egreso,0)/filtered.reduce((s,r)=>s+r.solicitado,0)*100).toFixed(1)}%</span>
                </td>
              </tr></tfoot>
            </table>
          </div>
        )}

        {/* ════════════ APORTES ════════════ */}
        {view === "aportes" && <>
          <div style={{ ...card, padding:24, marginBottom:24 }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:20, letterSpacing:"-0.02em" }}>Estructura de Capital</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={aportesCapital} barGap={3} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize:12, fill:"#6B7280" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:"#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1e6).toFixed(0)}M`} width={44}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="presupuesto" name="Solicitado" fill="#F59E0B" radius={[6,6,0,0]}/>
                <Bar dataKey="egreso" name="Ejecutado" fill="#1F2937" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {aportesCapital.map((a, i) => {
              const p = a.egreso/a.presupuesto;
              return (
                <div key={i} style={{ ...card, padding:20 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>{a.name}</div>
                  <div style={{ fontSize:22, fontWeight:600, fontVariantNumeric:"tabular-nums", letterSpacing:"-0.02em" }}>{fmtCLP(a.egreso)}</div>
                  <div style={{ fontSize:12, color:"#9CA3AF", marginTop:4 }}>de {fmtCLP(a.presupuesto)} solicitado</div>
                  <div style={{ width:"100%", height:4, borderRadius:2, background:"#F3F4F6", marginTop:12, overflow:"hidden" }}>
                    <div style={{ width:`${p*100}%`, height:"100%", borderRadius:2, background:"linear-gradient(90deg,#F59E0B,#D97706)" }}/>
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:"#D97706", marginTop:6, textAlign:"right" }}>{(p*100).toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </>}

      </main>
    </div>
  );
}
