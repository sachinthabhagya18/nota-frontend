import "./globals.css";

export const metadata = {
  title: "Nota | Smart pen for real thinking",
  description: "High-end interactive landing page clone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}