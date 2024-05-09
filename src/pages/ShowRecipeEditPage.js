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
import {useNavigate, useParams} from "react-router-dom";
import {fetchImage, getJwtAuthFilesHeader, getJwtAuthHeader} from "../functions";
import Loading from "../components/Loading";
import Cookies from "js-cookie";


const CreateRecipePage = () => {
    const [recipe, setRecipe] = useState({})
    const {id} = useParams()

    const [ingredients, setIngredients] = useState([])
    const [equipment, setEquipment] = useState([])
    const [kitchens, setKitchens] = useState([])
    const [types, setTypes] = useState([])
    const [image, setImage] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        console.log(recipe)
    }, [recipe])

    useEffect(() => {
        async function fetchData() {
            try {
                // Получаем данные рецепта
                const recipeResponse = await axios.get(dbUrl + '/recipe/' + id, getJwtAuthHeader());
                const recipeData = recipeResponse.data;
                setRecipe(recipeData);
                const recipeIngredientIds = recipeData.ingredients.map(ing => ing._id);
                const recipeEquipmentIds = recipeData.equipment.map(eq => eq);

                // Получаем ингредиенты
                const ingredientsResponse = await axios.get(dbUrl + '/ingredient');
                const ingredientsMap = ingredientsResponse.data.reduce((map, ingredient) => {
                    map[ingredient._id] = ingredient;
                    return map;
                }, {});
                const newRecipeIngredients = recipeData.ingredients.map(ingredient => {
                    return { ...ingredient, ...ingredientsMap[ingredient._id] };
                });
                setRecipe(prevRecipe => ({ ...prevRecipe, ingredients: newRecipeIngredients }));
                const filteredIngredients = ingredientsResponse.data.filter(item =>
                    !recipeIngredientIds.includes(item._id)
                );
                setIngredients(filteredIngredients);

                // Получаем оборудование
                const equipmentResponse = await axios.get(dbUrl + '/equipment');
                const equipmentMap = equipmentResponse.data.reduce((map, equipment) => {
                    map[equipment._id] = equipment;
                    return map;
                }, {});
                const newRecipeEquipment = recipeData.equipment.map(eq => {
                    return {...equipmentMap[eq] }; // Исправьте здесь, чтобы использовать eq._id
                });
                setRecipe(prevRecipe => ({ ...prevRecipe, equipment: newRecipeEquipment }));
                const filteredEquipment = equipmentResponse.data.filter(item =>
                    !recipeEquipmentIds.includes(item._id)
                );
                setEquipment(filteredEquipment);

                // Получаем данные о кухне
                const kitchensResponse = await axios.get(dbUrl + '/kitchen');
                setKitchens(kitchensResponse.data);

                // Получаем типы
                const typesResponse = await axios.get(dbUrl + '/type');
                setTypes(typesResponse.data);

                fetchImage(setImage, recipeData.image)

            } catch (error) {
                console.log(error.message);
            }
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        if (Object.keys(recipe).length === 0 || ingredients.length === 0 || equipment.length === 0) return
        setIsLoading(false)
    }, [recipe, ingredients])


    const handleChangeRecipe = ({currentTarget: input}) => {
        setRecipe({...recipe, [input.name]: input.value})
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

    const handleDeleteRecipe = (e) => {
        e.preventDefault()
        console.log('asd')
        axios.delete(dbUrl + '/recipe/' + id).then(() => {
        navigate('/user/' + recipe.authorID)
        }
        ) .catch(error => {
            console.error('Ошибка при удалении рецепта:', error);
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', recipe.image);
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

            console.log(recipe)
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const url = dbUrl + '/recipe/' + id;
            await axios.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: "Bearer " + Cookies.get("token")
                }
            }).then((response) => {
                navigate('/recipe/' + id)
            })
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
                {isLoading ? <Loading/> :
                <>
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
                            <button className={classes.submit__button} type={"submit"}>Изменить</button>
                        </div>
                        <div className={classes.submit__button__wrapper}>
                            <button className={classes.submit__button} onClick={handleDeleteRecipe}>Удалить рецепт</button>
                        </div>
                </>

                }

            </form>
        </div>
    )
}

export default CreateRecipePage