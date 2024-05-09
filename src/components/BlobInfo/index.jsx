import React, { useState, useEffect } from 'react';
import classes from "./styles.module.css";

const BlobInfo = ({label, value}) => {
    return (
        <div className={classes.blob__info}>
            <p className={classes.blob__value}>{value}</p>
            <p className={classes.blob__label}>{label}</p>
        </div>
    );
};

export default BlobInfo