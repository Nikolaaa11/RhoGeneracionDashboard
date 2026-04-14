# Rho Generación SpA — Dashboard Financiero

**FIP CEHTA ESG · AFIS S.A.**  
Dashboard de ejecución presupuestaria para Rho Generación SpA.

## Estructura

```
rho-dashboard/
├── app/
│   ├── globals.css          ← Estilos globales Apple-style
│   ├── layout.js            ← Layout raíz (metadata, font)
│   └── page.js              ← Página principal
├── components/
│   ├── RhoDashboard.jsx     ← Componente principal (client)
│   └── data.js              ← Datos financieros (PBIX extract)
├── public/                   ← Archivos estáticos
├── package.json
├── next.config.js
└── jsconfig.json
```

## Deploy a Vercel (paso a paso)

### Opción A — Desde GitHub (recomendado)

**Paso 1: Crear repositorio en GitHub**
```bash
cd rho-dashboard
git init
git add .
git commit -m "Rho Generación dashboard v1"
git branch -M main
git remote add origin https://github.com/Nikolaaa11/rho-dashboard.git
git push -u origin main
```

**Paso 2: Conectar en Vercel**
1. Ir a https://vercel.com/new
2. Importar el repo `rho-dashboard`
3. Framework Preset: **Next.js** (se detecta automático)
4. Click **Deploy**
5. Listo → URL tipo `rho-dashboard.vercel.app`

### Opción B — Deploy directo desde CMD

```bash
cd rho-dashboard
npm install
npx vercel
```
Seguir las instrucciones interactivas (seleccionar proyecto, confirmar settings).

## Desarrollo local

```bash
npm install
npm run dev
```
Abrir http://localhost:3000
