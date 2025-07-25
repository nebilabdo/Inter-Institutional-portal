export function NewFooter() {
  return (
    <footer className="bg-gradient-to-br from-[#2c4a61ff] to-[#a0c7e0ff] text-white py-10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">DataExchange</h2>

        {/* Description */}
        <p className="text-white/80 max-w-xl mx-auto mb-8 text-base leading-relaxed">
          DataExchange connects public institutions to share data quickly and safely. We help improve communication, reduce paperwork, and support better public services.
        </p>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm font-medium">
          <a href="#" className="hover:text-blue-200 transition">
            Home
          </a>
          <a href="#" className="hover:text-blue-200 transition">
            Services
          </a>
          <a href="#" className="hover:text-blue-200 transition">
            About
          </a>
          <a href="#" className="hover:text-blue-200 transition">
            Contact
          </a>
        </div>

        {/* Divider */}
        <div className="h-px w-24 bg-white/30 mx-auto mb-6"></div>

        {/* Copyright */}
        <p className="text-white/60 text-sm">
          &copy; {new Date().getFullYear()} DataExchange. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
