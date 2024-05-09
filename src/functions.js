import axios from "axios";
import {dbUrl} from "./config";

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getJwtAuthHeader() {
    return {
        headers: {
            Authorization: "Bearer " + getCookie('token')
        }
    };
}

export function getJwtAuthFilesHeader() {
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + getCookie('token')
        }
    };
}

export const fetchImage = async (setImage, url) => {
    try {
        const response = await axios.get(dbUrl + '/image/' + url, {
            responseType: 'blob'
        });
        const avatar = URL.createObjectURL(response.data);
        setImage(avatar);
    } catch (error) {
        console.error('Error fetching image:', error);
    }
};
