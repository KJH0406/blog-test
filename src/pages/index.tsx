import localFont from 'next/font/local'
import { createClient } from '../../utils/supabase/client'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

const supabase = createClient()

export default function Home() {
  return (
    <main>
      <h1>hi</h1>
    </main>
  )
}
