import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {dbUrl, translit} from "../config";
import {getJwtAuthHeader} from "../functions";
import classes from "./EditUserPage.module.css";
import image_placeholder from "../images/image_placeholder.svg"
import InputText from "../components/InputText";
import Loading from "../components/Loading";
import Button from "../components/Button";


const UserPage = () => {
    const [user, setUser] = useState({
        _id: 0,
        email: "",
        username: "",
        image: "",
        roles: []
    })

    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState("")
    const [avatar, setAvatar] = useState("")
    const {id} = useParams()

    useEffect(() => {
        axios.get(dbUrl + `/user/me`,getJwtAuthHeader())
            .then(data => {
                setCurrentUser(data.data)
            })
            .catch(error => {
                console.error("Ошибка получения данных:", error.response.data.message);
            });
    }, [])

    useEffect(() => {
        axios
            .get(dbUrl + `/user/${id}`)
            .then(data => {
                setUser(data.data)
            })
            .catch(error => {
                console.error("Ошибка получения данных:", error.response.data.message);
            });
    }, [])

    useEffect(() => {
        if (user.image !== "") {
            const fetchImage = async () => {
                try {
                    const response = await axios.get(dbUrl + '/image/' + user.image, {
                        responseType: 'blob'
                    });
                    const avatar = URL.createObjectURL(response.data);
                    setAvatar(avatar);
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            };
            fetchImage();

            return () => {
                URL.revokeObjectURL(avatar);
            };
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Получаем выбранный файл изображения
        const newFileName = translit(file.name);
        const renamedFile = new File([file], newFileName, { type: file.type });

        if (file) {
            setUser(prevState => ({
                ...prevState,
                image: renamedFile // Обновляем состояние recipe, добавляя выбранный файл в качестве изображения
            }));

            let reader = new FileReader()
            reader.readAsDataURL(renamedFile)
            reader.onload = () => {
                setAvatar(reader.result)
            }
        }
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('image', user.image);
        formData.append('username', user.username);
        const response = await axios.put(dbUrl + '/user/' + user._id, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            navigate("/user/" + id)
        });
    }

    const handleChangeUser = ({currentTarget: input}) => {
        setUser({...user, [input.name]: input.value})
    }


    return (
        <div className={classes.profile__wrapper}>
            <p className={classes.page__label}>Изменение профиля</p>
            <>
                <input
                    className={classes.input__file}
                    id={"user_avatar"}
                    type="file"
                    accept={"image/*"}
                    onChange={handleImageChange}
                />
                <label className={classes.input__label__wrapper} htmlFor={"user_avatar"}>
                    <p>Аватар пользователя</p>
                    <div className={classes.avatar__wrapper}>
                        {avatar === "" || avatar == null ?
                            <img
                                src={image_placeholder}
                            />
                            :
                            <img
                                src={avatar}
                            />
                        }
                    </div>
                </label>
                <div className={classes.input__wrapper}>
                    {user._id === 0 ? <Loading/> :
                        <InputText
                            label={"Имя пользователя"}
                            id = {"username"}
                            type={"text"}
                            placeholder={"Vova123"}
                            name={"username"}
                            onChange={handleChangeUser}
                            value={user.username}
                            required={true}
                        />}
                </div>
                <div className={classes.button__wrapper}>
                    <Button onClick={handleUpdate} name={"Сохранить изменения"}/>
                </div>

            </>
        </div>
    )
}

export default UserPage

