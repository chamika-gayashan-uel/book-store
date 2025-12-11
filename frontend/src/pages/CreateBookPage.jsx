import { useEffect, useRef, useState } from 'react';
import { Upload, X, Save, RotateCw } from 'lucide-react';
import Logo from '../assets/Logo.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, deleteBook, getBookById, updateBook } from '../controllers/bookController';
import { useDispatch, useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { REACT_BASE_URL } from '../config/evnConfig';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/Spinner';
import { contract } from "../utilities/contract";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { setNotification } from '../redux/action';
import { ethers } from "ethers";
import CustomWalletConnectButton from '../components/CustomWalletConnectButton';

const SUBMIT_STATUS = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE'
};

const categories = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business', 'Technology'
];

export default function CreateBookPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const state = useSelector(state => state);
    const { id } = useParams();

    // Refs to persist across renders (fixes bug where values reset)
    const bookPreviousDataRef = useRef(null);
    const newBookIdRef = useRef(null);
    const submitStatusRef = useRef(SUBMIT_STATUS.CREATE);

    const [bookData, setBookData] = useState(getInitialBookState());
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(SUBMIT_STATUS.CREATE);

    // react-query to fetch book when id exists
    const { data: book, error, isLoading, refetch } = useQuery({
        queryKey: ['book_id', id],
        queryFn: () => id ? getBookById(id) : null,
        enabled: !!id
    });

    // thirdweb transaction hook
    // `mutate` is renamed to `sendTransaction` for clarity
    const { mutate: sendTransaction, status: txStatus, data: txData, error: contractError } = useSendTransaction();

    // When book data arrives, populate form and set to update mode
    useEffect(() => {
        if (book && id) {
            const prev = bookDataFromBook(book);
            bookPreviousDataRef.current = prev;
            setBookData(prev);
            setPreviewUrl(`${REACT_BASE_URL}/uploads/${book._id}.jpg`);
            setSubmitStatus(SUBMIT_STATUS.UPDATE);
            submitStatusRef.current = SUBMIT_STATUS.UPDATE;
        }
    }, [book, id]);

    useEffect(() => {
        console.log(contractError)
        if (txStatus === 'success') {
            dispatch(setNotification({ message: submitStatusRef.current == SUBMIT_STATUS.CREATE ? "Book successfully created" : "Book successfully updated", variant: "success" }));
            navigateToBooks();
        }

        if (txStatus === 'error' || contractError) {
            (async () => {
                try {
                    if (submitStatusRef.current === SUBMIT_STATUS.CREATE) {
                        // If we created the DB entry but mint failed, delete the book in DB
                        if (newBookIdRef.current) {
                            await deleteBook({ id: newBookIdRef.current });
                        }
                    } else {
                        // If it was an update flow and transaction failed, restore previous DB state
                        if (bookPreviousDataRef.current) {
                            await updateBook({ ...bookPreviousDataRef.current, coverImage: imageFile }, bookPreviousDataRef.current.id);
                        }
                    }
                } catch (rollbackErr) {
                    // log rollback errors but continue
                    console.error('Rollback error', rollbackErr);
                } finally {
                    dispatch(setNotification({ message: "Transaction Failed", variant: "error" }));
                }
            })();
        }
    }, [txStatus, contractError, dispatch, imageFile, navigate]);

    // Input handler
    const handleInputChange = (field, value) => {
        setBookData(prev => ({ ...prev, [field]: value }));
    };

    // Image upload handler (creates preview URL and stores base64 payload)
    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // revoke previous object URL if any
        if (previewUrl && previewUrl.startsWith('blob:')) {
            try { URL.revokeObjectURL(previewUrl); } catch (err) { /* ignore */ }
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        const reader = new FileReader();
        reader.onloadend = () => {
            // Store base64 payload (without prefix) for API upload
            const result = reader.result;
            if (typeof result === 'string') {
                const base64 = result.split(',')[1] || null;
                setImageFile(base64);
            } else {
                setImageFile(null);
            }
        };
        reader.onerror = () => {
            setImageFile(null);
            dispatch(setNotification({ message: "Failed to read image file", variant: "error" }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            try { URL.revokeObjectURL(previewUrl); } catch (err) { /* ignore */ }
        }
        setImageFile(null);
        setPreviewUrl('');
    };

    const navigateToBooks = () => {
        navigate('/books');
        resetForm();
    };

    const resetForm = () => {
        setBookData(book ? { ...bookDataFromBook(book) } : getInitialBookState());
        setPreviewUrl(book ? `${REACT_BASE_URL}/uploads/${book._id}.jpg` : '');
        setImageFile(null);
    };

    // Submits to backend then optionally mints on-chain
    const handleSubmit = async () => {
        // create or update API call
        try {
            if (submitStatus === SUBMIT_STATUS.CREATE) {
                // create book in DB
                const createdId = await createBook({ ...bookData, coverImage: imageFile });
                if (createdId) {
                    newBookIdRef.current = createdId;
                    await handleMint(createdId);
                } else {
                    throw new Error('Failed to create book (no id returned)');
                }
            } else {
                // update flow
                const updated = await updateBook({ ...bookData, coverImage: imageFile }, bookData.id);
                if (updated) {
                    handleMintUpdate();
                }
            }
        } catch (err) {
            console.error('handleSubmit error', err);
            dispatch(setNotification({ message: 'Save failed: ' + (err.message || 'Unknown error'), variant: 'error' }));
        }
    };

    // Prepare and send the contract call for minting
    const handleMint = async (_id) => {
        // persist the current submit status
        submitStatusRef.current = submitStatus;
        try {
            // Convert price to ETH (guard against missing exchange rate)
            const priceFloat = parseFloat(bookData.price || 0);
            const ethRate = (state.ethereum && parseFloat(state.ethereum)) ? parseFloat(state.ethereum) : 1; // avoid division by zero
            const etherValueString = (priceFloat / ethRate); // decimal string
            const truncatedEtherValueString = formatEtherValue(etherValueString);
            const weiPrice = ethers.parseEther(truncatedEtherValueString) // throws if invalid

            // prepare contract call with thirdweb helper
            const transaction = prepareContractCall({
                contract,
                method: "function mintBook(string _title, uint256 _price, uint256 _royalty, string _bookId)",
                params: [bookData.title, weiPrice, 10, _id],
            });

            // send transaction via hook
            sendTransaction(transaction);
        } catch (err) {
            console.error('handleMint error', err);
            // try to rollback DB creation if mint fails immediately
            if (submitStatusRef.current === SUBMIT_STATUS.CREATE && newBookIdRef.current) {
                try {
                    await deleteBook({ id: newBookIdRef.current });
                } catch (delErr) {
                    console.error('Failed to rollback created book after mint error', delErr);
                }
            }
            dispatch(setNotification({ message: "Transaction Failed: " + (err.message || ''), variant: "error" }));
        }
    };

    const handleMintUpdate = async () => {
        // persist the current submit status
        submitStatusRef.current = submitStatus;
        try {
            // Convert price to ETH (guard against missing exchange rate)
            const priceFloat = parseFloat(bookData.price || 0);
            const ethRate = (state.ethereum && parseFloat(state.ethereum)) ? parseFloat(state.ethereum) : 1; // avoid division by zero
            const etherValueString = (priceFloat / ethRate); // decimal string
            const truncatedEtherValueString = formatEtherValue(etherValueString);
            const weiPrice = ethers.parseEther(truncatedEtherValueString); // throws if invalid

            // prepare contract call with thirdweb helper
            const transaction = prepareContractCall({
                contract,
                method:
                    "function updateBook(string _bookId, string _newTitle, uint256 _newPrice)",
                params: [bookData.id, bookData.title, weiPrice],
            });

            // send transaction via hook
            sendTransaction(transaction);
        } catch (err) {
            console.error('handleMint error', err);
            // try to rollback DB creation if mint fails immediately
            if (submitStatusRef.current === SUBMIT_STATUS.CREATE && newBookIdRef.current) {
                try {
                    await updateBook(bookPreviousDataRef.current);
                } catch (delErr) {
                    console.error('Failed to rollback created book after mint error', delErr);
                }
            }
            dispatch(setNotification({ message: "Transaction Failed: " + (err.message || ''), variant: "error" }));
        }
    }

    return (
        <div className="min-h-screen bg-teal-50">
            {/* Navigation */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <img src={Logo} alt="logo" className='w-16 h-16' />
                            <span className="text-xl font-bold text-gray-800">Book Store</span>
                        </div>
                        <button onClick={() => navigate('/books')} className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors">
                            Back to Books
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {id && isLoading ? (
                    <LoadingState />
                ) : id && error ? (
                    <ErrorState refetch={refetch} />
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <Header title={id ? "Edit Book" : "Add New Book"} description={id ? "Update the details to change the book data" : "Fill in the details to add a new book"} />
                        <div className="grid md:grid-cols-3 gap-8">
                            <BookCoverUploader previewUrl={previewUrl} handleImageUpload={handleImageUpload} handleRemoveImage={handleRemoveImage} disabled={book && id} />
                            <BookDetailsForm bookData={bookData} handleInputChange={handleInputChange} />
                        </div>
                        <ActionButtons handleMint={handleSubmit} handleReset={resetForm} state={state} isEdit={!!id} status={txStatus} />
                        <p className="text-sm text-gray-500 mt-4 text-center">* Required fields</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ===== Helper Components =====

const Header = ({ title, description }) => (
    <div className='flex justify-between'>
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
        </div>
        <div>
            <CustomWalletConnectButton />
        </div>
    </div>
);

const LoadingState = () => (
    <div className="flex flex-col justify-center items-center min-h-[70vh] text-gray-700">
        <Spinner className="mb-8" />
        <span className="text-lg font-medium">Loading books...</span>
    </div>
);

const ErrorState = ({ refetch }) => (
    <div className="flex flex-col justify-center items-center min-h-[70vh] text-red-500">
        <span className="text-xl font-semibold mb-2">Oops! Something went wrong</span>
        <span className="text-gray-600">Unable to fetch books. Please try again later.</span>
        <button onClick={refetch} className="mt-4 text-gray-600 cursor-pointer"><RotateCw /></button>
    </div>
);

const BookCoverUploader = ({ previewUrl, handleImageUpload, handleRemoveImage, disabled }) => (
    <div className="md:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-3">Book Cover</label>
        <div className="space-y-4">
            {previewUrl ? (
                <div className="relative">
                    <img src={previewUrl} alt="Book cover preview" className="w-full h-80 object-cover rounded-lg shadow-lg" />
                    {!disabled ? (<button onClick={handleRemoveImage} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                        <X className="w-4 h-4" />
                    </button>) : (<></>)}
                </div>
            ) : (
                <label className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-colors flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">Upload Cover Image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                </label>
            )}
        </div>
    </div>
);

const BookDetailsForm = ({ bookData, handleInputChange }) => (
    <div className="md:col-span-2 space-y-6">
        <FormInput label="Book Title *" value={bookData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Enter book title" />
        <div className="grid md:grid-cols-2 gap-4">
            <FormSelect label="Category *" value={bookData.category} onChange={e => handleInputChange('category', e.target.value)} options={categories} />
            <FormInput label="Price ($) *" type="number" step="0.01" value={bookData.price} onChange={e => handleInputChange('price', e.target.value)} placeholder="0.00" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <FormInput label="Publisher" value={bookData.publisher} onChange={e => handleInputChange('publisher', e.target.value)} placeholder="Publisher name" />
            <FormInput label="Publication Year" type="number" value={bookData.publicationYear} onChange={e => handleInputChange('publicationYear', e.target.value)} placeholder="2024" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <FormInput label="Number of Pages" type="number" value={bookData.pages} onChange={e => handleInputChange('pages', e.target.value)} placeholder="0" />
            <FormSelect label="Language" value={bookData.language} onChange={e => handleInputChange('language', e.target.value)} options={['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Other']} />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea value={bookData.description} onChange={e => handleInputChange('description', e.target.value)} rows="5" placeholder="Enter book description..." className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none" />
        </div>
    </div>
);

const FormInput = ({ label, type = 'text', ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input type={type} {...props} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
    </div>
);

const FormSelect = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <select {...props} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white appearance-none">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

const ActionButtons = ({ handleMint, handleReset, state, isEdit, status }) => (
    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
        <button disabled={(state.loading?.createBook || status === "pending")} onClick={handleMint} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transform transition-all hover:scale-105">
            <Save className="w-5 h-5" />
            {(state.loading?.createBook || status === "pending") ? <ReactLoading type="spin" height={20} width={20} /> : <span>{isEdit ? "Update Book" : "Create Book"}</span>}
        </button>
        <button onClick={handleReset} className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5" />
            <span>Reset Form</span>
        </button>
    </div>
);

// ===== Helper Functions =====

function getInitialBookState() {
    return {
        id: crypto.randomUUID(),
        title: '',
        isbn: '',
        price: '',
        category: '',
        description: '',
        publisher: '',
        publicationYear: '',
        pages: '',
        language: 'English'
    };
}

function bookDataFromBook(book) {
    return {
        id: book._id,
        title: book.title || '',
        isbn: book.isbn || '',
        price: book.price || '',
        category: book.category || '',
        description: book.description || '',
        publisher: book.publisher || '',
        publicationYear: book.publicationYear || '',
        pages: book.pages || '',
        language: book.language || 'English',
    };
}

const formatEtherValue = (floatValue) => {
    const standardDecimalString = floatValue.toFixed(20);

    // 2. Now truncate the string to the required 18 decimals for parseEther
    if (!standardDecimalString.includes('.')) {
        return standardDecimalString;
    }
    const parts = standardDecimalString.split('.');
    let fractional = parts[1];
    if (fractional.length > 18) {
        fractional = fractional.substring(0, 18);
    }
    return `${parts[0]}.${fractional}`;
};
