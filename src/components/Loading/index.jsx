import classes from "./styles.module.css";

const Loading = () => {
    return (
        <div className={classes.loading__wrapper}>
            <div className={classes.loading}></div>
        </div>
    );
};

export default Loading