import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Explain Naija — Big information. Made simple.",
  description:
    "Understand Nigerian public notices, official documents, circulars, and policies in simple English, Pidgin, Yoruba, Hausa, or Igbo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#1A2421] selection:bg-[#BEF264] selection:text-[#0C281C]">
        {children}
      </body>
    </html>
  );
}
