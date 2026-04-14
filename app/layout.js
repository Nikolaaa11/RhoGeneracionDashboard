import './globals.css';

export const metadata = {
  title: 'Rho Generación SpA — Dashboard Financiero',
  description: 'Plataforma de gestión financiera — FIP CEHTA ESG · AFIS S.A.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
