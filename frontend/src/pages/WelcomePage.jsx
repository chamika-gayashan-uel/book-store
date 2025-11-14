import { LogIn, UserPlus, Library } from 'lucide-react';
import Logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
    const navigate = useNavigate();
    const handleNavigation = (page) => {
        navigate(page);
    };

    return (
        <div className="min-h-screen bg-teal-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            {/* <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div> */}
                            <img src={Logo} alt="logo" className='w-16 h-16' />
                            <span className="text-xl font-bold text-gray-800">Book Store</span>

                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleNavigation('/books')}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-teal-400 transition-colors"
                            >
                                <Library className="w-5 h-5" />
                                <span className="font-medium">View Books</span>
                            </button>
                            <button
                                onClick={() => handleNavigation('/login')}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-teal-400 transition-colors"
                            >
                                <LogIn className="w-5 h-5" />
                                <span className="font-medium">Login</span>
                            </button>
                            <button
                                onClick={() => handleNavigation('/registration')}
                                className="flex items-center space-x-2 px-4 py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition-all transform hover:scale-105"
                            >
                                <UserPlus className="w-5 h-5" />
                                <span className="font-medium">Register</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    {/* Main Heading */}
                    <div className="mb-8">
                        <img src={Logo} alt="BookStore Logo" className="inline-flex items-center justify-center w-40 h-40 mb-6" />
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">
                            Welcome to Book Store
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover your next favorite book from our vast collection of stories, knowledge, and adventures
                        </p>
                    </div>

                    {/* Action Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
                        {/* View Books Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                                <Library className="w-8 h-8 text-teal-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Browse Books</h3>
                            <p className="text-gray-600 mb-6">
                                Explore our extensive collection of books across all genres
                            </p>
                            <button
                                onClick={() => handleNavigation('/books')}
                                className="w-full px-6 py-3 bg-teal-400 text-white rounded-lg font-semibold hover:bg-teal-500 transition-colors"
                            >
                                View Books
                            </button>
                        </div>

                        {/* Login Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                                <LogIn className="w-8 h-8 text-teal-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Sign In</h3>
                            <p className="text-gray-600 mb-6">
                                Access your account to manage your book collection
                            </p>
                            <button
                                onClick={() => handleNavigation('/login')}
                                className="w-full px-6 py-3 bg-teal-400 text-white rounded-lg font-semibold hover:bg-teal-500 transition-colors"
                            >
                                Login
                            </button>
                        </div>

                        {/* Register Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                                <UserPlus className="w-8 h-8 text-teal-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Join Us</h3>
                            <p className="text-gray-600 mb-6">
                                Create a new account and start your reading journey
                            </p>
                            <button
                                onClick={() => handleNavigation('/registration')}
                                className="w-full px-6 py-3  bg-teal-400 text-white rounded-lg font-semibold hover:bg-teal-500 transition-colors"
                            >
                                Register Now
                            </button>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-teal-500 mb-2">10,000+</div>
                            <div className="text-gray-600">Books Available</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-teal-500 mb-2">50+</div>
                            <div className="text-gray-600">Categories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-teal-500 mb-2">5,000+</div>
                            <div className="text-gray-600">Happy Readers</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600 text-sm">
                        <p>© 2024 BookStore. All rights reserved.</p>
                        <div className="mt-2 space-x-4">
                            <button className="hover:text-teal-400">Privacy Policy</button>
                            <span>•</span>
                            <button className="hover:text-teal-400">Terms of Service</button>
                            <span>•</span>
                            <button className="hover:text-teal-400">Contact Us</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}