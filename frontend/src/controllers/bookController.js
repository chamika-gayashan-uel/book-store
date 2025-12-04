import { REACT_BASE_URL } from "../config/evnConfig";
import store from "../redux/store";
import axios from 'axios';
import { setUser, setLoading, setNotification, setToken, setBooks } from "../redux/action"

export const createBook = async (payload) => {

    try {
        store.dispatch(setLoading({ ...store.getState().loading, createBook: true }));

        console.log(payload)

        const createBookResponse = await axios.post(`${REACT_BASE_URL}/book/create`, payload, {
            headers: {
                Authorization: `Bearer ${store.getState().token}`,
            },
        });

        store.dispatch(setNotification({ message: "Book successfully created", variant: "success" }));

        store.dispatch(setLoading({ ...store.getState().loading, createBook: false }));

        return true;
    } catch (error) {
        console.log(error)
        store.dispatch(setLoading({ ...store.getState().loading, createBook: false }));
        store.dispatch(setNotification({ message: "Field to create book", variant: "error" }));
        return false;
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