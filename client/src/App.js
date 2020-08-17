import React from "react";
import ValidatorFactory, { validators } from "./validators/validatorFactory";

const status = {
    1: "Draft",
    2: "Approved",
    3: "Completed"
};
const validateCondition = {
    1: "=",
    2: ">",
    3: "<",
    4: ">=",
    5: "<="
};

const postData = async validateItem => {
    try {
        const res = await fetch("https://localhost:44359/api/test", {
            method: "POST",
            body: JSON.stringify(validateItem),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });
        let data = await res.json();

        if (res.ok) {
            alert("Success");
        } else {
            alert(JSON.stringify(data));
        }
    } catch (e) {
        console.log(e);
    }
};
function App() {
    const [isValidatorLoaded, setValidatorLoaded] = React.useState(false);

    const [validateItem, setValidateItem] = React.useState({
        string: "",
        date: null,
        listOfString: [],
        listOfItems: [],
        listOfValidatableItems: []
    });

    React.useEffect(() => {
        (async () => {
            const res = await fetch("https://localhost:44359/api/test");
            if (res.ok) {
                let data = await res.json();
                setValidatorLoaded(ValidatorFactory.load(data));
            } else {
                alert("HTTP-Error: " + res.status);
            }
        })();
    }, []);

    return (
        <div className="App">
            {!isValidatorLoaded ? (
                <div>Loading Validators....</div>
            ) : (
                <div>
                    {DisplayValidators()} <hr />
                    <button
                        onClick={() => {
                            if (false) {
                                postData(validateItem);
                            }
                        }}
                    >
                        Validate and Post
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={postData(validateItem)}>Post Without Validate</button>
                    <br />
                    <br />
                    <ValidateItem validateItem={validateItem} setValidateItem={setValidateItem} />
                </div>
            )}
        </div>
    );
}

const ValidateItem = ({ validateItem, setValidateItem }) => {
    console.log(validateItem);

    const onSurfaceChange = e => {
        setValidateItem({
            ...validateItem,
            [e.target.name]: e.target.value
        });
    };

    const onNestedChange = (parent, index) => e => {
        setValidateItem({
            ...validateItem,
            [parent]: validateItem[parent].map((item, i) =>
                i === index
                    ? e.target.name
                        ? { ...item, [e.target.name]: e.target.value }
                        : e.target.value
                    : item
            )
        });
    };

    const onAddNested = (key, item) => e => {
        setValidateItem({
            ...validateItem,
            [key]: [...validateItem[key], item]
        });
    };

    return (
        <div>
            <div>
                <label>Status: </label>
                <select name="status" value={validateItem.status} onChange={onSurfaceChange}>
                    {Object.entries(status).map(([value, name]) => (
                        <option key={value} value={value}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>
            <br />
            <div>
                <label>String: </label>
                <input name="string" value={validateItem.string} onChange={onSurfaceChange} />
            </div>
            <br />
            <div>
                <label>Date: </label>
                <input
                    name="date"
                    type="date"
                    value={validateItem.date}
                    onChange={onSurfaceChange}
                />
            </div>
            <br />
            <div>
                <label>List of String: </label>
                <button onClick={onAddNested("listOfString", "")}>Add</button>
                <ol>
                    {validateItem.listOfString.map((str, i) => (
                        <li key={i}>
                            <input value={str} onChange={onNestedChange("listOfString", i)} />
                        </li>
                    ))}
                </ol>
            </div>
            <br />
            <div>
                <label>List of No Validate Items: </label>
                <button onClick={onAddNested("listOfItems", {})}>Add</button>
                <ol>
                    {validateItem.listOfItems.map((item, i) => (
                        <li key={i}>
                            <span>String: </span>
                            <input
                                value={item.string}
                                name="string"
                                onChange={onNestedChange("listOfItems", i)}
                            />
                            <br />
                            <span>Date: </span>
                            <input
                                value={item.date}
                                name="date"
                                type="date"
                                onChange={onNestedChange("listOfItems", i)}
                            />
                        </li>
                    ))}
                </ol>
            </div>
            <div>
                <label>List of Validate Items: </label>
                <button onClick={onAddNested("listOfValidatableItems", {})}>Add</button>
                <ol>
                    {validateItem.listOfValidatableItems.map((item, i) => (
                        <li key={i}>
                            <span>String: </span>
                            <input
                                value={item.string}
                                name="string"
                                onChange={onNestedChange("listOfValidatableItems", i)}
                            />
                            <br />
                            <span>Date: </span>
                            <input
                                value={item.date}
                                name="date"
                                type="date"
                                onChange={onNestedChange("listOfValidatableItems", i)}
                            />
                        </li>
                    ))}
                </ol>
            </div>
            <br />
        </div>
    );
};

const DisplayValidators = () => (
    <ul>
        {Object.entries(validators).map(([name, metadata]) => (
            <li>
                <b>{name}</b>
                <ul>
                    {Object.entries(metadata.propertyRules).map(([name, rule]) => (
                        <li key={name}>
                            <span>
                                {name}: Required
                                {rule.validateStatus
                                    ? ` ${validateCondition[rule.validateCondition]} ${
                                          status[rule.validateStatus]
                                      }`
                                    : ""}
                            </span>
                        </li>
                    ))}
                </ul>
            </li>
        ))}
    </ul>
);

export default App;
