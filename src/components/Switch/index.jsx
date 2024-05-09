import classes from "./styles.module.css";

const Switch = ({label, name, onChange, value, required, first, second}) => {
    const handleSwitch = () => {
        onChange({ currentTarget: {name, value: !value} })
    }

    return (
        <div className={classes.switch__wrapper}>
            <label htmlFor={name}>{label}</label>
            <div className={classes.switch} onClick={handleSwitch}>
                {value ? <p>{first}</p> : <p>{second}</p>}
            </div>
        </div>
    );
};

export default Switch