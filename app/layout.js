import { Space_Grotesk, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Elegant serif used only by the Gallery page's hero/quote band, to match
// that page's editorial-photography reference design.
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "ASM Dance Studio — Where Every Rhythm Finds a Home",
  description:
    "Bhubaneswar's premier destination for dance and fitness excellence. Classical to freestyle, kids to pros — book your free trial class today.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
