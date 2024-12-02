import { Link } from 'react-router-dom';
import { UtensilsCrossed, Coffee, Pizza, IceCream, Beer, ChefHat, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const categories = [
    { icon: Coffee, label: 'Starters' },
    { icon: Pizza, label: 'Mains' },
    { icon: IceCream, label: 'Desserts' },
    { icon: Beer, label: 'Drinks' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <UtensilsCrossed size={40} className="text-white" />
        </div>
        <motion.h1 
          className="text-6xl font-bold mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-red-500">ALKA</span>
          <span className="text-gray-900">MOTEL</span>
        </motion.h1>
        <div className="w-20 h-1 bg-red-500 mx-auto mb-6" />
        <p className="text-gray-600 text-xl flex items-center justify-center gap-2">
          <ChefHat className="text-red-500" />
          Experience Culinary Excellence
        </p>

        <div className="flex justify-center gap-8 mt-8 mb-12">
          {categories.map(({ icon: Icon, label }) => (
            <div key={label} className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-2 mx-auto"
              >
                <Icon size={24} className="text-red-500" />
              </motion.div>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          {tables.map((tableNum) => (
            <motion.div
              key={tableNum}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={`/table/${tableNum}`}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-center block group"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  Table {tableNum}
                </h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                  Tap to order
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/kitchen"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-black transition-all duration-200 shadow-lg"
            >
              <ChefHat size={24} />
              <span className="font-semibold">Kitchen Dashboard</span>
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}