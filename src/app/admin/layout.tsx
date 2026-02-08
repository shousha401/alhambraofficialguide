import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-primary-100">
      <nav className="bg-primary-900 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link href="/admin" className="font-bold">
            Admin
          </Link>
          <Link href="/admin/tours" className="hover:text-primary-200">Tours</Link>
          <Link href="/admin/faqs" className="hover:text-primary-200">FAQs</Link>
          <Link href="/admin/blog" className="hover:text-primary-200">Blog</Link>
          <Link href="/admin/requests" className="hover:text-primary-200">Requests</Link>
          <Link href="/admin/legal" className="hover:text-primary-200">Legal</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
