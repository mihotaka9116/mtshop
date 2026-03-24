import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, Mail, ArrowRight, ChevronDown, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  img: string;
  price: number;
  quantity: number;
}

// --- Navbar Component ---
const Navbar = ({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Concept', href: '#concept' },
    { name: 'Detail', href: '#detail' },
    { name: 'Look Book', href: '#lookbook' },
    { name: 'Shop', href: '#shop' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.a href="#" className="text-2xl font-bold tracking-tight text-accent-blue">
          Miho Takahashi
        </motion.a>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-xs uppercase font-bold tracking-widest creative-underline opacity-70 hover:opacity-100 transition-opacity">
              {link.name}
            </a>
          ))}
          <button onClick={onOpenCart} className="relative p-2 text-accent-blue hover:scale-110 transition-transform">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4 md:hidden">
          <button onClick={onOpenCart} className="relative p-2 text-accent-blue">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-accent-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
          <button className="text-accent-blue" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- Cart Component ---
const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }: any) => {
  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingCart size={48} strokeWidth={1} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                items.map((item: any) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="w-20 h-20 bg-pink-50 rounded-xl flex-shrink-0 p-2">
                      <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">¥{item.price.toLocaleString()}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100"><Minus size={14} /></button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t bg-pink-50/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-gray-800">¥{total.toLocaleString()}</span>
                </div>
                <button className="w-full bg-accent-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-lg transition-all">Checkout</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App Component ---
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen selection:bg-accent-blue selection:text-white">
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
      {/* 他のセクション（Hero, Concept, Detail, LookBook, Shop, Contact）がここに続く */}
    </div>


tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        // 'font-playfair' という名前で Playfair Display を登録
        'playfair': ['"Playfair Display"', 'serif'],
      },
      colors: {
        'accent-blue': '#2962ff',
      }
    }
  }
}
