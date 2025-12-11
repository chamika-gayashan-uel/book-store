export const SET_USER = 'SET_USER';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_LOADING = 'SET_LOADING';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const SET_ETHEREUM = 'SET_ETHEREUM';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const SET_BOOKS = 'SET_BOOKS';

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
})

export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: token
})

export const setLoading = (payload) => ({
    type: SET_LOADING,
    payload: payload
})

export const setNotification = (payload) => ({
    type: SET_NOTIFICATION,
    payload: payload
})

export const setEthereumPrice = (payload) => ({
    type: SET_ETHEREUM,
    payload: payload
})

export const setBooks = (payload) => ({
    type: SET_BOOKS,
    payload: payload
})

export const clearNotification = (payload) => ({
    type: CLEAR_NOTIFICATIONS,
    payload: payload
})