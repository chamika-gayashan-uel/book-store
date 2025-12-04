import { REACT_BASE_URL } from "../config/evnConfig";
import store from "../redux/store";
import axios from 'axios';
import { setUser, setLoading, setNotification, setToken } from "../redux/action"

export const login = async (payload) => {

    try {
        store.dispatch(setLoading({ ...store.getState().loading, login: true }));

        const loginResponse = await axios.post(`${REACT_BASE_URL}/auth/login`, payload);

        store.dispatch(setToken(loginResponse.data.token))

        const userResponse = await axios.get(`${REACT_BASE_URL}/auth/get-user`, {
            headers: {
                Authorization: `Bearer ${store.getState().token}`,
            },
        }, payload);

        store.dispatch(setUser(userResponse.data.user));

        store.dispatch(setLoading({ ...store.getState().loading, login: false }));

    } catch (error) {
        console.log(error)
        store.dispatch(setLoading({ ...store.getState().loading, login: false }));
        store.dispatch(setNotification({ message: "Invalid user logins credentials", variant: "error" }));
    }
}

export const logout = () => {
    store.dispatch(setUser(null));
}

export const registration = async (payload) => {
    try {
        store.dispatch(setLoading({ ...store.getState().loading, register: true }));

        const registerResponse = await axios.post(`${REACT_BASE_URL}/auth/register`, payload);

        store.dispatch(setNotification({ message: "Successfully Registered", variant: "success" }));

        store.dispatch(setLoading({ ...store.getState().loading, register: false }));
    } catch (error) {
        store.dispatch(setLoading({ ...store.getState().loading, register: false }));
        store.dispatch(setNotification({ message: "Registration failed", variant: "error" }));

    }
}

export const updateUser = async (payload) => {
    try {
        store.dispatch(setLoading({ ...store.getState().loading, updateProfile: true }));

        const updateResponse = await axios.post(`${REACT_BASE_URL}/auth/update-user`, payload, {
            headers: {
                Authorization: `Bearer ${store.getState().token}`,
            }
        });

        store.dispatch(setNotification({ message: "Successfully updated", variant: "success" }));

        store.dispatch(setUser(updateResponse.data.user));

        store.dispatch(setLoading({ ...store.getState().loading, updateProfile: false }));

    } catch (error) {
        console.log(error)
        store.dispatch(setLoading({ ...store.getState().loading, updateProfile: false }));
        store.dispatch(setNotification({ message: "Failed to update", variant: "error" }));
    }
}