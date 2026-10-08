import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppNavbar from "./components/AppNavbar";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Campus IT Helpdesk",
  description: "Campus IT Helpdesk System",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <AppNavbar />

        {children}
      </body>
    </html>
  );
}