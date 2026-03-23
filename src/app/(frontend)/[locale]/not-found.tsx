import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F0EEE9] px-6">
      <div className="text-center max-w-lg">
        <div className="font-mono text-8xl text-[#00F5D4] mb-6 font-bold">404</div>
        <h1 className="font-serif text-4xl text-[#101417] mb-4">Page Not Found</h1>
        <p className="font-sans text-[#101417]/60 mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-[#101417] text-[#F0EEE9] hover:bg-[#00F5D4] hover:text-[#101417] transition-all duration-500 font-sans text-sm px-8 py-4 tracking-wide"
        >
          <ArrowLeft size={14} />
          Back to Home
        </a>
      </div>
    </main>
  )
}
