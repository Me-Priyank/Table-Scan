export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starters' | 'mains' | 'desserts' | 'drinks';
  imageUrl: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
  timestamp: number;
  total: number;
}