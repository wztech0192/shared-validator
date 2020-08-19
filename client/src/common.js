import ValidatorFactory, { validateFor } from "./validators/validatorFactory";

const host = process.env.NODE_ENV !== "production" ? "https://localhost" : "http://142.11.215.231";
const apiURL = host + ":19988/api/test";

export const EMPTY_OBJECT = {};

export const validateCondition = {
    1: "=",
    2: ">",
    3: "<",
    4: ">=",
    5: "<=",
};

export const status = {
    1: "Draft",
    2: "Approved",
    3: "Completed",
};

export const postData = (validateItem, setErrors, clientValidate) => async (e) => {
    localStorage.setItem("status", validateItem.status);
    const errors = clientValidate && validateFor.ValidateItem(validateItem, validateItem.status);
    if (!errors) {
        const json = JSON.stringify(validateItem);
        try {
            const res = await fetch(apiURL, {
                method: "POST",
                body: json,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                alert("Success");
                setErrors(EMPTY_OBJECT);
            } else {
                let data = await res.json();
                alert(JSON.stringify(data, undefined, 4));
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        console.log(errors);
        setErrors(errors);
    }
};

export const getData = async (setValidatorLoaded) => {
    try {
        const res = await fetch(apiURL);
        console.log("ASdasd");
        if (res.ok) {
            let data = await res.json();
            setValidatorLoaded(ValidatorFactory.load(data));
        } else {
            alert("HTTP-Error: " + res.status, " - Try reload!");
        }
    } catch (e) {
        console.log("ASdasd");
        alert("Loading error, please refresh and try again");
    }
    console.log("ASdasd");
};
