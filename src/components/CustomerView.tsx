import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Clock, X, Plus, Minus, UtensilsCrossed, CircleDollarSign, Info, Coffee, Pizza, IceCream, Beer, Trash2 } from 'lucide-react';
import { menuItems } from '../data/menu';
import { useOrders } from '../contexts/OrderContext';
import type { MenuItem, CartItem } from '../types';

export default function CustomerView() {
  const { tableId } = useParams();
  const { orders, addOrder } = useOrders();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const categoryIcons = {
    all: UtensilsCrossed,
    starters: Coffee,
    mains: Pizza,
    desserts: IceCream,
    drinks: Beer,
  };

  const categories = ['all', 'starters', 'mains', 'desserts', 'drinks'];
  
  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const tableOrders = orders.filter(
    order => order.tableNumber === Number(tableId)
  ).sort((a, b) => b.timestamp - a.timestamp);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const addToCart = (menuItem: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === menuItem.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart =>
      prevCart.reduce((acc: CartItem[], item) => {
        if (item.id !== itemId) return [...acc, item];
        if (item.quantity > 1) return [...acc, { ...item, quantity: item.quantity - 1 }];
        return acc;
      }, [])
    );
  };

  const removeItemCompletely = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    addOrder(Number(tableId), cart);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 mb-24">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="text-red-500" size={24} />
          <h1 className="text-2xl font-bold">Table {tableId}</h1>
        </div>
        <button
          onClick={() => setShowHistory(true)}
          className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2 transition-colors"
        >
          <Clock size={20} />
          Order History
        </button>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {categories.map(category => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-xl capitalize whitespace-nowrap flex items-center gap-2 transition-colors ${
                selectedCategory === category
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={16} />
              {category}
            </button>
          );
        })}
      </div>

      <motion.div className="space-y-4">
        {filteredMenuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center p-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <Info size={14} className="text-gray-400" />
                  {item.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-red-500 font-semibold flex items-center gap-1">
                    <CircleDollarSign size={16} />
                    ₹{item.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-3">
                    {getItemQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1.5">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Minus size={18} className="text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {getItemQuantity(item.id)}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Plus size={18} className="text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="px-5 py-2.5 rounded-xl flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      >
                        <Plus size={18} />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Cart Button */}
      <motion.button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600
                   rounded-full w-16 h-16 shadow-lg flex items-center justify-center
                   hover:scale-110 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <div className="relative">
          <ShoppingCart size={24} className="text-white" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-500 
                           rounded-full w-5 h-5 flex items-center justify-center 
                           text-xs font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </div>
      </motion.button>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={24} className="text-red-500" />
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <X size={24} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <ShoppingCart size={48} className="mb-4" />
                    <p className="text-lg">Your cart is empty</p>
                    <p className="text-sm">Add items to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      {cart.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          className="flex items-center gap-4 py-4 border-b"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItemCompletely(item.id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-xl"
                          >
                            <Trash2 size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-xl font-bold">₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={placeOrder}
                        className="w-full px-6 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-lg font-medium transition-colors"
                      >
                        Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 w-full bg-white rounded-t-xl shadow-lg max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={24} className="text-red-500" />
                    <h2 className="text-2xl font-bold">Order History</h2>
                  </div>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <X size={24} />
                  </button>
                </div>
                {tableOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={48} className="mx-auto mb-4" />
                    <p className="text-lg">No order history yet</p>
                    <p className="text-sm">Your orders will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tableOrders.map(order => (
                      <div
                        key={order.id}
                        className="bg-gray-50 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">
                            {new Date(order.timestamp).toLocaleString()}
                          </span>
                          <span className={`px-3 py-1.5 rounded-xl text-sm ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'preparing' ? 'bg-red-100 text-red-800' :
                            order.status === 'ready' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2"
                          >
                            <span>{item.quantity}× {item.name}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t mt-2 pt-2 flex justify-between items-center font-semibold">
                          <span>Total</span>
                          <span>₹{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}