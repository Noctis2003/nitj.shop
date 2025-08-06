"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";


export default function ITMarketplace() {

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  phone: string;
  image: string ;
  userId: string;
  publicId: string | null;
};


  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);



  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/get');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } 
  };

  const openImagePreview = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeImagePreview = () => {
    setSelectedProduct(null);
  };

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImagePreview();
      }
    };

    if (selectedProduct) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <p className="text-white">Please sign in to view the marketplace.</p>
      </div>
    );
  }

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 002 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white hidden xs:block">Buy and Sell</h1>
              <h1 className="text-sm font-bold text-white block xs:hidden">B&S</h1>
            </div>

            {/* User info and actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/marketplace/sell">
                <button className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs sm:text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 rounded-lg shadow-lg hover:shadow-green-500/25 border border-green-500/30">
                  <span className="flex items-center space-x-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Sell</span>
                  </span>
                </button>
              </Link>
             
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm hidden sm:block font-medium transition-colors duration-200" href={`/profile`}>
                    {session?.user?.name || session?.user?.email?.split('@')[0]}
                </Link>
                <Link className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors duration-200 block sm:hidden" href={`/profile`}>
                    Profile
                </Link>
              
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-lg hover:shadow-white/10"
                >
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 group cursor-pointer"
              onClick={() => openImagePreview(product)}
            >
              {/* Product Image */}
             <div className="w-full h-64 bg-red-600 overflow-hidden relative group">
  <img
    src={product.image}
    alt={product.name}
  
    className="object-cover transition-transform duration-500 group-hover:scale-110"
  />
</div>
              
              <div className="p-6">
                {/* Product Name */}
                <h3 className="text-xl font-bold text-white mb-4">
                  {product.name}
                </h3>
              
              {/* Product Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-green-400">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              
              {/* Phone Number */}
              <div className="mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-blue-400 font-medium">
                  {product.phone}
                </span>
              </div>
              
              {/* Product Description */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
              
                {/* Contact Button */}
                
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </main>

      {/* Image Preview Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeImagePreview}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeImagePreview}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

           
          
              
              
          </div>
        </div>
      )}
    </div>
  );
}