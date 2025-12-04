import { SET_USER, SET_TOKEN, SET_LOADING, SET_NOTIFICATION, CLEAR_NOTIFICATIONS, SET_BOOKS } from "./action"
import { storeItem, retrieveItem } from "../config/localStorageConfig"


const initialState = {
    user: retrieveItem("user"),
    token: retrieveItem("token"),
    loading: null,
    notification: null,
    books: []
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            storeItem(action.payload, "user")
            return {
                ...state,
                user: action.payload
            }
        }
        case (SET_TOKEN): {
            storeItem(action.payload, "token")
            return {
                ...state,
                token: action.payload
            }
        }
        case (SET_LOADING): {
            return {
                ...state,
                loading: action.payload
            }
        }
        case (SET_NOTIFICATION): {
            return {
                ...state,
                notification: action.payload
            }
        }
        case (CLEAR_NOTIFICATIONS): {
            return {
                notification: null
            }
        }
        case (SET_BOOKS): {
            return {
                books: action.payload
            }
        }
        default:
            return state
    }
}

export default rootReducer;