import { useEffect, useState } from 'react';
import { Camera, Edit2, Save, X, Wallet, Mail, User, Phone, MapPin, LogOut } from 'lucide-react';
import Logo from '../assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { logout, updateUser } from '../controllers/authController';
import { useSelector } from 'react-redux';
import ReactLoading from "react-loading"
import CustomWalletConnectButton from "../components/CustomWalletConnectButton"
import { useDisconnect, useActiveWallet, useActiveAccount } from "thirdweb/react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop');
    const state = useSelector((state) => state);
    const activeAccount = useActiveAccount()


    const { disconnect } = useDisconnect()

    const wallet = useActiveWallet()

    const navigate = useNavigate()

    const [userDetails, setUserDetails] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Book Street, Reading City',
        role: 'User'
    });

    useEffect(() => {
        if (state.user) {
            setUserDetails({
                firstName: state.user.firstName,
                lastName: state.user.lastName,
                email: state.user.email,
                phone: state.user.phone ?? '',
                address: state.user.address ?? '',
                role: state.user.role
            })
            setEditedDetails({
                firstName: state.user.firstName,
                lastName: state.user.lastName,
                email: state.user.email,
                phone: state.user.phone ?? '',
                address: state.user.address ?? '',
                role: state.user.role
            })
        }
    }, [state.user])

    const [editedDetails, setEditedDetails] = useState({ ...userDetails });

    const handleNavigation = (page) => {
        navigate(page)
    };

    const handleImageChange = () => {
        alert('Image upload functionality is under the development');
        // In real implementation, you would handle file upload
    };

    const handleLogOut = () => {
        disconnect(wallet);
        logout();
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setEditedDetails({ ...userDetails });
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {

        await updateUser(editedDetails)
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditedDetails({
            ...editedDetails,
            [field]: value
        });
    };

    return (
        <div className="min-h-screen bg-teal-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            {/* <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div> */}
                            <img src={Logo} alt="logo" className='w-16 h-16' />
                            <span className="text-xl font-bold text-gray-800">Book Store</span>
                        </div>
                        <button
                            onClick={() => handleNavigation('/books')}
                            className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                        >
                            Back to Books
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="h-32 bg-gradient-to-r from-teal-500 to-cyan-600">
                        <div className="flex justify-end px-4 py-4">
                            <button
                                onClick={handleLogOut}
                                className="flex items-center space-x-2 bg-red-700 text-white px-5 py-2 rounded-xl shadow-lg hover:bg-red-800 transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Profile Picture Section */}
                    <div className="relative px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4 sm:mb-0">
                                <div className="relative">
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                    />
                                    <button
                                        onClick={handleImageChange}
                                        className="absolute bottom-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-2 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="mt-4 sm:mt-0 sm:ml-6">
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        {userDetails.firstName} {userDetails.lastName}
                                    </h1>
                                    <p className="text-gray-600">{userDetails.role}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEditToggle}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span className="font-medium">Edit Profile</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all
                                             justify-center"
                                        >
                                            <Save className="w-4 h-4" />
                                            {state.loading?.updateProfile
                                                ? <ReactLoading type="spin" height={14} width={14} />
                                                : <span className="font-medium">{state.loading?.updateProfile
                                                    ? <ReactLoading type="spin" height={14} width={14} />
                                                    : <span className="font-medium">Save</span>}</span>}

                                        </button>
                                        <button
                                            onClick={handleEditToggle}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            <span className="font-medium">Cancel</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Wallet Connection Section */}
                    <div className="px-6 pb-6">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-2 border border-cyan-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${activeAccount ? 'bg-cyan-100' : 'bg-gray-100'}`}>
                                        <Wallet size={2} className={`w-6 h-6 ${activeAccount ? 'text-cyan-600' : 'text-gray-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-gray-800">Wallet Connection</h3>
                                        <p className="text-sm text-gray-600">
                                            {activeAccount?.address ? `Wallet Connected: ${String(activeAccount.address)}` : 'Connect your wallet for payments'}
                                        </p>
                                    </div>
                                </div>
                                <CustomWalletConnectButton />
                            </div>
                        </div>
                    </div>

                    {/* User Details Section */}
                    <div className="px-6 pb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={isEditing ? editedDetails.firstName : userDetails.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        disabled={!isEditing}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all outline-none ${isEditing
                                            ? 'border-blue-300 focus:ring-2 focus:ring-teal-500 bg-white'
                                            : 'border-gray-300 bg-gray-50'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={isEditing ? editedDetails.lastName : userDetails.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        disabled={!isEditing}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all outline-none ${isEditing
                                            ? 'border-blue-300 focus:ring-2 focus:ring-teal-500 bg-white'
                                            : 'border-gray-300 bg-gray-50'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={isEditing ? editedDetails.email : userDetails.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={!isEditing}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all outline-none ${isEditing
                                            ? 'border-blue-300 focus:ring-2 focus:ring-teal-500 bg-white'
                                            : 'border-gray-300 bg-gray-50'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={isEditing ? editedDetails.phone : userDetails.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled={!isEditing}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all outline-none ${isEditing
                                            ? 'border-blue-300 focus:ring-2 focus:ring-teal-500 bg-white'
                                            : 'border-gray-300 bg-gray-50'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={isEditing ? editedDetails.address : userDetails.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        disabled={!isEditing}
                                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all outline-none ${isEditing
                                            ? 'border-blue-300 focus:ring-2 focus:ring-teal-500 bg-white'
                                            : 'border-gray-300 bg-gray-50'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Stats */}
                    <div className="px-6 pb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Account Statistics</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-teal-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-teal-400 mb-1">24</div>
                                <div className="text-sm text-gray-600">Books Purchased</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-400 mb-1">12</div>
                                <div className="text-sm text-gray-600">Wishlist Items</div>
                            </div>
                            <div className="bg-cyan-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-cyan-400 mb-1">8</div>
                                <div className="text-sm text-gray-600">Reviews Written</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}