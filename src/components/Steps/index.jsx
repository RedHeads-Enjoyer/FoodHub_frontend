import classes from "./styles.module.css";
import {useEffect, useState} from "react";
import InputTextArea from "../InputTextArea";
import Timer from "../Timer";

const Steps = ({steps, onChange, name}) => {
        const handleAddStepButton = (e) => {
        e.preventDefault()
        onChange({ currentTarget: {name, value: [...steps, {duration: 0, description: ""}]} })
    }

    const handleDescriptionChange = (e, index) => {
        steps[index].description = e.target.value
        onChange({ currentTarget: {name, value: steps}})
    }

    const handleStepDelete = (e, index) => {
        e.preventDefault();
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        onChange({ currentTarget: {name, value: newSteps}})
    }


    return (
        <div className={classes.steps__wrapper}>
            {steps.map((step, index) => (
                <div className={classes.step__wrapper} key={index}>
                    <div className={classes.div__flex}>
                        <div className={classes.index__wrapper}>
                            <p>{index + 1}</p>
                        </div>
                        <Timer
                            onChange={onChange}
                            steps={steps}
                            index={index}
                            name={"steps"}
                        />
                        <button
                            className={classes.delete__button}
                            onClick={(e) => handleStepDelete(e, index)}
                        ></button>
                    </div>
                    <InputTextArea
                        value={step.description}
                        placeholder={"Описание"}
                        required={true}
                        name={`editDescription${index}`}
                        onChange={(e) => handleDescriptionChange(e, index)}
                    />
                </div>
            ))}

            <button className={classes.add__step__button} onClick={handleAddStepButton}><p>+</p></button>
        </div>

    );
};

export default Steps