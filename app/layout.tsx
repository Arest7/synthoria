import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingNotes from '@/components/ui/FloatingNotes';

export const metadata: Metadata = {
  title: "Synthoria - IT Music Platform",
  description: "PhD dissertatsiyasi doirasida yaratilgan interaktiv raqamli musiqa ta'limi platformasi. Andijon davlat pedagogika instituti (ADPI).",
  keywords: "musiqa ta'limi, AKT, MIDI, Synthesizers, SeeMusic, Synthesia, Midiano, ADPI, dissertatsiya, estetik tarbiya, Synthoria",
  authors: [{ name: "Ashurov Ma’rufjon Abdumutalibovich" }],
  openGraph: {
    title: "Synthoria IT Music Platform",
    description: "Interactive digital music education platform for Grades 5-7. Developed for PhD Dissertation.",
    url: "https://adpi.uz",
    siteName: "Synthoria IT-Music",
    locale: "uz_UZ",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-dark-bg dark:text-slate-100 min-h-screen flex flex-col relative transition-colors duration-300 antialiased overflow-x-hidden">
        <LanguageProvider>
          <ThemeProvider>
            {/* Ambient Floating Music Notes Background */}
            <FloatingNotes />
            
            {/* Header / Navigation */}
            <Navbar />
            
            {/* Main Page Content */}
            <main className="flex-grow z-10 relative">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
