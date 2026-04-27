

const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500">&copy; 2026 My Portfolio. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="https://www.linkedin.com/in/halilibrahimataylar/" className="text-slate-700 hover:text-slate-900 transition-colors duration-200">LinkedIn</a>
          <a href="https://github.com/picomve" className="text-slate-700 hover:text-slate-900 transition-colors duration-200">GitHub</a>
          <a href="mailto:halilibrahim.ataylar@proton.me" className="text-slate-700 hover:text-slate-900 transition-colors duration-200">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;