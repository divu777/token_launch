import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white   flex flex-col justify-between items-center">
      <div className="max-w-6xl  flex flex-col justify-between items-center py-5">
        <div className="text-center mb-8">
          <p className="text-purple-400 text-sm mb-2">For general queries</p>
          <h2 className="text-2xl md:text-4xl font-bold">contact@divakar.com</h2>
        </div>
        
        <nav className="flex justify-between items-center gap-10">
          <Link href="/about" className=" font-semibold hover:text-gray-300 transition-colors">ABOUT</Link>
          <Link href="/marketplace" className=" font-semibold hover:text-gray-300 transition-colors">MARKETPLACE</Link>
          <Link href="/how-it-works" className=" font-semibold hover:text-gray-300 transition-colors">HOW IT WORKS</Link>
          <Link href="/collection" className=" font-semibold hover:text-gray-300 transition-colors">GENERATOR</Link>

        </nav>
      </div>

      <div className="w-screen ">
        <div className="text-center pb-10 border-b border-solid border-white">
          <h1 className=" text-9xl  font-bold text-blue-600 text-[10rem]">DIVAKAR</h1>
        </div>

        
        <div className="flex justify-evenly items-center py-10">
          <Link href="https://facebook.com" className="border border-white rounded-full px-8 py-4 text-xl font-semibold hover:bg-white hover:text-black transition-colors">
            GITHUB
          </Link>
          <Link href="https://instagram.com" className="border border-white rounded-full px-8 py-4 text-xl font-semibold hover:bg-white hover:text-black transition-colors">
            LINKEDIN
          </Link>
          <Link href="https://twitter.com" className="border border-white rounded-full px-8 py-4 text-xl font-semibold hover:bg-white hover:text-black transition-colors">
            TWITTER
          </Link>
        </div>
      </div>
      
    </footer>
  )
}