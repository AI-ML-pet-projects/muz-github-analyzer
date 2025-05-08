"use client";

import {
  FiHome,
  FiCode,
  FiCreditCard,
  FiSettings,
  FiBook,
  FiChevronLeft,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const menuItems = [
  { icon: FiHome, label: "Overview", href: "/dashboard", exact: true },
  // { icon: FileLock, label: "Protected", href: "/protected" },
  { icon: FiCode, label: "API Playground", href: "/dashboard/playground" },
  // { icon: FiBox, label: "Use Cases", href: "/dashboard/use-cases" },
  { icon: FiCreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: FiSettings, label: "Settings", href: "/dashboard/settings" },
  { icon: FiBook, label: "Documentation", href: "/dashboard/docs" },
  // { icon: FiTerminal, label: "Dandi MCP", href: "/dashboard/mcp" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAuth = async () => {
    if (session) {
      await signOut({ redirect: true, callbackUrl: "/" });
    } else {
      await signIn("google", { callbackUrl: "/dashboard", redirect: true });
    }
  };

  const SidebarContent = () => (
    <>
      <div className='p-6'>
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-2"
          } mb-8 transition-all duration-300 ease-in-out`}
        >
          {/* <Image
            src='/dandi-logo.svg'
            alt='Dandi'
            className='h-8 w-8 transition-transform duration-300 ease-in-out'
            width={32}
            height={32}
          /> */}
          <Link href='/'>
            <Github className='h-8 w-8 transition-transform duration-300 ease-in-out' />
          </Link>
          <span
            className={`font-bold text-xl text-[#2d3748] transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100 w-auto"
            }`}
          >
            Muz
          </span>
        </div>

        <div className='space-y-1'>
          <div
            className={`px-3 py-2 transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "opacity-0 h-0 overflow-hidden"
                : "opacity-100 h-auto"
            }`}
          >
            <div className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Personal
            </div>
          </div>

          <nav className='flex flex-col gap-1'>
            {menuItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "gap-2"
                  } px-3 py-2 text-sm rounded-md transition-all duration-300 ease-in-out ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className='h-4 w-4 transition-transform duration-300 ease-in-out' />
                  <span
                    className={`transition-all duration-300 ease-in-out ${
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100 w-auto"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className='mt-auto p-4 border-t border-gray-200'>
        {session ? (
          <div className='space-y-4'>
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "gap-3 px-2"
              } transition-all duration-300 ease-in-out`}
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  width={32}
                  height={32}
                  className='rounded-full'
                />
              ) : (
                <div className='bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-medium'>
                  {session.user?.name?.[0] || "U"}
                </div>
              )}
              <div
                className={`flex-1 transition-all duration-300 ease-in-out ${
                  isCollapsed ? "hidden" : "opacity-100 w-auto"
                }`}
              >
                <div className='font-medium text-sm text-gray-900'>
                  {session.user?.name}
                </div>
                <div className='text-xs text-gray-500'>
                  {session.user?.email}
                </div>
              </div>
            </div>
            <Button
              onClick={handleAuth}
              variant='ghost'
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center px-2" : "justify-start px-3"
              } gap-2 text-red-600 hover:text-red-700 hover:bg-red-50`}
            >
              <FiLogOut className='h-4 w-4' />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAuth}
            className={`w-full ${isCollapsed ? "px-2" : "px-3"}`}
          >
            {isCollapsed ? "In" : "Sign In"}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md'
      >
        {isMobileMenuOpen ? (
          <FiX className='h-6 w-6 text-gray-600' />
        ) : (
          <FiMenu className='h-6 w-6 text-gray-600' />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden transition-transform duration-300 ease-in-out`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex ${
          isCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-gray-200 flex-col min-h-screen relative transition-[width] duration-300 ease-in-out`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50 transition-transform duration-300 ease-in-out'
          style={{
            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <FiChevronLeft className='h-4 w-4 text-gray-600' />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
