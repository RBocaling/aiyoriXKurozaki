import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, AlertTriangle } from "lucide-react";
import VideoBackground from "@/components/VideoBackground";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("/admin");
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 4000);
    }
  };

  return (
    <>
      <VideoBackground />
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", damping: 20 }}
          style={{ perspective: "1000px" }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="glass border border-border rounded-2xl p-8 text-center"
            animate={shake ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border border-border"
              style={{ background: "hsl(var(--secondary))" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
            >
              <Lock className="w-7 h-7 text-muted-foreground" />
            </motion.div>

            <h1 className="font-display text-xl tracking-wider text-chrome-bright mb-1">ADMIN</h1>
            <p className="font-accent text-[10px] tracking-[0.4em] text-muted-foreground mb-8">AUTHENTICATION REQUIRED</p>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground font-body focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground font-body focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-xs font-accent tracking-wider"
                  style={{ background: "hsl(0 62% 50% / 0.15)", color: "hsl(0 80% 65%)", border: "1px solid hsl(0 62% 50% / 0.3)" }}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Invalid credentials. Access denied.
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl font-accent text-sm tracking-wider transition-opacity"
              style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              AUTHENTICATE
            </motion.button>
          </motion.form>
        </motion.div>
      </main>
    </>
  );
};

export default AdminLogin;
