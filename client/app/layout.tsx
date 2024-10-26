import { IntlProvider } from "@/app/_providers/intl/intl-provider";
import { SWRProvider } from "@/app/_providers/swr";
import { ThemeProvider } from "@/app/_providers/theme/theme-provider";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatify",
  description: "Your one and only chatting app",
};

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {

  return (
    <html lang="en">
    <body className="antialiased">
    <SWRProvider>
      <IntlProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="min-w-screen min-h-screen pt-[4.5rem] relative">
            <Navbar/>
            {children}
            <Footer/>
          </main>
        </ThemeProvider>
      </IntlProvider>
    </SWRProvider>
    </body>
    </html>
  );
}
