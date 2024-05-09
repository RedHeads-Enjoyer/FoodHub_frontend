import classes from "./styles.module.css";
import InputTextArea from "../InputTextArea";
import Timer from "../Timer";
import {useEffect, useState} from "react";
import reset_time from '../../images/reset_time.png'
import end_timer_sound from '../../Sounds/end_timer_sound.mp3'
import useSound from "use-sound";

const PlayTimer = ({duration}) => {
    const [play] = useSound(end_timer_sound)
    const [time, setTime] = useState(duration);
    const [isActive, setIsActive] = useState(false);
    const [isStartVisible, setIsStartVisible] = useState(true)

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setTime((time) => {
                    if (time > 0) {
                        return time - 1;
                    } else {
                        clearInterval(interval);
                        setIsActive(false)
                        setIsStartVisible(false)
                        play()
                        return 0;
                    }
                });
            }, 1000);
        } else if (!isActive && time !== duration) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, time, duration]);

    const toggleStartPause = () => {
        setIsActive(!isActive);
    };

    const resetTime = () => {
        setTime(duration);
        setIsActive(false);
        setIsStartVisible(true)
    };

    return (
        <div className={classes.duration__wrapper}>
            <div className={isActive ? classes.number__wrapper__active: classes.number__wrapper}>
                <p>{Math.floor(time / 3600)}</p>
                <label>час</label>
            </div>
            <div className={isActive ? classes.number__wrapper__active: classes.number__wrapper}>
                <p>{Math.floor(time % 3600 / 60)}</p>
                <label>мин</label>
            </div>
            <div className={isActive ? classes.number__wrapper__active: classes.number__wrapper}>
                <p>{time % 60}</p>
                <label>сек</label>
            </div>
            {isStartVisible &&             <button onClick={toggleStartPause}>
                {isActive ? 'Пауза' : 'Старт'}
            </button>}

            {!isActive && time !== duration && (
                <button onClick={resetTime}>Занаво</button>
            )}
        </div>
    )
}


const StepsWithTimer = ({steps}) => {
    return (
        <div className={classes.steps__wrapper}>
            {steps !== undefined ? steps.map((step, index) => (
                <div key={`step${index}`}>
                    <div className={classes.step__wrapper}>
                        <div className={classes.header__wrapper}>
                            <div className={classes.index__wrapper}>
                                <p>{index + 1}</p>
                            </div>
                            {step.duration !== 0 && <PlayTimer duration={step.duration}/>}
                        </div>
                        <div className={classes.description__wrapper}>
                            <p className={classes.description}>{step.description}</p>
                        </div>
                    </div>

                </div>

            )) : ""}
        </div>
    );
};

export default StepsWithTimer