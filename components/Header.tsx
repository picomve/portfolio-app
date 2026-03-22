import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-cyan-700">
          Picomve's portfolio
        </Link>
        <nav className="flex gap-6 text-slate-600 font-medium">
          <Link href="/" className="hover:text-cyan-700 transition-colors duration-200">
            Home
          </Link>
          <Link href="/about" className="hover:text-cyan-700 transition-colors duration-200">
            About
          </Link>
          <Link href="/contact" className="hover:text-cyan-700 transition-colors duration-200">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;