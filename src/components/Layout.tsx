import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-100"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="inline-block">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-2xl font-bold tracking-tight">
                <span className="text-red-500">ALKA</span>
                <span className="text-gray-900">MOTEL</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>
      <div className="relative">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-xl" />
        <div className="relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
}