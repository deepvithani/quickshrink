import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
  } from "react-icons/fa";
  
  const Footer = () => {
    return (
      <footer className="bg-[#0b1f3b] text-slate-300">
        {/* TOP GRID */}
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div
            className="
              grid gap-12
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-6
            "
          >
            {/* WHY QUICKSHRINK */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-orange-400">
                Why Quickshrink?
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Integrations & API</li>
                <li>Enterprise Class</li>
                <li>Pricing</li>
              </ul>
            </div>
  
            {/* PRODUCTS */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-orange-400">
                Products
              </h4>
              <ul className="space-y-2 text-sm">
                <li>URL Shortener</li>
                <li>QR Code Generator</li>
                <li>2D Barcodes</li>
                <li>Analytics</li>
                <li>Pages</li>
              </ul>
            </div>
  
            {/* SOLUTIONS */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-orange-400">
                Solutions
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Retail</li>
                <li>Consumer Goods</li>
                <li>Hospitality</li>
                <li>Media & Entertainment</li>
                <li>Healthcare</li>
                <li>Education</li>
              </ul>
            </div>
  
            {/* RESOURCES */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-orange-400">
                Resources
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Blog</li>
                <li>Guides & eBooks</li>
                <li>Customer Stories</li>
                <li>Developers</li>
                <li>Help Center</li>
              </ul>
            </div>
  
            {/* LEGAL */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-orange-400">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>Terms of Service</li>
                <li>Transparency Report</li>
              </ul>
            </div>
  
            {/* COMPANY */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-orange-400">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>About Quickshrink</li>
                <li>Careers</li>
                <li>Partners</li>
                <li>Press</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* DIVIDER */}
        <div className="border-t border-white/10" />
  
        {/* BOTTOM BAR */}
        <div className="mx-auto max-w-7xl px-6 py-8 text-center">
          <p className="mb-4 text-sm text-slate-400">
            © 2025 Quickshrink | Handmade worldwide.
          </p>
  
          <div className="flex justify-center gap-6 text-lg text-slate-400">
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaLinkedinIn className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  