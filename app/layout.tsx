import './globals.css'

export const metadata = {
  title: 'Stock Monitor',
  description: 'Monitor stock prices based on your target',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
