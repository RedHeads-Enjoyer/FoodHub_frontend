import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link, useNavigate} from "react-router-dom";
import classes from "./RegisterPage.module.css";
import InputText from "../components/InputText";
import Button from "../components/Button";

const LoginPage = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        repeatedPassword: ""
    })
    const [errors, setErrors] = useState([])

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value})
    }

    const checkData = () => {
        let errors = []
        const password = data.password
        if (data.username.length < 3 || data.username.length > 16) {
            errors.push("Имя пользователя должно содержать от 3 до 16 символов")
        }
        if (password !== data.repeatedPassword) {
            errors.push("Пароли не совпадают")
        } else {
            if (password.length < 8) {
                errors.push("Пароль должен содержать от 8 до 16 символов")
            }
            const symbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/
            if (!symbols.test(password)) {
                errors.push(`Пароль должен содержать минимум один из специальных символов !"#$%&'()*+,-./:;<=>?@[]^_{|}~`)
            }
            const numbers = /[0-9]/
            if (!numbers.test(password)) {
                errors.push(`Пароль должен содержать минимум одну цифру`)
            }
            const capitals = /[A-Z]/
            if (!capitals.test(password)) {
                errors.push(`Пароль должен содержать минимум одну заглавную букву`)
            }
        }
        setErrors(errors)
        return errors.length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!checkData()) return
        try {
            const url = dbUrl + '/auth/registration'
            const response = await axios.post(url, data)
            if (response.status === 400) {
                setErrors(["Пользователь с таким адресом электронной почты уже существует"])
                return
            }
            navigate("/login")
        } catch (error) {
            if (error.response) {
                setErrors([error.response.data.message])
                if (error.response.data.hasOwnProperty("errors")) {
                    error.response.data.errors.errors.map((err) => {
                        setErrors(errors => [...errors, err.msg])
                    })
                }
            } else if (error.request.request.request) {
                console.log('Ошибка запроса:', error.request)
            } else {
                console.log('Ошибка:', error.message)
            }
        }
    }

    return (
        <div className={classes.registration__wrapper}>
            <form onSubmit={handleSubmit}>
            <div className={classes.form__wrapper}>
                <div className={classes.label__wrapper}>
                    <p className={classes.label__text}>Регистрация</p>
                </div>
                    <div className={classes.input__text__wrapper}>
                        <InputText
                            label={"Имя пользователя"}
                            type={"username"}
                            placeholder={"vova123"}
                            name={"username"}
                            onChange={handleChange}
                            value={data.username}
                        />
                    </div>
                    <div className={classes.input__text__wrapper}>
                        <InputText
                            label={"Email"}
                            type={"email"}
                            placeholder={"example@mail.ru"}
                            name={"email"}
                            onChange={handleChange}
                            value={data.email}
                        />
                    </div>
                    <div className={classes.input__text__wrapper}>
                        <InputText
                            label={"Пароль"}
                            type={"password"}
                            placeholder={"changeMe!12_"}
                            name={"password"}
                            onChange={handleChange}
                            value={data.password}
                        />
                    </div>
                    <div className={classes.input__text__wrapper}>
                        <InputText
                            label={"Повторение пароля"}
                            type={"password"}
                            placeholder={"changeMe!12_"}
                            name={"repeatedPassword"}
                            onChange={handleChange}
                            value={data.repeatedPassword}
                        />
                    </div>
                    <div className={classes.button__wrapper}>
                        <Button name={"Зарегистрироваться"} onClick={handleSubmit}/>
                    </div>
                <div className={classes.link__wrapper}>
                    <Link to={'/login'}><p className={classes.link__text}>У  меня уже есть аккаунт</p></Link>
                </div>
                <div>
                    <ul>
                        {errors.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                </div>
                </div>
            </form>
        </div>
    )
}

export default LoginPage