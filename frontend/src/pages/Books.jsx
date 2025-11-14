import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from "../assets/logo.svg"

export default function BooksListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate()

  const booksPerPage = 8;

  // Sample book data
  const allBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.99, cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", price: 14.99, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop" },
    { id: 3, title: "1984", author: "George Orwell", price: 13.99, cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", price: 11.99, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop" },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", price: 13.49, cover: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=600&fit=crop" },
    { id: 6, title: "Moby Dick", author: "Herman Melville", price: 15.99, cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop" },
    { id: 7, title: "The Hobbit", author: "J.R.R. Tolkien", price: 16.99, cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop" },
    { id: 8, title: "Jane Eyre", author: "Charlotte Brontë", price: 12.49, cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop" },
    { id: 9, title: "Brave New World", author: "Aldous Huxley", price: 14.49, cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop" },
    { id: 10, title: "The Odyssey", author: "Homer", price: 13.99, cover: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400&h=600&fit=crop" },
    { id: 11, title: "Wuthering Heights", author: "Emily Brontë", price: 11.99, cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop" },
    { id: 12, title: "Frankenstein", author: "Mary Shelley", price: 12.99, cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop" },
    { id: 13, title: "The Divine Comedy", author: "Dante Alighieri", price: 17.99, cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop" },
    { id: 14, title: "Crime and Punishment", author: "Fyodor Dostoevsky", price: 15.49, cover: "https://images.unsplash.com/photo-1509266272358-7701da638078?w=400&h=600&fit=crop" },
    { id: 15, title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", price: 18.99, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop" },
    { id: 16, title: "Anna Karenina", author: "Leo Tolstoy", price: 16.49, cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop" },
  ];

  const totalPages = Math.ceil(allBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = allBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handleNavigation = (page) => {
    navigate(page)
  };

  const handleAddToCart = (book) => {
    setCartCount(cartCount + 1);
    console.log(`Added to cart: ${book.title}`);
  };

  const handleAddToWishlist = (book) => {
    setWishlistCount(wishlistCount + 1);
    console.log(`Added to wishlist: ${book.title}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-teal-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={Logo} alt="logo" className='w-16 h-16' />
              <span className="text-xl font-bold text-gray-800">Book Store</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <Link to={"/profile"} className="font-medium hidden sm:inline">Profile</Link>
              </button>

              <button
                onClick={() => handleNavigation('/wishlist')}
                className="relative flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavigation('/cart')}
                className="relative flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Our Collection</h1>
            <p className="text-gray-600">Discover {allBooks.length} amazing books</p>
          </div>
          <button
            onClick={() => handleNavigation('/new-book')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="text-xl font-bold">+</span>
            <span className="font-semibold">Add New Book</span>
          </button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {currentBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 truncate">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-3 truncate">{book.author}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-cyan-600">${book.price}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToWishlist(book)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm font-medium">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </button>

          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                    ? 'bg-teal-500 text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Page Info */}
        <div className="text-center mt-4 text-gray-600 text-sm">
          Showing {indexOfFirstBook + 1} - {Math.min(indexOfLastBook, allBooks.length)} of {allBooks.length} books
        </div>
      </div>
    </div>
  );
}