import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["600"] });

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#F5F5F5]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <img src="/logo.svg" alt="" className="h-10 w-10" />
              <span className={`${inter.className} text-2xl font-bold text-black`}>Clario</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Clario helps patients understand medical bills, identify questionable charges, and take action — with confidence.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Clario provides informational support only. It is not a legal or medical service.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { label: "Analyze a bill", href: "/upload" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "How it works", href: "#how-it-works" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy policy", href: "/privacy" },
                { label: "Terms of use", href: "/terms" },
                { label: "Disclaimer", href: "/disclaimer" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Clario. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Not affiliated with any hospital, insurer, or government agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
