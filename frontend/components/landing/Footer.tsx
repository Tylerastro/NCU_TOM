import Link from "next/link";

// Hoisted to module level - year won't change during a session
const currentYear = new Date().getFullYear();

export function Footer() {

  return (
    <footer className="max-w-6xl mx-auto pt-12 border-t border-gray-800/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-semibold text-gray-200">NCU TOM</div>
            <div className="text-sm text-gray-500">
              National Central University
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-sm text-gray-500">
          <Link
            href="/about"
            className="hover:text-amber-500 transition-colors"
          >
            About Us
          </Link>
          <a
            href="https://www.lulin.ncu.edu.tw/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-500 transition-colors"
          >
            Lulin Observatory
          </a>
          <a
            href="https://www.astro.ncu.edu.tw/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-500 transition-colors"
          >
            NCU Website
          </a>
        </nav>
      </div>
      <div className="text-center text-sm text-gray-600 mt-8">
        © {currentYear} National Central University. All rights reserved.
      </div>
    </footer>
  );
}
