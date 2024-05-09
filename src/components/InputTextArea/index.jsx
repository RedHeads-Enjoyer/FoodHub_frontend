import classes from "./styles.module.css";
import {useEffect, useRef} from "react";

const InputTextArea = ({label, placeholder, name, onChange, value, required}) => {
    const textAreaRef = useRef(null);

    const resizeOnChange = (e) => {
        onChange(e);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    useEffect(() => {
        const element = document.getElementById(name)
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    }, []);

    return (
        <div>
            {label !== null && <label htmlFor={name}>{label}</label>}
            <textarea
                id = {name}
                className={classes.input__class} // Убедитесь, что класс определен в вашем CSS-модуле
                placeholder={placeholder}
                name={name}
                onChange={resizeOnChange} // Исправлено: теперь функция вызывается при изменении
                value={value}
                required={required}
            />
        </div>
    );
};

export default InputTextArea