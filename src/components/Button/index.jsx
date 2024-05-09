import classes from "./styles.module.css";

const Button = ({name, onClick}) => {
      return (
          <button className={classes.btn} onClick={onClick}><p>{name}</p></button>
    );
};

export default Button