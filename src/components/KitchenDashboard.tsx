import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Timer, Bell, ChefHat, Filter, Utensils, CircleDollarSign, Clock, CheckCheck } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import type { Order } from '../types';

export default function KitchenDashboard() {
  const { orders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  const filteredOrders = orders
    .filter(order => order.status !== 'served')
    .filter(order => filter === 'all' || order.status === filter)
    .sort((a, b) => b.timestamp - a.timestamp);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-red-100 text-red-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return Timer;
      case 'preparing':
        return ChefHat;
      case 'ready':
        return CheckCheck;
      default:
        return Bell;
    }
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = getStatusIcon(order.status);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-md p-4 mb-4"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Utensils className="text-red-500" size={20} />
            <h3 className="font-semibold text-lg">Table {order.tableNumber}</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)} flex items-center gap-1`}>
              <StatusIcon size={14} />
              {order.status}
            </span>
          </div>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Clock size={14} />
            {new Date(order.timestamp).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex-1">
                <span className="text-gray-800">{item.quantity}× {item.name}</span>
                {item.specialInstructions && (
                  <p className="text-sm text-gray-500 italic ml-6">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold flex items-center gap-1 text-red-500">
              <CircleDollarSign size={16} />
              ₹{order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'preparing')}
              className="flex-1 btn-primary bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg"
            >
              <ChefHat size={20} />
              Start Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'ready')}
              className="flex-1 btn-primary bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg"
            >
              <CheckCircle2 size={20} />
              Mark as Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'served')}
              className="flex-1 btn-primary bg-gray-500 hover:bg-gray-600 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg"
            >
              <Bell size={20} />
              Mark as Served
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ChefHat size={28} className="text-red-500" />
          <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'preparing', 'ready'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg capitalize flex items-center gap-2 ${
                filter === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={16} />
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode='popLayout'>
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}