"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
    price: number;
    description: string;
    phone: string;
    image: string | null;
    createdAt: string;
    user: {
      id: string;
        username: string;
        email: string;
    };
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session && mounted && userProducts.length === 0) {
      fetchUserProducts();
    }
  }, [session, mounted]);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      // Filter products by current user's email
    
      setUserProducts(data);
    } catch (error) {
      console.error('Error fetching user products:', error);
      setError('Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Remove the deleted product from the list
      setUserProducts(userProducts.filter(product => product.id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <p className="text-white">Please sign in to view your profile.</p>
      </div>
    );
  }

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
            <Link href="/marketplace">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 002 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">Buy and Sell</h1>
              </div>
            </Link>

            {/* User info and actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/marketplace/sell">
                <button className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white text-sm sm:text-base font-semibold hover:bg-green-700 transition-all duration-300 rounded-2xl">
                  <span className="hidden sm:inline">Sell</span>
                  <span className="sm:hidden">+</span>
                </button>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-white text-xs sm:text-sm hidden md:block">
                  {session?.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-2 py-2 sm:px-4 sm:py-2 bg-white/20 text-white text-xs sm:text-sm rounded-full hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30 min-w-0"
                >
                  <span className="hidden sm:inline">Sign Out</span>
                  <span className="sm:hidden">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">My Products</h2>
          <p className="text-gray-300">Manage your listings</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 group"
              >
                {/* Product Image */}
                
                
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
                      {product.description.length > 100 ? (
                        <>
                          {product.description.substring(0, 50)}...
                        </>
                      ) : (
                        product.description
                      )}
                    </p>
                  </div>
                  
                  {/* Created Date */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs">
                      Created: {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No products state */}
        {!loading && !error && userProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m10-6V4a2 2 0 00-2-2H8a2 2 0 00-2 2v3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
            <p className="text-gray-400 mb-4">Start selling by creating your first listing</p>
            <Link href="/marketplace/sell">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                Create Listing
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}