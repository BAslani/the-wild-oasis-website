import '@/app/_styles/globals.css'
import { Josefin_Sans } from 'next/font/google'
import Header from './_components/Header'

const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: {
    template: 'The Wild Oasis | %s',
    default: 'Welcome to The Wild Oasis',
  },
  description:
    'Luxurious cabin hotel, located in the heart of Italian Dolomites, surrounded by beautiful mountains and dark forests.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${josefin.className} bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}
      >
        <Header />
        <div className='flex-1 px-8 py-12 grid'>
          <main className='max-w-7xl mx-auto w-full'>{children}</main>
        </div>
      </body>
    </html>
  )
}
