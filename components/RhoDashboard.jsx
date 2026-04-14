"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Treemap,
} from "recharts";
import {
  monthlyData, centrosNegocio, categoriasGeneral, aportesCapital,
  presupuestoGeneral, totalesReales,
} from "./data";

const LOGO = "data:image/png;base64,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";

// ── Formatting ──
const fmt = (n) => {
  if (n == null || isNaN(n)) return "$0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return sign+"$"+(abs/1e9).toFixed(2)+"B";
  if (abs >= 1e6) return sign+"$"+(abs/1e6).toFixed(1)+"M";
  if (abs >= 1e3) return sign+"$"+(abs/1e3).toFixed(0)+"K";
  return sign+"$"+abs.toLocaleString("es-CL");
};
const fmtFull = (n) => {
  if (n == null || isNaN(n)) return "$0";
  return "$"+Number(n).toLocaleString("es-CL");
};

// ── Icons ──
const I = {
  grid:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  dollar:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  bar:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  table:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  bldg:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></svg>,
  fund:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><path d="M9 20v-4h6v4"/></svg>,
  search:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

const Tip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:10,padding:"12px 16px",boxShadow:"0 4px 16px rgba(0,0,0,0.08)",fontSize:13}}>
      <div style={{fontWeight:600,marginBottom:4}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",gap:8,alignItems:"center",lineHeight:1.8}}>
          <span style={{width:8,height:8,borderRadius:2,background:p.color,flexShrink:0}}/>
          <span style={{color:"#6B7280"}}>{p.name}:</span>
          <span style={{fontWeight:500,fontVariantNumeric:"tabular-nums"}}>{fmtFull(p.value??0)}</span>
        </div>
      ))}
    </div>
  );
};

const TCell = (props) => {
  const {x,y,width,height,name,egreso} = props||{};
  if(!width||!height||width<55||height<38) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6} style={{fill:"rgba(56,118,29,0.08)",stroke:"rgba(56,118,29,0.2)",strokeWidth:1}}/>
      <text x={x+8} y={y+17} fontSize={10} fontWeight={600} fill="#111827" style={{fontFamily:"Inter,system-ui"}}>{width>120?(name||""):(name||"").split("(")[0].trim()}</text>
      <text x={x+8} y={y+33} fontSize={12} fontWeight={500} fill="#38761d" style={{fontFamily:"Inter,system-ui"}}>{fmt(egreso)}</text>
    </g>
  );
};

const ExecBar = ({pct,width=48}) => {
  const p = (pct==null||isNaN(pct)||!isFinite(pct))?0:pct;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end"}}>
      <div style={{width,height:4,borderRadius:2,background:"#F3F4F6",overflow:"hidden"}}>
        <div style={{width:`${Math.min(Math.abs(p)*100,100)}%`,height:"100%",borderRadius:2,background:p>1?"#EF4444":p>0.85?"#F59E0B":"#10B981"}}/>
      </div>
      <span style={{fontSize:12,fontWeight:600,fontVariantNumeric:"tabular-nums",minWidth:36,textAlign:"right",color:p>1?"#EF4444":p>0.85?"#F59E0B":"#10B981"}}>{p>0?(p*100).toFixed(0)+"%":"—"}</span>
    </div>
  );
};

export default function RhoDashboard() {
  const [view,setView] = useState("dashboard");
  const [catFilter,setCatFilter] = useState("Todos");
  const [search,setSearch] = useState("");

  const cats = ["Todos",...new Set(categoriasGeneral.map(c=>c.general))];
  const filtered = useMemo(()=>{
    let d=categoriasGeneral;
    if(catFilter!=="Todos") d=d.filter(r=>r.general===catFilter);
    if(search) d=d.filter(r=>(r.detallado+r.general).toLowerCase().includes(search.toLowerCase()));
    return d;
  },[catFilter,search]);

  const T = totalesReales;
  const execPct = T.egresoOp/(T.presupuesto||1);
  const proyectos = centrosNegocio.filter(c=>c.name!=="Oficina");

  const nav = [
    {id:"dashboard",label:"Dashboard",icon:I.grid},
    {id:"presupuesto",label:"Presupuesto vs Egreso",icon:I.bar},
    {id:"centros",label:"Centros de Negocio",icon:I.bldg},
    {id:"detalle",label:"Detalle Operacional",icon:I.table},
    {id:"aportes",label:"Aportes CORFO",icon:I.dollar},
    {id:"fondos",label:"Fondos Mutuos",icon:I.fund},
  ];

  const card = {background:"#fff",borderRadius:12,border:"1px solid #F3F4F6",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"};
  const th = (a="left")=>({fontSize:11,fontWeight:500,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.05em",padding:"11px 16px",textAlign:a});
  const td = (a="left",b=false)=>({padding:"12px 16px",fontSize:13,textAlign:a,fontWeight:b?500:400,fontVariantNumeric:"tabular-nums",color:b?"#111827":"#6B7280"});

  const GREEN = "#38761d"; // Rho's brand green

  return (
    <div style={{display:"flex",height:"100vh",width:"100%",background:"#FFFFFF",fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",color:"#111827",overflow:"hidden"}}>

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{width:260,minWidth:260,background:"#F9FAFB",borderRight:"1px solid #F3F4F6",display:"flex",flexDirection:"column",padding:"24px 12px"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0 12px 24px",borderBottom:"1px solid #F3F4F6",marginBottom:20}}>
          <img src={LOGO} alt="Rho Generación" style={{height:56,objectFit:"contain"}} />
        </div>

        <nav style={{display:"flex",flexDirection:"column",gap:2}}>
          {nav.map(n=>(
            <button key={n.id} onClick={()=>setView(n.id)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:"none",
              cursor:"pointer",fontSize:13.5,fontWeight:500,transition:"all 150ms",
              background:view===n.id?"rgba(56,118,29,0.08)":"transparent",
              color:view===n.id?GREEN:"#6B7280",
            }}>
              <span style={{opacity:view===n.id?1:0.6}}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        <div style={{marginTop:"auto",padding:"16px 12px"}}>
          <div style={{padding:"12px 14px",borderRadius:10,background:"#fff",border:"1px solid #E5E7EB",boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:11,color:"#9CA3AF",fontWeight:500,marginBottom:4}}>FONDO</div>
            <div style={{fontSize:13,fontWeight:600}}>CEHTA ESG</div>
            <div style={{fontSize:11,color:"#6B7280",marginTop:2}}>AFIS S.A. · CC Santander</div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main style={{flex:1,overflow:"auto",padding:"28px 36px",background:"#FFFFFF"}}>
        <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:600,letterSpacing:"-0.03em",margin:0}}>{nav.find(n=>n.id===view)?.label}</h1>
            <p style={{fontSize:13,color:"#9CA3AF",margin:"4px 0 0"}}>Rho Generación SpA · 519 mov. operacionales · Sept 2024 – Mar 2026</p>
          </div>
          <span style={{padding:"6px 14px",borderRadius:999,background:"rgba(56,118,29,0.08)",color:GREEN,fontSize:12,fontWeight:600}}>Datos Reales · CC Santander</span>
        </header>

        {/* ════════ DASHBOARD ════════ */}
        {view==="dashboard"&&<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
            {[
              {label:"Egresos Operacionales",value:fmt(T.egresoOp),sub:"Excl. Reversas, FFMM, Préstamos"},
              {label:"Presupuesto CORFO",value:fmt(T.presupuesto),sub:"Solicitado total"},
              {label:"Capital Recibido",value:fmt(T.capitalRecibido),sub:"Aportes CORFO en CC",vc:"#10B981"},
              {label:"Ejecución Ppto.",value:(execPct*100).toFixed(1)+"%",sub:fmt(T.presupuesto-T.egresoOp)+" disponible",vc:execPct>0.95?"#EF4444":GREEN},
            ].map((k,i)=>(
              <div key={i} style={{...card,padding:"20px 22px"}}>
                <div style={{fontSize:12,fontWeight:500,color:"#9CA3AF",marginBottom:8,letterSpacing:"0.02em"}}>{k.label}</div>
                <div style={{fontSize:26,fontWeight:600,color:k.vc||"#111827",letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums",lineHeight:1}}>{k.value}</div>
                <div style={{fontSize:12,color:"#9CA3AF",marginTop:8}}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:20,marginBottom:24}}>
            <div style={{...card,padding:"20px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <div style={{fontSize:15,fontWeight:600,letterSpacing:"-0.02em"}}>Egresos vs Presupuesto Mensual</div>
                  <div style={{fontSize:12,color:"#9CA3AF",marginTop:2}}>Solo movimientos operacionales</div>
                </div>
                <div style={{display:"flex",gap:14,fontSize:12}}>
                  {[[GREEN,"Presupuesto"],["#1F2937","Egreso Real"]].map(([c,l])=>(
                    <span key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{width:8,height:8,borderRadius:2,background:c}}/><span style={{color:"#6B7280"}}>{l}</span>
                    </span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barGap={2} barCategoryGap="16%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                  <XAxis dataKey="mes" tick={{fontSize:10,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:"#9CA3AF"}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} width={50}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="presupuesto" name="Presupuesto" fill={GREEN} radius={[4,4,0,0]}/>
                  <Bar dataKey="egreso" name="Egreso Real" fill="#1F2937" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{...card,padding:"20px 22px"}}>
              <div style={{fontSize:15,fontWeight:600,letterSpacing:"-0.02em",marginBottom:4}}>Egresos por Proyecto</div>
              <div style={{fontSize:12,color:"#9CA3AF",marginBottom:16}}>Distribución excl. Oficina</div>
              <ResponsiveContainer width="100%" height={220}>
                <Treemap data={proyectos} dataKey="egreso" nameKey="name" content={<TCell/>}/>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{...card,overflow:"hidden"}}>
            <div style={{padding:"16px 22px",borderBottom:"1px solid #F3F4F6",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:600,letterSpacing:"-0.02em"}}>Top Líneas de Gasto</div>
              <button onClick={()=>setView("detalle")} style={{fontSize:12,fontWeight:500,color:GREEN,background:"none",border:"none",cursor:"pointer"}}>Ver todo →</button>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"1px solid #F3F4F6"}}>
                {["Categoría","Detalle","Egreso Real","Solicitado","Ejecución"].map(h=>(
                  <th key={h} style={th(["Categoría","Detalle"].includes(h)?"left":"right")}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {categoriasGeneral.slice(0,7).map((r,i)=>{
                  const p=r.solicitado>0?r.egreso/r.solicitado:0;
                  return(
                    <tr key={i} style={{borderBottom:"1px solid #F9FAFB"}}>
                      <td style={td()}><span style={{padding:"3px 8px",borderRadius:6,background:"#F3F4F6",fontSize:11,fontWeight:500,color:"#6B7280"}}>{r.general.replace(/_/g," ")}</span></td>
                      <td style={td("left",true)}>{r.detallado}</td>
                      <td style={td("right",true)}>{fmt(r.egreso)}</td>
                      <td style={td("right")}>{r.solicitado>0?fmt(r.solicitado):"—"}</td>
                      <td style={{padding:"12px 16px"}}><ExecBar pct={p}/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>}

        {/* ════════ PRESUPUESTO ════════ */}
        {view==="presupuesto"&&<>
          <div style={{...card,padding:24,marginBottom:24}}>
            <div style={{fontSize:15,fontWeight:600,marginBottom:20}}>Egreso Operacional vs Presupuesto</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} barGap={3} barCategoryGap="14%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                <XAxis dataKey="mes" tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#9CA3AF"}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} width={52}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="presupuesto" name="Presupuesto" fill={GREEN} radius={[4,4,0,0]}/>
                <Bar dataKey="egreso" name="Egreso Real" fill="#1F2937" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {Object.entries(presupuestoGeneral).map(([g,sol])=>{
              const eg=categoriasGeneral.filter(c=>c.general===g).reduce((s,c)=>s+c.egreso,0);
              const p=eg/(sol||1);
              return(
                <div key={g} style={{...card,padding:"18px 20px"}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>{g.replace(/_/g," ")}</div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:"#9CA3AF"}}>Presupuesto</span>
                    <span style={{fontSize:13,fontWeight:500,fontVariantNumeric:"tabular-nums"}}>{fmt(sol)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{fontSize:11,color:"#9CA3AF"}}>Egreso Real</span>
                    <span style={{fontSize:13,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{fmt(eg)}</span>
                  </div>
                  <div style={{width:"100%",height:4,borderRadius:2,background:"#F3F4F6",overflow:"hidden"}}>
                    <div style={{width:`${Math.min(p*100,100)}%`,height:"100%",borderRadius:2,background:p>1?"#EF4444":p>0.85?"#F59E0B":"#10B981"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                    <span style={{fontSize:11,fontWeight:600,color:p>1?"#EF4444":"#10B981"}}>{p>1?"Sobre":"Disponible"}: {fmt(Math.abs(sol-eg))}</span>
                    <span style={{fontSize:12,fontWeight:600,color:p>1?"#EF4444":p>0.85?"#F59E0B":"#10B981"}}>{(p*100).toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ════════ CENTROS ════════ */}
        {view==="centros"&&<>
          <div style={{...card,padding:24,marginBottom:24}}>
            <div style={{fontSize:15,fontWeight:600,marginBottom:20}}>Presupuesto vs Egreso por Centro</div>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={centrosNegocio} layout="vertical" barGap={2} barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false}/>
                <XAxis type="number" tick={{fontSize:10,fill:"#9CA3AF"}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)}/>
                <YAxis type="category" dataKey="name" width={195} tick={{fontSize:11,fill:"#374151"}} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="presupuesto" name="Presupuesto" fill={GREEN} radius={[0,4,4,0]} barSize={12}/>
                <Bar dataKey="egreso" name="Egreso Real" fill="#1F2937" radius={[0,4,4,0]} barSize={12}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {centrosNegocio.map((c,i)=>{
              const p=c.presupuesto>0?c.egreso/c.presupuesto:0;const d=c.presupuesto-c.egreso;
              return(
                <div key={i} style={{...card,padding:"18px 20px"}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>{c.name}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                    <div><div style={{fontSize:11,color:"#9CA3AF"}}>Presupuesto</div><div style={{fontSize:15,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{c.presupuesto>0?fmt(c.presupuesto):"—"}</div></div>
                    <div><div style={{fontSize:11,color:"#9CA3AF"}}>Egreso</div><div style={{fontSize:15,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{fmt(c.egreso)}</div></div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:600,color:d>=0?"#10B981":"#EF4444"}}>{c.presupuesto>0?(d>=0?"+"+fmt(d)+" disp.":fmt(d)+" sobre"):"Sin ppto."}</span>
                    {p>0&&<span style={{padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:600,background:p>1?"rgba(239,68,68,0.08)":p>0.85?"rgba(245,158,11,0.08)":"rgba(16,185,129,0.08)",color:p>1?"#EF4444":p>0.85?"#D97706":"#10B981"}}>{(p*100).toFixed(0)}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ════════ DETALLE ════════ */}
        {view==="detalle"&&(
          <div style={{...card,overflow:"hidden"}}>
            <div style={{padding:"16px 22px",borderBottom:"1px solid #F3F4F6",display:"flex",gap:12,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:8,border:"1px solid #E5E7EB",fontSize:13}}>
                <span style={{color:"#9CA3AF"}}>{I.search}</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{border:"none",outline:"none",fontSize:13,background:"transparent",width:140}}/>
              </div>
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{padding:"7px 10px",borderRadius:8,border:"1px solid #E5E7EB",fontSize:13,color:"#374151",background:"#fff",cursor:"pointer",outline:"none"}}>
                {cats.map(c=><option key={c} value={c}>{c.replace(/_/g," ")}</option>)}
              </select>
              <span style={{fontSize:12,color:"#9CA3AF",marginLeft:"auto"}}>{filtered.length} líneas</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"1px solid #F3F4F6"}}>
                {["General","Detallado","Egreso Real","Solicitado","Abonos","Ejecución"].map(h=>(
                  <th key={h} style={th(["General","Detallado"].includes(h)?"left":"right")}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((r,i)=>{
                  const p=r.solicitado>0?r.egreso/r.solicitado:0;
                  return(
                    <tr key={i} style={{borderBottom:"1px solid #F9FAFB"}}>
                      <td style={td()}><span style={{padding:"3px 8px",borderRadius:6,background:"#F3F4F6",fontSize:11,fontWeight:500,color:"#6B7280"}}>{r.general.replace(/_/g," ")}</span></td>
                      <td style={td("left",true)}>{r.detallado||"Sin detalle"}</td>
                      <td style={td("right",true)}>{fmtFull(r.egreso)}</td>
                      <td style={td("right")}>{r.solicitado>0?fmtFull(r.solicitado):"—"}</td>
                      <td style={{...td("right"),color:r.abonos>0?"#10B981":"#D1D5DB"}}>{r.abonos>0?fmtFull(r.abonos):"—"}</td>
                      <td style={{padding:"12px 16px"}}><ExecBar pct={p} width={52}/></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr style={{background:"#F9FAFB",borderTop:"2px solid #E5E7EB"}}>
                <td colSpan={2} style={{padding:"12px 16px",fontSize:13,fontWeight:600}}>TOTAL</td>
                <td style={{...td("right",true)}}>{fmtFull(filtered.reduce((s,r)=>s+r.egreso,0))}</td>
                <td style={{...td("right",true)}}>{fmtFull(filtered.reduce((s,r)=>s+r.solicitado,0))}</td>
                <td style={{...td("right",true),color:"#10B981"}}>{fmtFull(filtered.reduce((s,r)=>s+r.abonos,0))}</td>
                <td style={{padding:"12px 16px",textAlign:"right"}}><span style={{fontSize:13,fontWeight:700,color:GREEN}}>{((filtered.reduce((s,r)=>s+r.egreso,0)/(filtered.reduce((s,r)=>s+r.solicitado,0)||1))*100).toFixed(1)}%</span></td>
              </tr></tfoot>
            </table>
          </div>
        )}

        {/* ════════ APORTES CORFO ════════ */}
        {view==="aportes"&&<>
          <div style={{...card,padding:24,marginBottom:24}}>
            <div style={{fontSize:15,fontWeight:600,marginBottom:20}}>Aportes CORFO — Recibido vs Ejecutado</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={aportesCapital} barGap={3} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/>
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#6B7280"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#9CA3AF"}} axisLine={false} tickLine={false} tickFormatter={v=>fmt(v)} width={52}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="abonos" name="Recibido" fill="#10B981" radius={[6,6,0,0]}/>
                <Bar dataKey="egreso" name="Ejecutado" fill="#1F2937" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {aportesCapital.map((a,i)=>{
              const bal=a.abonos-a.egreso;
              return(
                <div key={i} style={{...card,padding:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>{a.name}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
                    <div><div style={{fontSize:11,color:"#9CA3AF"}}>Recibido</div><div style={{fontSize:16,fontWeight:600,color:"#10B981",fontVariantNumeric:"tabular-nums"}}>{fmt(a.abonos)}</div></div>
                    <div><div style={{fontSize:11,color:"#9CA3AF"}}>Ejecutado</div><div style={{fontSize:16,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{fmt(a.egreso)}</div></div>
                  </div>
                  <div style={{borderTop:"1px solid #F3F4F6",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,color:"#9CA3AF"}}>Balance</span>
                    <span style={{fontSize:15,fontWeight:700,color:bal>=0?"#10B981":"#EF4444"}}>{bal>=0?"+":""}{fmt(bal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ════════ FONDOS MUTUOS ════════ */}
        {view==="fondos"&&<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
            {[
              {label:"Invertido en FFMM",value:fmt(T.fondosMutuos.invertido)},
              {label:"Rescatado",value:fmt(T.fondosMutuos.rescatado),vc:GREEN},
              {label:"Intereses Generados",value:fmt(T.fondosMutuos.intereses),vc:"#10B981"},
              {label:"Saldo en Fondos",value:fmt(T.fondosMutuos.saldo)},
            ].map((k,i)=>(
              <div key={i} style={{...card,padding:"20px 22px"}}>
                <div style={{fontSize:12,fontWeight:500,color:"#9CA3AF",marginBottom:8}}>{k.label}</div>
                <div style={{fontSize:26,fontWeight:600,color:k.vc||"#111827",letterSpacing:"-0.03em",fontVariantNumeric:"tabular-nums",lineHeight:1}}>{k.value}</div>
              </div>
            ))}
          </div>
          <div style={{...card,padding:24}}>
            <div style={{fontSize:15,fontWeight:600,marginBottom:16}}>Detalle Fondos Mutuos</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"1px solid #F3F4F6"}}>
                {["Fondo","Invertido","Rescatado","Intereses","Saldo"].map(h=>(
                  <th key={h} style={th(h==="Fondo"?"left":"right")}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[
                  {f:"Renta Corto Plazo-Ejecutivo",inv:260000000,res:167000000,int:4796886,sal:97796886},
                  {f:"Tesorería-Digital",inv:177000000,res:135500000,int:5329492,sal:46829492},
                ].map((r,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #F9FAFB"}}>
                    <td style={td("left",true)}>{r.f}</td>
                    <td style={td("right")}>{fmtFull(r.inv)}</td>
                    <td style={{...td("right"),color:"#10B981"}}>{fmtFull(r.res)}</td>
                    <td style={{...td("right"),color:"#10B981"}}>{fmtFull(r.int)}</td>
                    <td style={td("right",true)}>{fmtFull(r.sal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr style={{background:"#F9FAFB",borderTop:"2px solid #E5E7EB"}}>
                <td style={{padding:"12px 16px",fontSize:13,fontWeight:600}}>Total</td>
                <td style={td("right",true)}>{fmtFull(437000000)}</td>
                <td style={{...td("right",true),color:"#10B981"}}>{fmtFull(302500000)}</td>
                <td style={{...td("right",true),color:"#10B981"}}>{fmtFull(10126378)}</td>
                <td style={td("right",true)}>{fmtFull(144626378)}</td>
              </tr></tfoot>
            </table>
          </div>
        </>}
      </main>
    </div>
  );
}
