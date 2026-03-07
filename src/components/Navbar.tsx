import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "MEMBERS" },
    { path: "/about", label: "ABOUT" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        <Link
          to="/"
          className="font-display text-sm tracking-widest text-gray-400"
        >
          A<span className="text-red-500/60 text-lg">X</span>K
        </Link>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-accent text-sm tracking-[0.3em] transition-colors duration-300 ${
                location.pathname === link.path
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  className="h-px mt-1"
                  style={{ background: "hsl(var(--primary))" }}
                  layoutId="nav-underline"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
