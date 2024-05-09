import React, { useState, useEffect } from 'react';
import axios from "axios";
import {dbUrl} from "../../config";
import classes from "./styles.module.css";
import {Link} from "react-router-dom";
import Loading from "../Loading";

const UserImageName = ({id}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [user, setUser] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(dbUrl + '/user/brief/' + id)
                    .then((data) => {
                        setUser(data.data)
                    })
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [])

    useEffect(() => {
        if (user !== '') {
            const fetchImage = async () => {
                try {
                    const response = await axios.get(dbUrl + '/image/' + user.image, {
                        responseType: 'blob'
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    setImageUrl(imageUrl);
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            };
            fetchImage();

            return () => {
                URL.revokeObjectURL(imageUrl);
            };
        }
    }, [user]);



    return (
        <Link className={classes.user__wrapper} to={"/user/" + user._id}>
            <img className={classes.user__image} src={imageUrl}/>
            <p className={classes.username}>{user.username}</p>
        </Link>
    );
};

export default UserImageName