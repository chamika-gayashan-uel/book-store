import { useEffect, useRef, useState } from 'react';
import { BookOpen, Heart, ShoppingCart, Star, RotateCw, User, Calendar, Globe, FileText, BookMarked, SquarePen } from 'lucide-react';
import Logo from '../assets/Logo.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBookById, purchaseBook, removePurchases } from '../controllers/bookController';
import Spinner from '../components/Spinner';
import { REACT_BASE_URL } from '../config/evnConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useSendTransaction } from 'thirdweb/react';
import { setNotification } from '../redux/action';
import { contract } from '../utilities/contract';
import CustomWalletConnectButton from '../components/CustomWalletConnectButton';
import { prepareContractCall } from "thirdweb";
import ReactLoading from 'react-loading';

export default function BookDetailsPage() {
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const dispatch = useDispatch();
    const purchaseRef = useRef(null);


    const { id } = useParams();
    const navigation = useNavigate();
    const state = useSelector((state) => state)

    const { data: book, error, isLoading, refetch } = useQuery({
        queryKey: ["book_id"],
        queryFn: () => getBookById(id),
    });

    const { mutate: sendTransaction, status: txStatus, data: txData, error: contractError } = useSendTransaction();

    useEffect(() => {
        console.log(txStatus)
        console.log(txData)
        console.log(contractError)
        if (txStatus == 'success') {
            dispatch(setNotification({ message: "Transaction successful", variant: "error" }))
        } else if (txStatus == 'error') {
            removePurchases({ id: purchaseRef.current._id })
            dispatch(setNotification({ message: contractError.message, variant: "error" }))
        }
    }, [txStatus, txData, contractError])

    const handleNavigation = (page) => {
        navigation(page)
    };

    const handleBuy = async () => {
        purchaseBook({ bookId: book._id }).then((purchase) => {
            handleBuyTransaction(purchase);
        })
    };

    const handleBuyTransaction = (purchase) => {
        try {
            purchaseRef.current = purchase;
            const transaction = prepareContractCall({
                contract,
                method: "function purchaseBook(string _bookId) payable",
                params: [purchaseRef.current.book],
            });
            sendTransaction(transaction);
        } catch (error) {
            removePurchases({ id: purchaseRef.current._id })
        }
    };

    // const handleAddToCart = () => {
    //     alert(`Added ${quantity} copy(ies) of "${book.title}" to cart`);
    // };

    const handleToggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    // const incrementQuantity = () => {
    //     if (quantity < book.stockCount) {
    //         setQuantity(quantity + 1);
    //     }
    // };

    // const decrementQuantity = () => {
    //     if (quantity > 1) {
    //         setQuantity(quantity - 1);
    //     }
    // };

    const getBookUi = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col justify-center items-center min-h-[86vh] text-gray-700">
                    <Spinner className="mb-8" />
                    <span className="text-lg font-medium">Loading books...</span>
                </div>
            )
        } else if (error) {
            console.log(error)
            return (
                <div className="flex flex-col justify-center items-center min-h-[86vh] text-red-500">
                    <span className="text-xl font-semibold mb-2">Oops! Something went wrong</span>
                    <span className="text-gray-600">Unable to fetch books. Please try again later.</span>
                    <button onClick={refetch} className="mt-4 text-gray-600 cursor-pointer"><RotateCw /></button>
                </div>
            )
        } else {
            return (<div className="grid md:grid-cols-5 gap-8 p-8">
                {/* Left Column - Book Cover */}
                <div className="md:col-span-2">
                    <div className="sticky top-8">
                        <img
                            src={`${REACT_BASE_URL}/uploads/${book._id}.jpg`}
                            alt={book.title}
                            className="w-full rounded-xl shadow-2xl"
                        />

                        {/* Stock Status */}
                        <div className="mt-4 text-center">
                            {book.inStock ? (
                                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span className="font-semibold">{book.stockCount} copies in stock</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    <span className="font-semibold">Out of stock</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Book Details */}
                <div className="md:col-span-3 space-y-6">
                    {/* Title and Author */}
                    <div>
                        <div className="flex items-start justify-between mb-2">
                            <h1 className="text-4xl font-bold text-gray-800">{book.title}</h1>
                            <div>
                                {book.author._id == state.user._id
                                    ? <button
                                        onClick={() => navigation(`/edit-book/${book._id}`)}
                                        className={`p-3 mr-5 rounded-full transition-all text-red-600`}
                                    >
                                        <SquarePen className={`w-6 h-6 `} />
                                    </button>
                                    : <></>}
                                <button
                                    onClick={handleToggleWishlist}
                                    className={`p-3 rounded-full transition-all ${isWishlisted
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xl text-gray-600 mb-4">by {`${book.author.firstName} ${book.author.lastName}`}</p>

                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(book.rating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-700 font-semibold">{book.rating}</span>
                            <span className="text-gray-500">({book.reviews} reviews)</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="py-4 border-y border-gray-200">
                        <div className="flex items-center space-x-4">
                            <span className="text-5xl font-bold text-blue-600">${book.price}</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                Free Shipping
                            </span>
                        </div>
                    </div>

                    {/* Book Information */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className="flex items-start space-x-3">
                            <FileText className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">ISBN</p>
                                <p className="font-semibold text-gray-800">{book.isbn}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookMarked className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Pages</p>
                                <p className="font-semibold text-gray-800">{book.pages}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <User className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Publisher</p>
                                <p className="font-semibold text-gray-800">{book.publisher}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Published</p>
                                <p className="font-semibold text-gray-800">{book.publicationYear}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Globe className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Language</p>
                                <p className="font-semibold text-gray-800">{book.language}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <p className="font-semibold text-gray-800">{book.category}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={decrementQuantity}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    -
                                </button>
                                <span className="px-6 py-2 font-semibold text-gray-800 border-x border-gray-300">
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQuantity}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-gray-600">
                                Total: <span className="font-bold text-blue-600">${(book.price * quantity).toFixed(2)}</span>
                            </span>
                        </div>
                    </div> */}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        {book.author._id == state.user._id ? <></> : < button
                            onClick={handleBuy}
                            disabled={!book.inStock}
                            className={`flex-1 flex items-center justify-center space-x-2 px-8 py-4 rounded-lg font-semibold transition-all transform ${book.inStock
                                ? 'bg-teal-400 shadow-lg text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {(state.loading?.buyBook || txStatus == 'pending') ? <ReactLoading type="spin" height={20} width={20} /> : <span>Buy Now</span>}
                        </button>}
                        {/* <button
                            onClick={handleAddToCart}
                            disabled={!book.inStock}
                            className={`flex-1 px-8 py-4 rounded-lg font-semibold transition-colors ${book.inStock
                                ? 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                                : 'border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Add to Cart
                        </button> */}
                        <CustomWalletConnectButton />
                    </div>

                    {/* Description */}
                    <div className="pt-6 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">About this book</h2>
                        <p className="text-gray-700 leading-relaxed">{book.description}</p>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Why buy from us?</h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl mb-2">📦</div>
                                <p className="font-semibold text-gray-800">Fast Delivery</p>
                                <p className="text-sm text-gray-600">2-3 business days</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-3xl mb-2">🔒</div>
                                <p className="font-semibold text-gray-800">Secure Payment</p>
                                <p className="text-sm text-gray-600">100% protected</p>
                            </div>
                            <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                <div className="text-3xl mb-2">↩️</div>
                                <p className="font-semibold text-gray-800">Easy Returns</p>
                                <p className="text-sm text-gray-600">30-day policy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div >);
        }
    }

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {getBookUi()}
                </div>
            </div>
        </div >
    );
}