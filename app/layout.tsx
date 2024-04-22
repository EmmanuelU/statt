import './globals.css'

import config from "@/app/constants/config"
 

const font = config.font

export const metadata = {
  metadataBase: new URL(config.metadata.url),
  title: config.metadata.title,
  description: config.metadata.description,
  openGraph: {
    title: config.metadata.title,
    description: config.metadata.description,
    url: config.metadata.url,
    siteName: config.metadata.title,
    images: config.metadata.images,
    locale: config.metadata.locale,
    type: "website",
  },
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
      </body>
    </html>
  )
}
