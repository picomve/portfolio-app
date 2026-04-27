import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Picomve
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/" className="transition hover:text-sky-700">
            Home
          </Link>
          <Link href="/about" className="transition hover:text-sky-700">
            About
          </Link>
        </nav>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Contact
        </Link>
      </div>
    </header>
  );
};

export default Header;