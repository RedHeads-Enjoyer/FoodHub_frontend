import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl} from "../config";
import {Link, useNavigate, useParams} from "react-router-dom";
import classes from './ShowRecipePage.module.css'
import {fetchImage, getJwtAuthHeader} from "../functions";
import BlobInfo from "../components/BlobInfo";
import UserImageName from "../components/UserImageName";
import Loading from "../components/Loading";
import image_placeholder from '../images/image_placeholder.svg'
import StepsWithTimer from "../components/StepsWithTimer";
import rate_star_active from '../images/rate_star_active.png'
import rate_star_inactive from '../images/rate_star_inactive.png'

const ShowRecipePage = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    const [recipe, setRecipe] = useState({})
    const [ingredients, setIngredients] = useState([])
    const [calorieCount, setCalorieCount] = useState()
    const [kitchen, setKitchen] = useState('')
    const [type, setType] = useState('')
    const [image, setImage] = useState("")
    const [duration, setDuration] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(true)
    const [isLoadingEquipment, setIsLoadingEquipment] = useState(true)
    const [equipment, setEquipment] = useState([])
    const [recipeRating, setRecipeRating] = useState(0)
    const [rateButtons, setRateButtons] = useState([false, false, false, false, false])
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

    useEffect(() => {
        setIsLoading(true)
        axios
            .get(dbUrl + '/recipe/' + id, getJwtAuthHeader())
            .then(data => {
                    setRecipe(data.data)
                }
            )
    }, [])

    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])

    useEffect(() => {
        if (Object.keys(recipe).length !== 0) {
            setIsLoading(false)
            fetchImage(setImage, recipe.image);
            getIngredients()
            getEquipment()
            getKitchen()
            getType()
            setRating()
            getRate()
            setDuration(countDuration())
        }
    }, [recipe])

    const getKitchen = () => {
        axios
            .get(dbUrl + '/kitchen/' + recipe.kitchenID)
            .then(data => {
                setKitchen(data.data)
                }
            )
    }

    const setRating = () => {
        if (recipe.ratingVotes === 0) setRecipeRating(0)
        else setRecipeRating(recipe.ratingSum / recipe.ratingVotes)
    }


    const getType = () => {
        axios
            .get(dbUrl + '/type/' + recipe.typeID)
            .then(data => {
                setType(data.data)
                }
            )
    }

    const countDuration = () => {
        let tmpDuration = 0
        for (let i = 0; i < recipe.steps.length; i++) {
            tmpDuration += recipe.steps[i].duration
        }
        const hours = Math.floor(tmpDuration / 3600)
        const minutes = Math.ceil((tmpDuration - hours * 3600) / 60)
        if (hours === 0) return (`${minutes} мин`)
        return  `${hours} ч ${minutes} мин`
    }


    const getIngredients = () => {
        setIsLoadingIngredients(true);
        const requests = recipe.ingredients.map(ingredient =>
            axios.get(dbUrl + '/ingredient/' + ingredient._id)
        );

        Promise.all(requests).then(responses => {
            const tmpIngredients = responses.map(response => response.data);
            setIngredients(tmpIngredients);
            setIsLoadingIngredients(false);
        });
    }

    const getEquipment = () => {
        setIsLoadingEquipment(true)
        const tmpEquipment = []
        for (let i = 0; i < recipe.equipment.length; i++) {
            axios
                .get(dbUrl + '/equipment/' + recipe.equipment[i])
                .then(data => {
                    tmpEquipment.push(data.data)
                })
        }
        setEquipment(tmpEquipment)
        setIsLoadingEquipment(false)
    }

    const getRate = () => {
        axios
            .get(dbUrl + '/user/me', getJwtAuthHeader())
            .then(response => {
                const user = response.data
                const isRecipeInRated = user.rated.some(rateItem => rateItem.id.toString() === recipe._id.toString());

                if (isRecipeInRated) {
                    const oldRate = user.rated.find(rateItem => rateItem.id.toString() === id).rate;
                    setRateButtons(Array(5).fill(false).fill(true, 0, oldRate))
                } else {
                    setRateButtons(Array(5).fill(false))
                }
            })
    }

    const handleRateChange = (e, rate) => {
        const newRateButtons = Array(5).fill(false).fill(true, 0, rate);
        setRateButtons(newRateButtons)
        axios.put(dbUrl + `/recipe/${id}/rate`, {rate: rate}, getJwtAuthHeader()).then(
        ).catch((error) => console.log(error.error))
    }

    useEffect(() => {
        let tmpCalorieCount = 0
        let weight = 0
        for (let i = 0; i < ingredients.length; i++) {
            weight += parseInt(ingredients[i].quantity)
            tmpCalorieCount += parseInt(ingredients[i].quantity) * ingredients[i].calorieContent
        }
        const result = Math.ceil(tmpCalorieCount/weight)
        if (result) setCalorieCount(result)
        else setCalorieCount(0)
    })

    return (
        <div className={classes.recipe__wrapper}>
           {isLoading ? <Loading/> :
               <p className={classes.recipe__name}>
                   {recipe.name}
                   {isLoadingCurrentUser ? " "
                       :
                       currentUser._id === recipe.authorID || currentUser.roles.includes('admin') ?
                           <Link to={"/recipe/edit/" + id}>
                               <button className={classes.admin__button}>
                                   изменить
                               </button>
                           </Link>
                           : ""
                   }
               </p>
           }
            <div className={classes.recipe__info__wrapper}>
                <img className={classes.recipe__avatar} src={isLoading ? image_placeholder : image}/>
                <div className={classes.grid__wrapper}>
                    <div className={classes.recipe__stats__wrapper}>
                        <div className={classes.box1}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Просмотры"} value={recipe.views}/>}
                        </div>
                        <div className={classes.box2}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Длительность"} value={duration}/>}
                        </div>
                        <div className={classes.box3}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Сложность"} value={recipe.difficult}/>}
                        </div>
                        <div className={classes.box4}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Калорийность на 100 г"} value={calorieCount}/>}
                      </div>
                        <div className={classes.box5}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Кухня"} value={kitchen.name}/>}
                        </div>
                        <div className={classes.box6}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Тип блюда"} value={type.name}/>}
                        </div>
                        <div className={classes.box7}>
                            {isLoading ? <Loading/> : <BlobInfo label={"Оценка"} value={recipeRating}/>}
                        </div>
                        <div className={classes.box8}>
                            {isLoading ? <Loading/> : <UserImageName id={recipe.authorID}/>}
                        </div>
                    </div>
                </div>
                <div className={classes.lists__wrapper}>
                    <div className={classes.ingredients__wrapper}>
                        <p className={classes.list__label}>Ингредиенты</p>
                        {isLoadingIngredients ? <Loading/> : (
                            ingredients.map((ingredient, index) => (
                                <div className={classes.list__item} key={recipe.ingredients[index]._id}>
                                    <p>{ingredient.name}</p>
                                    <p>{recipe.ingredients[index].quantity} г</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className={classes.equipment__wrapper}>
                        <p className={classes.list__label}>Оборудование</p>
                        {isLoadingEquipment ? <Loading/> : (
                            equipment.map((eq, index) => (
                                <p key={recipe.equipment[index]}>{eq.name}</p>
                            ))
                        )}
                    </div>
                </div>
                {isLoading ? <Loading/> : <StepsWithTimer steps={recipe.steps}/> }
            </div>
            {isLoading ? <Loading/> : (
                <div className={classes.rate__wrapper}>
                    <p className={classes.rate__label}>Оценка</p>
                    <div className={classes.rate__buttons__wrapper}>
                        {rateButtons.map((btn, index) => (
                            btn === true ?
                                <button
                                    key={`rate_button_${index}`}
                                    onClick={(e) => handleRateChange(e, index + 1)}
                                >
                                    <img src={rate_star_active}/>
                                </button>
                                :
                                <button
                                    key={`rate_button_${index}`}
                                    onClick={(e) => handleRateChange(e, index + 1)}
                                >
                                    <img src={rate_star_inactive}/>
                                </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShowRecipePage