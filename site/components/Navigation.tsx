 'use client';

 import React, { useCallback, useEffect, useRef, useState } from 'react';
 import Link from 'next/link';
 import { usePathname } from 'next/navigation';
 import ThemeToggle from './ThemeToggle';

 export default function Navigation() {
   const pathname = usePathname();
   const isHomepage = pathname === '/';
   const showThemeToggle = isHomepage || pathname.startsWith('/blog');
   const [isOpen, setIsOpen] = useState(false);
   const menuButtonRef = useRef<HTMLButtonElement>(null);
   const scrollFrameRef = useRef<number>(undefined);

   const closeMenu = useCallback(() => {
     setIsOpen(false);
     menuButtonRef.current?.focus({ preventScroll: true });
   }, []);

   useEffect(() => {
     const onKey = (e: KeyboardEvent) => {
       if (e.key === 'Escape' && isOpen) closeMenu();
     };
     window.addEventListener('keydown', onKey);
     return () => window.removeEventListener('keydown', onKey);
   }, [closeMenu, isOpen]);

   useEffect(() => {
     document.body.style.overflow = isOpen ? 'hidden' : '';
     return () => {
       document.body.style.overflow = '';
     };
   }, [isOpen]);

   useEffect(() => () => {
     if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
   }, []);

   const navItems = [
     { label: 'Home', href: '#hero' },
     { label: 'About', href: '#about' },
     { label: 'Projects', href: '#projects' },
     { label: 'Writing', href: '/blog/' },
     { label: 'Contact', href: '#contact' },
   ];

   const handleNavClick = (href: string) => {
     closeMenu();
     document.body.style.removeProperty('overflow');

     if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
     scrollFrameRef.current = requestAnimationFrame(() => {
       const el = document.querySelector(href);
       const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
       if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
     });
   };

   return (
     <>
      {/* Top-right controls: Theme toggle + Hamburger */}
       <div className="fixed right-6 top-6 z-50 flex items-center gap-3">
         {showThemeToggle && (
           <div className="flex items-center">
             <ThemeToggle />
           </div>
         )}

         <button
           ref={menuButtonRef}
           onClick={() => setIsOpen((s) => !s)}
           className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-zaffre text-white shadow-lg transition-all hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-zaffre"
           aria-label={isOpen ? 'Close menu' : 'Open menu'}
           aria-expanded={isOpen}
           aria-controls="site-navigation"
         >
           <span className="relative block h-5 w-5">
             <span
               className={`absolute left-0 top-0 block h-0.5 w-5 bg-white transition-all duration-300 ${
                 isOpen ? 'top-2 rotate-45' : ''
               }`}
             />
             <span
               className={`absolute left-0 top-2 block h-0.5 w-5 bg-white transition-all duration-300 ${
                 isOpen ? 'opacity-0' : 'opacity-100'
               }`}
             />
             <span
               className={`absolute left-0 top-4 block h-0.5 w-5 bg-white transition-all duration-300 ${
                 isOpen ? 'top-2 -rotate-45' : ''
               }`}
             />
           </span>
         </button>
       </div>

       {/* Backdrop */}
       <div
         className={`fixed inset-0 z-40 backdrop-blur-sm transition-all duration-300 ${
           isOpen ? 'pointer-events-auto bg-black/30 opacity-100' : 'pointer-events-none opacity-0'
         }`}
         onClick={closeMenu}
         aria-hidden="true"
       />

       {/* Slide-in panel */}
       <nav
         id="site-navigation"
         inert={!isOpen}
         className={`fixed right-0 top-0 z-40 h-full w-64 transition-transform duration-300 ease-in-out ${
           isOpen ? 'translate-x-0' : 'translate-x-full'
         }`}
         aria-label="Main navigation"
       >
         <div className="flex h-full flex-col items-start justify-center space-y-8 px-16">
           {navItems.map((item, i) => {
             const isPageLink = item.href.startsWith('/');
             const isActive = isPageLink && pathname.startsWith(item.href.replace(/\/$/, ''));
             const sharedStyle = {
               transitionDelay: isOpen ? `${i * 50}ms` : '0ms',
               opacity: isOpen ? 1 : 0,
               transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
             };
             const sharedClass = 'group text-2xl font-medium transition-all hover:text-brand-zaffre focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-zaffre';

             if (isPageLink || !isHomepage) {
               return (
                 <Link
                   key={item.href}
                   href={isPageLink ? item.href : `/${item.href}`}
                   onClick={closeMenu}
                   className={sharedClass}
                   style={sharedStyle}
                 >
                   {item.label}
                   <span className={`block h-0.5 bg-brand-zaffre transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                 </Link>
               );
             }

             return (
               <a
                 key={item.href}
                 href={item.href}
                 onClick={(e) => {
                   if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                   e.preventDefault();
                   handleNavClick(item.href);
                 }}
                 className={sharedClass}
                 style={sharedStyle}
               >
                 {item.label}
                 <span className="block h-0.5 w-0 bg-brand-zaffre transition-all duration-300 group-hover:w-full" />
               </a>
             );
           })}
         </div>
       </nav>
     </>
   );
 }
