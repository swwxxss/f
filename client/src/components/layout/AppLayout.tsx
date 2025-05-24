import { ReactNode, useCallback } from "react";
import { Link, useLocation } from "wouter";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const activePage = location;

  const isActive = useCallback(
    (path: string) => activePage === path,
    [activePage]
  );

  return (
    <div className="flex flex-col min-h-screen bg-primary text-foreground">
      {/* Sticky Header + Navigation */}
      <div className="sticky top-0 z-50 bg-secondary shadow-md">
        {/* Header */}
        <header className="py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-foreground">
              Sin<span className="text-purple-500">&</span>Skin
            </h1>
            <div className="flex items-center space-x-4">
              <button className="bg-secondary p-2 rounded-full" aria-label="Notifications">
                <i className="fas fa-bell text-muted-foreground hover:text-purple-500"></i>
              </button>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium">U</span>
                </div>
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-t border-border">
          <div className="container mx-auto px-4">
            <div className="w-max mx-auto flex overflow-x-auto py-2" id="mainNav">
              {[
                { label: "Головна", href: "/" },
                { label: "AI Generator", href: "/generate" },
                { label: "Галерея", href: "/gallery" },
                { label: "Підписки", href: "/subscriptions" },
                { label: "Спільнота", href: "/community" },
                { label: "Профіль", href: "/profile" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-8 py-2 whitespace-nowrap hover:text-purple-500 ${
                    isActive(href) ? "border-b-2 border-purple-500 text-purple-500" : ""
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow overflow-auto">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-4 px-6 text-center text-muted-foreground text-sm">
        <p>© 2025 Sin&Skin. Усі права захищено.</p>
      </footer>
    </div>
  );
}
