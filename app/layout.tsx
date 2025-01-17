import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { ThemeSwitch } from "@/components/theme-switch";
import { HeartFilledIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const navbar = [
  { key: "photos", title: "Photos", href: "/photos" },
  { key: "music", title: "Music" },
  { key: "videos", title: "Videos" },
  { key: "finance", title: "Finance", href: "/finance" },
  { key: "person", title: "Person" },
  { key: "profile", title: <HeartFilledIcon size={18} />, href: "/sign" },
  { key: "theme", title: <ThemeSwitch /> },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/* Navbar */}
          <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
            <Navbar tabs={navbar} />
          </div>

          <div className="relative flex flex-col h-screen">
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>

            {/* 固定在底部并居中 */}

            <footer className="w-full flex items-center justify-center py-3">
              {/* Footer content */}
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
