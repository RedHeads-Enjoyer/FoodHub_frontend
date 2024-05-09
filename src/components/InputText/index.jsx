import classes from "./styles.module.css";

const InputText = ({label, type, placeholder, name, onChange, value, required}) => {
      return (
          <div>
              <label htmlFor={name}>{label}</label>
              <input
                  id = {name}
                  className={classes.input__class}
                  type={type}
                  placeholder={placeholder}
                  name={name}
                  onChange={onChange}
                  value={value}
                  required={required}
              />
          </div>
    );
};

export default InputText