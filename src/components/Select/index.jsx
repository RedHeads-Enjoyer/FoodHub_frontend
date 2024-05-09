import classes from "./styles.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {dbUrl} from "../../config";
import {getJwtAuthHeader} from "../../functions";

const Select = ({name, onChange, options, label, link}) => {
    const [selected, setSelected] = useState({})
    const [isOptionsVisible, setIsOptionsVisible] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState([])
    const [searchRequest, setSearchRequest] = useState("")
    const [blockAddButton, setBlockAddButton] = useState(false)

    useEffect(() => {
        if (options.length !== 0) {
            setSelected(options[0])
            setFilteredOptions(options)
        }
    }, [options])

    useEffect(() => {
        setFilteredOptions(options.filter(option =>  option.name.toLowerCase().includes(searchRequest.toLowerCase())))
    }, [searchRequest])

    const handleSelectorButton = () => {
        setIsOptionsVisible((prevState) => !prevState)
    }

    const handleSearchRequest = (e) => {
        setSearchRequest(e.target.value)
    }

    const handleOptionClick = (e, option) => {
        e.preventDefault()
        setSelected(option)
        onChange(option._id)
        setIsOptionsVisible(false)
    }

    const handleAddOptionButton = async (e) => {
        e.preventDefault()
        setBlockAddButton(true)
        const url = dbUrl + link;
        try {
            await axios.post(url, {name: searchRequest}, getJwtAuthHeader())
                .then((data) => {
                    setSearchRequest("")
                    setSelected(data.data.object)
                    onChange(data.data.object._id)
                    setBlockAddButton(false)
                    setIsOptionsVisible(false)
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
    <div className={classes.select__wrapper}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.selector__button} onClick={handleSelectorButton}>
          <p className={classes.selected__option}>{Object.keys(selected).length !== 0 ? selected.name : ""}</p>
          <div className={classes.button__arrow}>
              <span className={isOptionsVisible === false ? classes.arrow__left__down : classes.arrow__left__up}></span>
              <span className={isOptionsVisible === false ? classes.arrow__right__down : classes.arrow__right__up}></span>
          </div>
      </div>
        { isOptionsVisible &&
            <>
                <input
                    className={classes.search__bar}
                    type={"text"}
                    value={searchRequest}
                    onChange={handleSearchRequest}
                    placeholder={"Найти.."}
                />
                <div className={classes.options__wrapper}>
                    {filteredOptions.length === 0 ?
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
                        filteredOptions.map((option) => (
                        <button key={option._id} onClick={(e) => handleOptionClick(e, option)} className={classes.option__button}>{option.name}</button>
                    ))}
                </div>
            </>
        }
    </div>
    );
};

export default Select