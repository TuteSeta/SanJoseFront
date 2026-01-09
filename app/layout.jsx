import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "./components/ui/footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Barrio Santo Basket",
  description: "Sitio oficial del club Barrio Santo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/humane"
          rel="stylesheet"
        />
        <meta name="color-scheme" content="light" />
      </head>
      <body className="antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
