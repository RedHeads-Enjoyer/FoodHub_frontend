import React from 'react';
import classes from "./styles.module.css";

const InputNumber = ({max, min, placeholder, name, value, onChange, label}) => {
    const handleIncreaseButton = (e) => {
        e.preventDefault()
        if (value + 1 >= 11) return
        onChange({ currentTarget: {name, value: value + 1} })
    };

    const handleDecreaseButton = (e) => {
        e.preventDefault()
        if (value - 1 <= 0) return
        onChange({ currentTarget: {name, value: value - 1} })
    }

    return (
        <div className={classes.input__wrapper}>
            <label htmlFor={name}>{label}</label>
            <input className={classes.input}
                type={"number"}
                max={max}
                min={min}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                required
                disabled={true}
            />
            <button className={classes.increase__button} onClick={handleIncreaseButton}></button>
            <button className={classes.decrease__button} onClick={handleDecreaseButton}></button>

        </div>

    );
};

export default InputNumber