import { validateFor } from "./validators/validatorFactory";

export const EMPTY_OBJECT = {};

export const validateCondition = {
    1: "=",
    2: ">",
    3: "<",
    4: ">=",
    5: "<="
};

export const status = {
    1: "Draft",
    2: "Approved",
    3: "Completed"
};

export const postData = (validateItem, setErrors, clientValidate) => async e => {
    localStorage.setItem("status", validateItem.status);
    const errors = clientValidate && validateFor.ValidateItem(validateItem, validateItem.status);
    if (!errors) {
        const json = JSON.stringify(validateItem);
        try {
            const res = await fetch("https://localhost:44359/api/test", {
                method: "POST",
                body: json,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
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
