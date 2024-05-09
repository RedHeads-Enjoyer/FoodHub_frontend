import React, {useEffect, useState} from 'react';
import classes from "./styles.module.css";
import {dbUrl} from "../../config";
import axios from "axios";
import {getJwtAuthHeader} from "../../functions";

const IngredientsList = ({addedIngredients, allIngredients, label, setTarget, name, setAllIngredients}) => {
    const [calorieCounter, setCalorieCounter] = useState(0)
    const [menuStatus, setMenuStatus] = useState(false)
    const [searchRequest, setSearchRequest] = useState("")
    const [filteredIngredients, setFilteredIngredients] = useState([])
    const [blockAddButton, setBlockAddButton] = useState(false)


    const handleMenuButton = (e) => {
        e.preventDefault()
        setMenuStatus(prevState => !prevState)
    }

    const handleAddIngredientButton = (e, ingredient) => {
        e.preventDefault()
        setTarget({ currentTarget: {name, value: [...addedIngredients, {...ingredient, quantity: 100}]} })
        setAllIngredients(allIngredients.filter((i) => i !== ingredient))
    }

    const handleRemoveIngredientButton = (e, ingredient) => {
        e.preventDefault()
        setTarget({ currentTarget: {name, value: addedIngredients.filter((i) => i._id !== ingredient._id)}})
        setAllIngredients([...allIngredients, ingredient])
    }

    const handleChangeSearchRequest = (e) => {
        setSearchRequest(e.target.value)
    }

    const handleQuantityChange = (e, ingredient) => {
        let newValue = e.target.value
        if (newValue === "") return;
        else if (newValue <= 1) e.target.value = 1
        else if (newValue >= 100000) e.target.value = 99999
        newValue = e.target.value
        const index = addedIngredients.findIndex((i) => i._id === ingredient._id);
        if (index === -1) return
        const updatedIngredient = { ...addedIngredients[index], quantity: parseInt(newValue) };
        const updatedList = [
            ...addedIngredients.slice(0, index),
            updatedIngredient,
            ...addedIngredients.slice(index + 1)
        ];
        setTarget({ currentTarget: {name, value: updatedList}})
    }

    useEffect(() => {
        let calories = 0
        let weight = 0
        for (let i = 0; i < addedIngredients.length; i++) {
            weight += parseInt(addedIngredients[i].quantity)
            calories += parseInt(addedIngredients[i].quantity) * addedIngredients[i].calorieContent
        }
        const result = Math.ceil(calories/weight)
        if (result) setCalorieCounter(result)
        else setCalorieCounter(0)
    }, [addedIngredients])

    useEffect(() => {
        if (allIngredients.length === 0) return
        setFilteredIngredients(allIngredients)
    }, [allIngredients])

    useEffect(() => {
        setFilteredIngredients(allIngredients.filter(ingredient =>  ingredient.name.toLowerCase().includes(searchRequest.toLowerCase())))
    }, [searchRequest, allIngredients])

    const handleAddOptionButton = async (e) => {
        e.preventDefault()
        setBlockAddButton(true)
        const url = dbUrl + '/ingredient';
        try {
            await axios.post(url, {name: searchRequest, calorieContent: 0, isAdult: false}, getJwtAuthHeader())
                .then((data) => {
                    setSearchRequest("")
                    let contains = false
                    for (let i = 0; i < addedIngredients.length; i++) {
                        if (addedIngredients[i]._id === data.data.object._id) {
                            contains = true
                            break
                        }
                    }
                    if (!contains) {
                        setTarget({ currentTarget: {name, value: [...addedIngredients, {...data.data.object, quantity: 100}]} })
                    }
                    setBlockAddButton(false)
                })
        } catch (error) {
            setBlockAddButton(false)
            if (error.response) {
                console.log(error.response.data.message);
            } else if (error.request) {
                console.log('Ошибка запроса:', error.request);
            } else {
                console.log('Ошибка:', error.message);
            }
        }
    }


    return (
        <>
            <p>{label}</p>
            <div className={classes.ingredients__wrapper}>
                <div className={classes.list__wrapper}>
                    {addedIngredients.length === 0 ? <p>Здесь пока пусто :(</p> :
                        addedIngredients.map((ingredient) => (
                        <div
                            key={ingredient._id}
                            className={classes.item__wrapper}
                        >
                            <p>{ingredient.name}</p>
                            <div className={classes.div__flex}>
                                <input
                                    value={ingredient.quantity}
                                    className={classes.number__input}
                                    placeholder={"Сколько"}
                                    type={"number"}
                                    min={1}
                                    max={99999}
                                    onChange={(e) => handleQuantityChange(e, ingredient)}
                                />
                                <p>г</p>
                                <button className={classes.remove__button} onClick={(e) => handleRemoveIngredientButton(e, ingredient)}/>
                            </div>

                        </div>
                    ))}
                </div>
                <div className={classes.bottom__wrapper}>
                    <button onClick={handleMenuButton} className={menuStatus === false ? classes.open__menu__button : classes.close__menu__button}></button>
                    <div className={classes.calorie__wrapper}>
                        <p className={classes.calorie__text}>Калорийность</p>
                        <p>{calorieCounter} ккал/100г</p>
                    </div>
                </div>
                <div className={classes.menu__wrapper}>
                    {menuStatus === true &&
                        <>
                            <input
                                className={classes.search__bar}
                                type={"text"}
                                placeholder={"Найти..."}
                                value={searchRequest}
                                onChange={handleChangeSearchRequest}
                            />
                            <div className={classes.options__wrapper}>
                                { filteredIngredients.length === 0 ?
                                    <div className={classes.add_option__wrapper}>
                                        <p>Ничего не найдено :(</p>
                                        <button
                                            className={classes.add__option__button}
                                            onClick={handleAddOptionButton}
                                            disabled={blockAddButton}
                                        >
                                            <p>Добавить свой вариант</p>
                                        </button>
                                        <p>*Модератор должен подтвердить добавлегние, до этого момента элемент будет считаться неопределенным</p>
                                    </div>
                                    :
                                    filteredIngredients.map((ingredient) => (
                                    <div key={ingredient._id}>
                                        <button className={classes.add__button} onClick={(e) => handleAddIngredientButton(e, ingredient)}>
                                            <p>{ingredient.name}</p>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    );
};

export default IngredientsList