import { useEffect, useState } from 'react';
import { Upload, X, Save, ArrowLeft, RotateCw } from 'lucide-react';
import Logo from '../assets/Logo.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, getBookById, updateBook } from '../controllers/bookController';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading'
import { REACT_BASE_URL } from '../config/evnConfig';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/Spinner';

export default function CreateBookPage() {
    const state = useSelector((state) => state);
    const navigate = useNavigate();
    const [bookData, setBookData] = useState({
        title: '',
        isbn: '',
        price: '',
        category: '',
        description: '',
        publisher: '',
        publicationYear: '',
        pages: '',
        language: 'English'
    });

    const [coverImage, setCoverImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const { id } = useParams();

    const { data: book, error, isLoading, refetch } = useQuery({
        queryKey: ["book_id"],
        queryFn: () => id ? getBookById(id) : null,
    });

    useEffect(() => {
        if (book && id) {
            setBookData({
                title: book.title,
                isbn: book.isbn,
                price: book.price,
                category: book.category,
                description: book.description,
                publisher: book.publisher,
                publicationYear: book.publicationYear,
                pages: book.pages,
                language: book.language
            });

            setPreviewUrl(`${REACT_BASE_URL}/uploads/${book._id}.jpg`)
        }
    }, [book])

    const categories = [
        'Fiction',
        'Non-Fiction',
        'Mystery',
        'Thriller',
        'Romance',
        'Science Fiction',
        'Fantasy',
        'Biography',
        'History',
        'Self-Help',
        'Business',
        'Technology'
    ];

    const handleNavigation = (page) => {
        navigate(page);
        // Reset form
        setBookData({
            title: '',
            isbn: '',
            price: '',
            category: '',
            description: '',
            publisher: '',
            publicationYear: '',
            pages: '',
            language: 'English'
        });
        setPreviewUrl(null);
        setCoverImage(null);
        setImageFile(null);
    };


    const handleInputChange = (field, value) => {
        setBookData({
            ...bookData,
            [field]: value
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                setImageFile(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setCoverImage(null);
        setImageFile(null);
        setPreviewUrl('');
    };

    const handleSubmit = async () => {
        const payload = {
            title: bookData.title,
            isbn: bookData.isbn,
            price: bookData.price,
            category: bookData.category,
            description: bookData.description,
            publisher: bookData.publisher,
            publicationYear: bookData.publicationYear,
            pages: bookData.pages,
            language: bookData.language,
            coverImage: imageFile
        };

        if (id) {
            updateBook(payload, id).then((created) => {
                if (created) {
                    handleNavigation('/books')
                }
            })
        } else {
            createBook(payload).then((created) => {
                if (created) {
                    handleNavigation('/books')
                }
            })
        }

    };

    const handleReset = () => {
        setBookData({
            title: book.title ?? '',
            isbn: book.isbn ?? '',
            price: book.price ?? '',
            category: book.category ?? '',
            description: book.description ?? '',
            publisher: book.publisher ?? '',
            publicationYear: book.publicationYear ?? '',
            pages: book.pages ?? '',
            language: book.language ?? 'English'
        });
        setPreviewUrl(book ? `${REACT_BASE_URL}/uploads/${book._id}.jpg` : null);
        setCoverImage(null);
        setImageFile(null);
    };

    return (
        <div className="min-h-screen bg-teal-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <img src={Logo} alt="logo" className='w-16 h-16' />
                            <span className="text-xl font-bold text-gray-800">Book Store</span>
                        </div>
                        <button
                            onClick={() => handleNavigation('/books')}
                            className="space-x-3 px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors "
                        >
                            Back to Books
                        </button>
                    </div>
                </div >
            </nav >

            {/* Main Content */}
            < div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" >
                {(id && isLoading)
                    ? (<div className="flex flex-col justify-center items-center min-h-[70vh] text-gray-700">
                        <Spinner className="mb-8" />
                        <span className="text-lg font-medium">Loading books...</span>
                    </div>)
                    : (id && error)
                        ? (<div className="flex flex-col justify-center items-center min-h-[70vh] text-red-500">
                            <span className="text-xl font-semibold mb-2">Oops! Something went wrong</span>
                            <span className="text-gray-600">Unable to fetch books. Please try again later.</span>
                            <button onClick={refetch} className="mt-4 text-gray-600 cursor-pointer"><RotateCw /></button>
                        </div>)
                        : (<div className="bg-white rounded-2xl shadow-xl p-8">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{id ? "Edit Book " : "Add New Book"}</h1>
                                <p className="text-gray-600">{id ? "Update in the details to change the book data" : "Fill in the details to add a new book to the collection"}</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Left Column - Cover Image */}
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Book Cover
                                    </label>
                                    <div className="space-y-4">
                                        {previewUrl ? (
                                            <div className="relative">
                                                <img
                                                    src={previewUrl}
                                                    alt="Book cover preview"
                                                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                                                />

                                                {/* Remove Image Button */}
                                                <button
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full 
                                                    hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg 
                                                hover:border-teal-500 transition-colors flex flex-col items-center 
                                                justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />

                                                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-600 font-medium">Upload Cover Image</span>
                                                <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                                            </label>
                                        )}
                                    </div>

                                </div>

                                {/* Right Column - Book Details */}
                                <div className="md:col-span-2 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Book Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={bookData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="Enter book title"
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>

                                    {/* ISBN */}
                                    <div className="grid md:grid-cols-1">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ISBN
                                            </label>
                                            <input
                                                required
                                                disabled={id}
                                                type="text"
                                                value={bookData.isbn}
                                                onChange={(e) => handleInputChange('isbn', e.target.value)}
                                                placeholder="ISBN number"
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Category and Price */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    disabled={id}
                                                    value={bookData.category}
                                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white appearance-none"
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Price ($) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={bookData.price}
                                                onChange={(e) => handleInputChange('price', e.target.value)}
                                                placeholder="0.00"
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Publisher and Year */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Publisher
                                            </label>
                                            <input
                                                type="text"
                                                value={bookData.publisher}
                                                onChange={(e) => handleInputChange('publisher', e.target.value)}
                                                placeholder="Publisher name"
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Publication Year
                                            </label>
                                            <input
                                                type="number"
                                                value={bookData.publicationYear}
                                                onChange={(e) => handleInputChange('publicationYear', e.target.value)}
                                                placeholder="2024"
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Pages and Language */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Number of Pages
                                            </label>
                                            <input
                                                type="number"
                                                value={bookData.pages}
                                                onChange={(e) => handleInputChange('pages', e.target.value)}
                                                placeholder="0"
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Language
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={bookData.language}
                                                    onChange={(e) => handleInputChange('language', e.target.value)}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white appearance-none"
                                                >
                                                    <option value="English">English</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="French">French</option>
                                                    <option value="German">German</option>
                                                    <option value="Chinese">Chinese</option>
                                                    <option value="Japanese">Japanese</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={bookData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Enter book description..."
                                            rows="5"
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3  bg-teal-500 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transform transition-all hover:scale-105"
                                >
                                    <Save className="w-5 h-5" />
                                    {state.loading?.createBook
                                        ? <ReactLoading type="spin" height={20} width={20} />
                                        : <span>{id ? "Update Book" : "Create Book"}</span>
                                    }

                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                    <span>Reset Form</span>
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 mt-4 text-center">
                                * Required fields
                            </p>
                        </div>)}
            </div >
        </div >
    );
}