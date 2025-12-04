import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ChevronLeft, ChevronRight, LucideShoppingBag, RotateCw } from 'lucide-react';
import Logo from "../assets/logo.svg";
import { useSelector } from 'react-redux';
import { getBooks } from '../controllers/bookController';
import { useQuery } from "@tanstack/react-query";
import Spinner from '../components/Spinner';
import { REACT_BASE_URL } from '../config/evnConfig';

export default function BooksListPage() {

  const { data: allBooks = [], error, isLoading, refetch } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const state = useSelector((state) => state);
  const navigate = useNavigate();

  const booksPerPage = 8;

  const totalPages = Math.ceil((allBooks?.length || 0) / booksPerPage);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  const currentBooks = allBooks?.slice(indexOfFirstBook, indexOfLastBook) || [];

  const handleNavigation = (page) => {
    navigate(page);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBookUi = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[70vh] text-gray-700">
          <Spinner className="mb-8" />
          <span className="text-lg font-medium">Loading books...</span>
        </div>
      )
    } else if (error) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[70vh] text-red-500">
          <span className="text-xl font-semibold mb-2">Oops! Something went wrong</span>
          <span className="text-gray-600">Unable to fetch books. Please try again later.</span>
          <button onClick={refetch} className="mt-4 text-gray-600 cursor-pointer"><RotateCw /></button>
        </div>
      )
    } else if (allBooks.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[70vh] text-gray-700">
          <span className="text-xl font-semibold mb-2">No Books Available</span>
          <span className="text-gray-600">It looks like we don’t have any books yet.</span>
        </div>
      )
    } else {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {currentBooks.map((book) => (
            <button
              key={book.id}
              onClick={() => handleNavigation(`/view-book/${book._id}`)}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img
                  src={`${REACT_BASE_URL}/uploads/${book._id}.jpg`}
                  alt={book.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 truncate">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-3 truncate">{book.author.firstName + " " + book.author.lastName}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-cyan-600">${book.price}</span>
                </div>

                <button
                  onClick={() => console.log("Buy book:", book.title)}
                  className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
                >
                  <LucideShoppingBag className="w-4 h-4" />
                  <span className="text-sm font-medium">Buy Book</span>
                </button>
              </div>
            </button>
          ))}
        </div>
      )
    }
  }


  return (
    <div className="min-h-screen bg-teal-50">

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={Logo} alt="logo" className="w-16 h-16" />
              <span className="text-xl font-bold text-gray-800">Book Store</span>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <Link to="/profile" className="font-medium hidden sm:inline">Profile</Link>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Our Collection</h1>
            <p className="text-gray-600">Discover {allBooks.length} amazing books</p>
          </div>

          {state?.user?.role === "Author" && (
            <button
              onClick={() => handleNavigation('/new-book')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all shadow-lg"
            >
              <span className="text-xl font-bold">+</span>
              <span className="font-semibold">Add New Book</span>
            </button>
          )}
        </div>

        {/* Books Grid */}

        {getBookUi()}


        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2">
          {/* Prev */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </button>

          {/* Page Buttons */}
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                    ? "bg-teal-500 text-white shadow-lg scale-110"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-4 text-gray-600 text-sm">
          Showing {indexOfFirstBook + 1} – {Math.min(indexOfLastBook, allBooks.length)} of {allBooks.length} books
        </div>
      </div>
    </div>
  );
}
