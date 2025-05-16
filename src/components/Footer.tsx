export const Footer = () => (
  <footer className="w-full bg-[#2D3748] border-t border-white/10 shadow-lg mt-10">
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <span className="font-mono text-lg font-bold text-white">
          dev<span className="text-sky-600">.io</span>
        </span>
        <span className="hidden sm:inline text-gray-300 text-sm ml-2">
          &copy; {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-300 text-sm">
        <span className="sm:mx-2">Built with ❤️ for developers</span>
        <span className="hidden sm:inline">|</span>
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-200 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>
);
