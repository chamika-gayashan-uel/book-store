import { REACT_BASE_URL } from "../config/evnConfig";
import store from "../redux/store";
import axios from 'axios';
import { setUser, setLoading, setNotification, setToken, setBooks, setEthereumPrice } from "../redux/action"

export const createBook = async (payload) => {

    try {
        store.dispatch(setLoading({ ...store.getState().loading, createBook: true }));

        console.log(payload)

        const createBookResponse = await axios.post(`${REACT_BASE_URL}/book/create`, payload, {
            headers: {
                Authorization: `Bearer ${store.getState().token}`,
            },
        });

        store.dispatch(setLoading({ ...store.getState().loading, createBook: false }));

        return createBookResponse.data.book._id;
    } catch (error) {
        console.log(error)
        store.dispatch(setLoading({ ...store.getState().loading, createBook: false }));
        store.dispatch(setNotification({ message: "Field to create book", variant: "error" }));
        return false;
    }
}

export const deleteBook = async (payload) => {
    try {
        store.dispatch(setLoading({ ...store.getState().loading, createBook: true }));

        console.log(payload)

        const deleteBookResponse = await axios.post(`${REACT_BASE_URL}/book/delete`, payload, {
            headers: {
                Authorization: `Bearer ${store.getState().token}`,
            },
        });

        store.dispatch(setLoading({ ...store.getState().loading, createBook: false }));
    } catch (error) {
        console.log(error)
        store.dispatch(setLoading({ ...store.getState().loading, createBook: false }));
    }
}

export const updateBook = async (payload, id) => {

    try {
        store.dispatch(setLoading({ ...store.getState().loading, createBook: true }));

        console.log(payload)

        const createBookResponse = await axios.put(`${REACT_BASE_URL}/book/update/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${store.getState().token}`,
            },
        });

        store.dispatch(setNotification({ message: "Book successfully updated", variant: "success" }));

        store.dispatch(setLoading({ ...store.getState().loading, createBook: false }));

        return true;
    } catch (error) {
        console.log(error)
        store.dispatch(setLoading({ ...store.getState().loading, createBook: false }));
        store.dispatch(setNotification({ message: "Field to update book", variant: "error" }));
        return false;
    }
}

export const getBooks = async () => {
    const booksResponse = await axios.get(`${REACT_BASE_URL}/book/`, { timeout: 10000 });
    return booksResponse.data.books
}

export const getBookById = async (id) => {
    const bookResponse = await axios.get(`${REACT_BASE_URL}/book/${id}`, {
        timeout: 10000, headers: {
            Authorization: `Bearer ${store.getState().token}`,
        }
    });
    return bookResponse.data.book
}

export const purchaseBook = async (payload) => {
    try {
        store.dispatch(setLoading({ ...store.getState().loading, buyBook: true }));
        const bookResponse = await axios.post(`${REACT_BASE_URL}/book/purchase`, payload, {
            timeout: 10000, headers: {
                Authorization: `Bearer ${store.getState().token}`,
            }
        });
        store.dispatch(setLoading({ ...store.getState().loading, buyBook: false }));
        return bookResponse.data.purchase
    } catch (error) {
        store.dispatch(setNotification({ message: "Field to purchase book", variant: "error" }));
        store.dispatch(setLoading({ ...store.getState().loading, buyBook: false }));
    }

}

export const removePurchases = async (payload) => {
    try {
        store.dispatch(setLoading({ ...store.getState().loading, buyBook: true }));

        const deleteBookResponse = await axios.post(`${REACT_BASE_URL}/book/purchase-delete`, payload, {
            headers: {
                Authorization: `Bearer ${store.getState().token}`,
            },
        });

        store.dispatch(setLoading({ ...store.getState().loading, buyBook: false }));
    } catch (error) {
        console.log(error)
        store.dispatch(setLoading({ ...store.getState().loading, buyBook: false }));
    }
}

export const getEthPriceUsd = async () => {
    const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum&x_cg_demo_api_key=CG-tQsBFbkVVWZVfZg8QAdDy1gR");
    store.dispatch(setEthereumPrice(response.data.ethereum.usd))
}