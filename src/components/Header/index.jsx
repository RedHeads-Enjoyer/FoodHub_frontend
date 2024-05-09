import React, {useEffect, useState} from 'react';
import classes from "./styles.module.css";
import axios from "axios";
import {dbUrl} from "../../config";
import {getJwtAuthHeader, fetchImage} from "../../functions";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {changeStatus} from "../../slices/userSlice";
import search_button from"../../images/search_button.png"

const Header = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch();
    const userStatus = useSelector((state)=>state.user.status);

    const [currentUser, setCurrentUser] = useState('')
    const [image, setImage] = useState('')
    const [menuStatus, setMenuStatus] = useState(false)
    const [searchRequest, setSearchRequest] = useState('')

    useEffect(() => {
        if (userStatus === true) {
            axios.get(dbUrl + `/user/me`,getJwtAuthHeader())
                .then(data => {
                    setCurrentUser(data.data)
                })
                .catch(error => {
                    console.error("Ошибка получения данных:", error.response.data.message);
                });
        }
    }, [userStatus])

    useEffect(() => {
        if (currentUser !== '') {
            fetchImage(setImage, currentUser.image)
        }
    }, [currentUser])

    const changeMenuStatus = () => {
        setMenuStatus(prevState => !prevState)
    }

    const handleMenuExit = () => {
        axios.post(dbUrl + `/auth/logout`, {}, getJwtAuthHeader())
            .then(data => {
                console.log(data, 'ass')
                if (data.status === 200) {
                    setMenuStatus(false)
                    dispatch(changeStatus(false))
                    navigate('/login')
                }
            })
            .catch(error => {
                console.error("Ошибка при выходе: ", error.response.data.message);
            });
    }

    const handleMenuProfile = () => {
        setMenuStatus(false)
        navigate('/user/' + currentUser._id)
    }

    const handleMenuAddRecipe = () => {
        setMenuStatus(false)
        navigate('/createRecipe')
    }

    const handleMenuSettings = () => {
        setMenuStatus(false)
        navigate('/user/edit/' + currentUser._id)
    }

    const handleSearchRequest = (e) => {
        setSearchRequest(e.target.value)
    }

    const handleSearchButton = (e) => {
        e.preventDefault();
        navigate('/search?searchRequest=' + encodeURIComponent(searchRequest));
    }

      return (
          <header className={classes.header__wrapper}>
              <Link to={"/search?searchRequest="}>
                  <div className={classes.logo__wrapper}>
                      <h1 className={classes.name}>ЗРЯТЬ ЕДА</h1>
                  </div>
              </Link>
              { userStatus !== false &&
              <div className={classes.search__bar__wrapper}>
                  <input
                      type={"text"}
                      placeholder={"Найти..."}
                      className={classes.search__bar}
                      value={searchRequest}
                      onChange={handleSearchRequest}
                  />
                  <button
                      className={classes.search__button}
                      onClick={handleSearchButton}
                  >
                      <img src={search_button}/>
                  </button>
              </div> }

              {userStatus !== false ? <>
                  <div className={classes.user__wrapper} onClick={changeMenuStatus}>
                      <img className={classes.user__avatar} src={image}/>
                      <p className={classes.user__username}>{currentUser.username}</p>
                      {menuStatus === true &&
                          <div className={classes.menu__wrapper}>
                              <ul className={classes.list__wrapper}>
                                  <li className={classes.menu__item__wrapper}>
                                      <div className={classes.menu__item}>
                                          <button onClick={handleMenuProfile}>Мой профиль</button>
                                      </div>
                                  </li>
                                  <li className={classes.menu__item__wrapper}>
                                      <div className={classes.menu__item}>
                                          <button onClick={handleMenuAddRecipe}>Добавить рецепт</button>
                                      </div>
                                  </li>
                                  <li className={classes.menu__item__wrapper}>
                                      <div className={classes.menu__item}>
                                          <button onClick={handleMenuSettings}>Настройки</button>
                                      </div>
                                  </li>
                                  <li className={classes.menu__item__wrapper}>
                                      <div className={classes.menu__item}>
                                          <button onClick={handleMenuExit}>Выйти</button>
                                      </div>
                                  </li>
                              </ul>
                          </div>
                      }
                  </div>
              </>: ""}

          </header>
    );
};

export default Header