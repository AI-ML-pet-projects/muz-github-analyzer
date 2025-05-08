"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className='rounded-full border border-solid border-red-500 transition-colors flex items-center justify-center bg-red-500 text-white gap-2 hover:bg-red-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5'
      >
        {session.user.image && (
          <Image
            src={session.user.image}
            alt='Profile'
            width={20}
            height={20}
            className='rounded-full'
          />
        )}
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className='rounded-full border border-solid transition-colors flex items-center justify-center bg-white text-gray-600 gap-2 hover:bg-gray-50 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5'
    >
      <Image src='/google.svg' alt='Google logo' width={20} height={20} />
      Sign in with Google
    </button>
  );
}
