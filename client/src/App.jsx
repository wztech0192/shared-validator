import React from "react";
import DisplayValidators from "./components/DisplayValidators";
import { postData, getData, EMPTY_OBJECT } from "./common";
import ValidateItem from "./components/ValidateItem";

const defaultState = {
    string: "",
    status: localStorage.getItem("status") || 1,
    date: "",
    nestedValidateItem: { string: "", date: "" },
    listOfString: [],
    listOfItems: [],
    listOfValidatableItems: []
};

function App() {
    const [isValidatorLoaded, setValidatorLoaded] = React.useState(false);
    const [validateItem, setValidateItem] = React.useState(defaultState);

    const [errors, setErrors] = React.useState();
    React.useEffect(() => {
        getData(setValidatorLoaded);
    }, []);

    const jsonError = React.useMemo(() => errors && JSON.stringify(errors, null, 4), [errors]);
    return (
        <div className="App">
            {!isValidatorLoaded ? (
                <div>Loading Validators....</div>
            ) : (
                <div>
                    {DisplayValidators()} <hr />
                    <button
                        style={{ float: "right" }}
                        onClick={() => {
                            setErrors(EMPTY_OBJECT);
                            setValidateItem(defaultState);
                        }}
                    >
                        Clear
                    </button>
                    <button onClick={postData(validateItem, setErrors, true)}>
                        Validate and Post
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={postData(validateItem, setErrors, false)}>
                        Post Without Validate
                    </button>
                    <br />
                    <br />
                    <ValidateItem
                        validateItem={validateItem}
                        setValidateItem={setValidateItem}
                        errors={errors}
                    />
                    <hr />
                    <div>
                        Error Object:
                        {errors ? <pre>{jsonError}</pre> : "No Error"}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
