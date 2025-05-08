"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuth = async () => {
    if (session) {
      await signOut({ redirect: true, callbackUrl: "/" });
    } else {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto py-4 px-4 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='flex items-center gap-2'>
            <Github className='h-8 w-8 text-primary' />
            <span className='text-xl font-bold'>Muz GitHub Analyzer</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          <Link
            href='#features'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            Features
          </Link>
          <Link
            href='#demo'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            Demo
          </Link>
          <Link
            href='#pricing'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            Pricing
          </Link>
          <Link
            href='#'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            Docs
          </Link>
          {session && (
            <Link
              href='/dashboard'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Auth Button */}
        <div className='hidden md:flex items-center gap-4'>
          {session && session.user?.image && (
            <Image
              src={session.user.image}
              alt='Profile'
              className='w-8 h-8 rounded-full'
              width={32}
              height={32}
            />
          )}
          <Button onClick={handleAuth}>
            {session ? "Sign Out" : "Sign In"}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden'
          onClick={toggleMenu}
          aria-label='Toggle menu'
        >
          {isMenuOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <Menu className='h-6 w-6' />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden py-4 px-4 bg-background border-b'>
          <nav className='flex flex-col space-y-4'>
            <Link
              href='#features'
              className='text-muted-foreground hover:text-foreground transition-colors py-2'
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href='#demo'
              className='text-muted-foreground hover:text-foreground transition-colors py-2'
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href='#pricing'
              className='text-muted-foreground hover:text-foreground transition-colors py-2'
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href='#'
              className='text-muted-foreground hover:text-foreground transition-colors py-2'
              onClick={() => setIsMenuOpen(false)}
            >
              Docs
            </Link>
            {session && (
              <Link
                href='/dashboard'
                className='text-muted-foreground hover:text-foreground transition-colors py-2'
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className='flex items-center gap-4'>
              {session && session.user?.image && (
                <Image
                  src={session.user.image}
                  alt='Profile'
                  className='w-8 h-8 rounded-full'
                  width={32}
                  height={32}
                />
              )}
              <Button
                onClick={() => {
                  handleAuth();
                  setIsMenuOpen(false);
                }}
              >
                {session ? "Sign Out" : "Sign In"}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
