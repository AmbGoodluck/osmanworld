"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Tech', href: '/tech' },
  { name: 'Fashion', href: '/fashion' },
  { name: 'Entrepreneurship', href: '/entrepreneurship' },
];

export default function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="flex justify-center gap-4 py-4 bg-[#1A3A8F] text-white">
      {tabs.map(tab => (
        <Link
          key={tab.name}
          href={tab.href}
          className={`px-4 py-2 rounded transition-colors duration-200 ${pathname === tab.href ? 'bg-maroon text-white' : 'hover:bg-gray-400/20'}`}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}
