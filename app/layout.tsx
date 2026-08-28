import type { Metadata } from "next";
import { getTrevoBootstrap } from "@trevosdk/nextjs";
import { TrevoProvider } from "@trevosdk/react";
import Header from "@/components/header";
import Newsletter from "@/components/newsletter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terra & Twine",
  description: "Thoughtful goods for people who talk to their plants.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await getTrevoBootstrap();

  return (
    <html lang="en">
      <body
        className="antialiased bg-stone-50 text-stone-900 min-h-screen flex flex-col"
      >
        <TrevoProvider
          apiKey={process.env.NEXT_PUBLIC_TREVO_API_KEY}
          bootstrap={bootstrap}
        >
          <Header />
          <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">
            {children}
          </main>
          <Newsletter />
          <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
            Terra &amp; Twine — a demo storefront. No real plants were harmed.
          </footer>
        </TrevoProvider>
      </body>
    </html>
  );
}
