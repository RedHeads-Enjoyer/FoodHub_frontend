import classes from "./styles.module.css";
import {useEffect, useRef, useState} from "react";

const Timer = ({onChange, steps, index, name}) => {
    const [duration, setDuration] = useState(
        {
            h: Math.floor(steps[index].duration / 3600),
            m: Math.floor(steps[index].duration % 3600 / 60),
            s: steps[index].duration % 60
        })
    const minutesRef = useRef()
    const secondsRef = useRef()

    useEffect(() => {
        const newSteps = []
        for (let i = 0; i < steps.length; i ++) {
            if (i === index) {
                let h = parseInt(duration.h)
                let m = parseInt(duration.m)
                let s = parseInt(duration.s)
                if (isNaN(h)) h = 0
                if (isNaN(m)) m = 0
                if (isNaN(s)) s = 0
                const newDuration = h * 3600 + m * 60 + s
                newSteps.push({...steps[i], duration: newDuration})
                continue
            }
            newSteps.push(steps[i])
        }
        onChange({ currentTarget: {name, value: newSteps} })
    }, [duration])

    const checkNumber = (num) => {
        if (num >= 60) return  59
        if (num < 0) return  0
        return num
    }

    const handleDurationHoursChange = (e) => {
        if (e.target.value.length >= 3) {
            minutesRef.current.focus()
            return
        }
        setDuration({...duration, h: checkNumber(parseInt(e.target.value))})
        if (e.target.value.length >= 2) {
            minutesRef.current.focus()
        }
    }

    const handleDurationMinutesChange = (e) => {
        if (e.target.value.length >= 3) {
            secondsRef.current.focus()
            return
        }
        setDuration({...duration, m: checkNumber(parseInt(e.target.value))})
        if (e.target.value.length >= 2) {
            secondsRef.current.focus()
        }
    }

    const handleDurationSecondsChange = (e) => {
        setDuration({...duration, s: checkNumber(parseInt(e.target.value))})
    }

    return (
        <div className={classes.duration__wrapper}>
            <div className={classes.number__wrapper}>
                <input
                    value={duration.h}
                    className={classes.number__input}
                    type={"number"}
                    onChange={handleDurationHoursChange}
                    placeholder={"00"}
                />
                <label>час</label>
            </div>
            <div className={classes.number__wrapper}>
                <input
                    ref={minutesRef}
                    value={duration.m}
                    className={classes.number__input}
                    type={"number"}
                    onChange={handleDurationMinutesChange}
                    placeholder={"00"}
                />
                <label>мин</label>
            </div>
            <div className={classes.number__wrapper}>
                <input
                    ref={secondsRef}
                    value={duration.s}
                    className={classes.number__input}
                    type={"number"}
                    onChange={handleDurationSecondsChange}
                    placeholder={"00"}
                />
                <label>сек</label>
            </div>
        </div>
    );
};

export default Timer