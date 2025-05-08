"use client";

import {
  FiGithub,
  FiMoon,
  FiMail,
  FiBell,
  FiSearch,
  FiSun,
} from "react-icons/fi";
import { useState } from "react";

export function Topbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className='sticky top-0 z-30 bg-white border-b border-gray-200'>
      <div className='px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        {/* Left Section */}
        <div className='flex items-center gap-4'>
          <div className='hidden lg:block'>
            <h1 className='text-xl font-semibold text-gray-900'>Overview</h1>
          </div>

          {/* Search Bar */}
          <div className='relative max-w-md flex-1 hidden sm:block'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search...'
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* System Status */}
          <div className='hidden sm:flex items-center gap-2'>
            <div className='flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium'>
              <div className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></div>
              <span className='hidden sm:inline'>Operational</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-2 sm:gap-4'>
            <button className='p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative'>
              <FiBell className='w-5 h-5' />
              <span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2'></span>
            </button>

            <a
              href='https://github.com/tavily'
              target='_blank'
              rel='noopener noreferrer'
              className='p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex'
            >
              <FiGithub className='w-5 h-5' />
            </a>

            <a
              href='mailto:support@tavily.com'
              className='p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex'
            >
              <FiMail className='w-5 h-5' />
            </a>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className='p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors'
            >
              {isDarkMode ? (
                <FiSun className='w-5 h-5' />
              ) : (
                <FiMoon className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search - Shown below header on mobile */}
      <div className='sm:hidden px-4 pb-4'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FiSearch className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search...'
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          />
        </div>
      </div>
    </div>
  );
}
