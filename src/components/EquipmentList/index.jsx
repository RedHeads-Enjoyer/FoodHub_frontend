import React, {useEffect, useState} from 'react';
import classes from "./styles.module.css";
import {dbUrl} from "../../config";
import axios, {all} from "axios";
import {getJwtAuthHeader} from "../../functions";

const EquipmentList = ({addedEquipment, allEquipment, label, setTarget, name, setAllEquipment}) => {
    const [menuStatus, setMenuStatus] = useState(false)
    const [searchRequest, setSearchRequest] = useState("")
    const [filteredEquipment, setFilteredEquipment] = useState([])
    const [blockAddButton, setBlockAddButton] = useState(false)


    const handleMenuButton = (e) => {
        e.preventDefault()
        setMenuStatus(prevState => !prevState)
    }

    const handleAddEquipmentButton = (e, equipment) => {
        e.preventDefault()
        setTarget({ currentTarget: {name, value: [...addedEquipment, equipment]} })
        setAllEquipment(allEquipment.filter((i) => i !== equipment))
    }

    const handleRemoveEquipmentButton = (e, equipment) => {
        e.preventDefault()
        setTarget({ currentTarget: {name, value: addedEquipment.filter((i) => i._id !== equipment._id)}})
        setAllEquipment([...allEquipment, equipment])
    }

    const handleChangeSearchRequest = (e) => {
        setSearchRequest(e.target.value)
    }


    useEffect(() => {
        if (allEquipment.length === 0) return
        setFilteredEquipment(allEquipment)
    }, [allEquipment])

    useEffect(() => {
        setFilteredEquipment(allEquipment.filter(equipment =>  equipment.name.toLowerCase().includes(searchRequest.toLowerCase())))
    }, [searchRequest, allEquipment])

    const handleAddOptionButton = async (e) => {
        e.preventDefault()
        setBlockAddButton(true)
        const url = dbUrl + '/equipment';
        try {
            await axios.post(url, {name: searchRequest}, getJwtAuthHeader())
                .then((data) => {
                    setSearchRequest("")
                    let contains = false
                    for (let i = 0; i < addedEquipment.length; i++) {
                        if (addedEquipment[i]._id === data.data.object._id) {
                            contains = true
                            break
                        }
                    }
                    if (!contains) {
                        setTarget({ currentTarget: {name, value: [...addedEquipment, {...data.data.object}]} })
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
            <div className={classes.equipment__wrapper}>
                <div className={classes.list__wrapper}>
                    {addedEquipment.length === 0 ? <p>Здесь пока пусто :(</p> :
                        addedEquipment.map((equipment) => (
                        <div
                            key={equipment._id}
                            className={classes.item__wrapper}
                        >
                            <p>{equipment.name}</p>
                            <button className={classes.remove__button} onClick={(e) => handleRemoveEquipmentButton(e, equipment)}/>
                        </div>
                    ))}
                </div>
                <button onClick={handleMenuButton} className={menuStatus === false ? classes.open__menu__button : classes.close__menu__button}></button>
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
                                { filteredEquipment.length === 0 ?
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
                                    filteredEquipment.map((equipment) => (
                                    <div key={equipment._id}>
                                        <button className={classes.add__button} onClick={(e) => handleAddEquipmentButton(e, equipment)}>
                                            <p>{equipment.name}</p>
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

export default EquipmentList