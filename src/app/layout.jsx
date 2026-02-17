import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Smart Bookmark",
  description: "Save and manage your favorite links in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
