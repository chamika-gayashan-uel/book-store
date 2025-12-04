import CryptoJS from "crypto-js";
import { REACT_USER_ENCRYPT_KEY } from "./evnConfig";

export const storeItem = (payload, itemType) => {
    const payloadString = JSON.stringify(payload);
    const encryptedPayload = CryptoJS.AES.encrypt(payloadString, REACT_USER_ENCRYPT_KEY).toString();
    localStorage.setItem(itemType, encryptedPayload);
}

export const retrieveItem = (itemType) => {
    const userEncryptedPayloadString = localStorage.getItem(itemType);


    if (!userEncryptedPayloadString) {
        return null;
    }

    const decryptedBytes = CryptoJS.AES.decrypt(userEncryptedPayloadString, REACT_USER_ENCRYPT_KEY);

    const userString = decryptedBytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(userString);
}
