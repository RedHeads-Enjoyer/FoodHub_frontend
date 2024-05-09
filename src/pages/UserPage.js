import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {dbUrl} from "../config";
import classes from "./UserPage.module.css";
import image_placeholder from "../images/image_placeholder.svg"
import {fetchImage, getJwtAuthHeader} from "../functions";
import Loading from "../components/Loading";
import RecipeCarp from "../components/RecipeCard";


const UserPage = () => {
    const [user, setUser] = useState({
        username: "",
        image: "",
        recipes: []
    })

    const [currentUser, setCurrentUser] = useState({})
    const [isLoadingCurrentUser, setIsLoadingCurrentUser] = useState(true)

    useEffect(() => {
        axios.get(dbUrl + '/user/me', getJwtAuthHeader())
            .then((response) => {
                setCurrentUser(response.data)
            })
            .catch((error) => {
                console.log(error.error)
            }).finally(()=> setIsLoadingCurrentUser(false));
    }, [])

    const [isLoading, setIsLoading] = useState(true)

    const [avatar, setAvatar] = useState("")
    const [recipes, setRecipes] = useState([])
    const {id} = useParams()

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
            fetchImage(setAvatar, user.image).catch((error) => console.log(error.error))

            setIsLoading(true);
            const requests = user.recipes.map(recipe =>
                axios.get(dbUrl + '/recipe_without_view/' + recipe.id, getJwtAuthHeader())
            );

            Promise.all(requests).then(responses => {
                const tmpRecipes = responses.map(response => response.data);
                setRecipes(tmpRecipes);
                setIsLoading(false);
            });
        }
    }, [user]);


    return (
        <div className={classes.profile__wrapper}>
            <p className={classes.page__label}>Профиль</p>
            <div className={classes.user__info__wrapper}>
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
                <p>{user.username}</p>
                {isLoadingCurrentUser ? " "
                    :
                    currentUser._id === id || currentUser.roles.includes('admin') ?
                        <Link to={"/user/edit/" + id}>
                            <button className={classes.admin__button}>
                                изменить
                            </button>
                        </Link>
                        : ""
                }
            </div>
            <p className={classes.recipes__label}>Рецепты пользователя</p>
            <div className={classes.recipes__wrapper}>
                {recipes.length === 0 ? <p>У этого пользователя нет рецептов</p> :
                    isLoading ? <Loading/> :
                    recipes.map((recipe) => (
                    <div key={recipe._id}>
                        <RecipeCarp recipe={recipe}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserPage

