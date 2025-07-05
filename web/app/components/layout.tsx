import Link from "next/link"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full p-4 sm:max-w-md lg:max-w-sm">
        <Link
          href="/"
          className="mb-2 inline-block font-mono text-muted-fg text-xs uppercase hover:text-fg"
        >
          Acme
        </Link>
        {children}
      </div>
    </div>
  )
}
