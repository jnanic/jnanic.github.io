export type NavLink = {
  href: `#${string}` | string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];
