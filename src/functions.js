import axios from "axios";
import {dbUrl} from "./config";

export function getJwtAuthHeader() {
    return {
        headers: {
            Authorization: "Bearer " + localStorage.getItem('token')
        }
    };
}

export function getJwtAuthFilesHeader() {
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + localStorage.getItem('token')
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
