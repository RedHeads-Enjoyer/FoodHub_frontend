import React, {useEffect} from "react";
import {useState} from "react";
import axios from "axios";
import {dbUrl, translit} from "../config";
import classes from "./CreateRecipePage.module.css"
import InputText from "../components/InputText";
import InputTextArea from "../components/InputTextArea";
import Select from "../components/Select";
import InputNumber from "../components/InputNumber";
import Switch from "../components/Switch";
import IngredientsList from "../components/IngredientsList";
import EquipmentList from "../components/EquipmentList";
import image_placeholder from "../images/image_placeholder.svg"
import Steps from "../components/Steps";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {getJwtAuthFilesHeader, getJwtAuthHeader} from "../functions";


const CreateRecipePage = () => {
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        image: "",
        difficult: 5,
        ingredients: [],
        kitchenID: "",
        typeID: "",
        equipment: [],
        steps: [],
        visibility: true
    })

    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [equipment, setEquipment] = useState([])
    const [selectedEquipment, setSelectedEquipment] = useState([])
    const [kitchens, setKitchens] = useState([])
    const [types, setTypes] = useState([])
    const [image, setImage] = useState("")
    const [currentUser, setCurrentUser] = useState('')
    const userStatus = useSelector((state)=>state.user.status);

    const navigate = useNavigate()

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
        axios
            .get(dbUrl + '/ingredient')
            .then(data => {
                setIngredients(data.data)
                }
            )

        axios
            .get(dbUrl + '/kitchen')
            .then(data => {
                setKitchens(data.data)
                }
            )

        axios
            .get(dbUrl + '/type')
            .then(data => {
                    setTypes(data.data)
                }
            )

        axios
            .get(dbUrl + '/equipment')
            .then(data => {
                    setEquipment(data.data)
                }
            )
    }, [])


    const handleChangeRecipe = ({currentTarget: input}) => {
        setRecipe({...recipe, [input.name]: input.value})
    }

    const handleChangeSelectedIngredients = () => {
        let recipeIngredients = []
        selectedIngredients.forEach((ingredient) => {
            recipeIngredients.push({
                ingredientID: ingredient._id,
                quantity: parseInt(ingredient.quantity)
            })
        })
        setRecipe({
            ...recipe,
            ingredients: recipeIngredients,
        })
    }

    const handleChangeSelectedEquipment = () => {
        let recipeEquipment = []
        selectedEquipment.forEach((equipment) => {
            recipeEquipment.push(String(equipment._id))
        })
        setRecipe({
            ...recipe,
            equipment: recipeEquipment,
        })
    }

    const handleChangeRecipeType = (id) => {
        setRecipe({
            ...recipe,
            typeID: id,
        })
    }

    const handleChangeRecipeKitchen = (id) => {
        setRecipe({
            ...recipe,
            kitchenID: id,
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Получаем выбранный файл изображения
        const newFileName = translit(file.name);
        const renamedFile = new File([file], newFileName, { type: file.type });

        if (file) {
            setRecipe(prevRecipe => ({
                ...prevRecipe,
                image: renamedFile // Обновляем состояние recipe, добавляя выбранный файл в качестве изображения
            }));

            let reader = new FileReader()
            reader.readAsDataURL(renamedFile)
            reader.onload = () => {
                setImage(reader.result)
            }
        }
    };

    useEffect(() => {
        console.log(recipe)
    }, [recipe])

    useEffect(() => {
        handleChangeSelectedIngredients()
    }, [selectedIngredients])

    useEffect(() => {
        handleChangeSelectedEquipment()
    }, [selectedEquipment])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', recipe.image); // Используем выбранный файл из состояния recipe
            formData.append('name', recipe.name);
            formData.append('description', recipe.description);
            formData.append('difficult', recipe.difficult);
            formData.append('kitchenID', recipe.kitchenID);
            formData.append('typeID', recipe.typeID);
            formData.append('equipment', JSON.stringify(recipe.equipment));
            formData.append('ingredients', JSON.stringify(recipe.ingredients));
            formData.append('steps', JSON.stringify(recipe.steps));
            formData.append('visibility', recipe.visibility);
            formData.append('authorID', recipe.authorID);


            const url = dbUrl + '/recipe';
            const response = await axios.post(url, formData, getJwtAuthFilesHeader()).then(() => {
                navigate('/user/' + currentUser._id)
            })
            console.log(response);
        } catch (error) {
            if (error.response) {
                // Здесь обрабатываем ошибку на уровне ответа от сервера
                console.log(error.response.data.message);
            } else if (error.request) {
                // Здесь обрабатываем ошибку на уровне запроса
                console.log('Ошибка запроса:', error.request);
            } else {
                // Здесь обрабатываем другие типы ошибок
                console.log('Ошибка:', error.message);
            }
        }
    }

    return (
        <div className={classes.createRecipePage__wrapper}>
            <form onSubmit={handleSubmit}>
                <p className={classes.page__label}>Создание рецепта</p>
                <div className={classes.recipe__info__wrapper}>
                    <div className={classes.main__info__wrapper}>
                        <InputText
                            label={"Название рецепта"}
                            type={"text"}
                            placeholder={"Введите название"}
                            name={"name"}
                            onChange={handleChangeRecipe}
                            value={recipe.name}
                        />
                        <InputTextArea
                            label={"Описание рецепта"}
                            placeholder={"Описание"}
                            name={"description"}
                            onChange={handleChangeRecipe}
                            value={recipe.description}
                            required
                        />
                        <div className={classes.flex__wrapper}>
                            <Select
                                label={"Тип кухни"}
                                name={"kitchenID"}
                                onChange={handleChangeRecipeKitchen}
                                options={kitchens}
                                link = '/kitchen'
                            />
                            <Select
                                label={"Тип блюда"}
                                name={"typeID"}
                                onChange={handleChangeRecipeType}
                                options={types}
                                link = '/type'
                            />
                        </div>
                        <div className={classes.flex__wrapper}>
                            <InputNumber
                                max={10}
                                min={1}
                                label={"Сложность"}
                                name={"difficult"}
                                value={recipe.difficult}
                                onChange={handleChangeRecipe}
                                required
                            />
                            <Switch
                                label={"Доступ"}
                                first={"Для всех"}
                                second={"Только мне"}
                                name={"visibility"}
                                onChange={handleChangeRecipe}
                                value={recipe.visibility}
                            />
                        </div>
                    </div>
                    <div className={classes.ingredients__wrapper}>
                        <IngredientsList
                            label={"Ингредиенты"}
                            addedIngredients={recipe.ingredients}
                            allIngredients={ingredients}
                            setTarget={handleChangeRecipe}
                            setAllIngredients={setIngredients}
                            name={"ingredients"}
                        />
                    </div>
                    <div className={classes.equipment__wrapper}>
                        <EquipmentList
                            label={"Оборудование"}
                            addedEquipment={recipe.equipment}
                            allEquipment={equipment}
                            setTarget={handleChangeRecipe}
                            setAllEquipment={setEquipment}
                            name={"equipment"}
                        />
                    </div>
                    <div className={classes.image__wrapper}>
                        <label htmlFor={"image"}>
                            <p>Заставка </p>
                            <div className={classes.image__label}>
                                {image === "" || image == null
                                    ?
                                    <img src={image_placeholder}/>
                                    :
                                    <img src={image}/>
                                }

                            </div>
                        </label>
                        <input
                            className={classes.input__file}
                            type="file"
                            accept={"image/*"}
                            onChange={handleImageChange}
                            id={"image"}
                        />
                    </div>
                    <Steps
                        steps={recipe.steps}
                        name={"steps"}
                        onChange={handleChangeRecipe}
                    />
                </div>
                <div className={classes.submit__button__wrapper}>
                    <button className={classes.submit__button} type={"submit"}>Создать</button>
                </div>
            </form>
        </div>
    )
}

export default CreateRecipePage