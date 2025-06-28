import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 15 Threads Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Root layout rendered");
  console.log("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "Present" : "Missing");
  
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }
  
  return (
    <html lang='en'>
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        afterSignUpUrl="/onboarding"
      >
        <body className={`${inter.className} bg-dark-1`}>
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
} 