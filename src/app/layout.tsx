import AppWalletProvider from "./components/AppWalletProvider";

export const metadata = {
  title: "TokenForge: Your Solana Token Launchpad",
  description:
    "TokenForge is your gateway to creating and managing your own Solana tokens effortlessly. With an intuitive dashboard, you can track all your creations and explore a vibrant marketplace to discover tokens crafted by others. Unleash your creativity and dive into the world of Solana tokens today!",
  keywords:
    "Solana, token creation, NFT marketplace, dashboard, cryptocurrency",
  author: "Divakar", // Replace with your name or your team's name,
  favicon:"https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmbmeX4QMTTxi417QXNDbqRBKnhRHk27iH1wMgEBG83hPg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <link rel="icon" href={metadata.favicon} />
      </head>
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
