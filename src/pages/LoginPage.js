import {useEffect, useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link, useNavigate} from "react-router-dom";
import classes from "./loginPage.module.css";
import Button from "../components/Button";
import {getJwtAuthHeader} from "../functions";
import InputText from "../components/InputText";
import {useDispatch, useSelector} from "react-redux";
import {changeStatus} from "../slices/userSlice";


const LoginPage = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState([])

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value})
    }

    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(dbUrl + '/auth/login', data);
            if (response.status === 400) {
                setErrors(["Неверно введен адрес элктронной почты или пароль"])
            }
            const userResponse = await axios.get(dbUrl + '/user/me', getJwtAuthHeader());
            dispatch(changeStatus(true))
            navigate('/user/' + userResponse.data._id);
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message)
                setErrors([error.response.data.message])
            } else if (error.request.request.request) {
                console.log('Ошибка запроса:', error.request)
            } else {
                console.log('Ошибка:', error.message)
            }
        }
    }

    return (
        <div className={classes.login__wrapper}>

            <form onSubmit={handleSubmit}>
                <div className={classes.form__wrapper}>
                <div className={classes.label__wrapper}>
                    <p className={classes.label__text}>Вход</p>
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
                    <div className={classes.button__wrapper}>
                        <Button name={"Войти"} onClick={handleSubmit}/>
                    </div>
                <div className={classes.link__wrapper}>
                    <Link to={'/registration'}><p className={classes.link__text}>У меня нет аккаунта</p></Link>
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