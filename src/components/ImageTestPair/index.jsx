import React from 'react';
import classes from "./styles.module.css";

const ImageTextPair = ({image, text}) => {
      return (
          <div className={classes.pair__wrapper}>
              <img src={image}/>
              <p>{text}</p>
          </div>
    );
};

export default ImageTextPair