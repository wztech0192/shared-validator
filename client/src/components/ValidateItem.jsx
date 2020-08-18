import React from "react";
import Field from "./Field";
import { status, EMPTY_OBJECT } from "../common";

const newItem = {
    string: "",
    date: ""
};

export default ({ validateItem, setValidateItem, errors = EMPTY_OBJECT }) => {
    //console.log(validateItem);

    const onSurfaceChange = e => {
        setValidateItem({
            ...validateItem,
            [e.target.name]: e.target.value
        });
    };

    const onNestedChange = parent => e => {
        setValidateItem({
            ...validateItem,
            [parent]: {
                ...validateItem[parent],
                [e.target.name]: e.target.value
            }
        });
    };

    const onListChange = (parent, index) => e => {
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
            <Field label="Status" error={errors["status"]}>
                <select name="status" value={validateItem.status} onChange={onSurfaceChange}>
                    {Object.entries(status).map(([value, name]) => (
                        <option key={value} value={value}>
                            {name}
                        </option>
                    ))}
                </select>
            </Field>
            <Field label="String" error={errors["string"]}>
                <input name="string" value={validateItem.string} onChange={onSurfaceChange} />
            </Field>
            <Field label="Date" error={errors["date"]}>
                <input
                    name="date"
                    type="date"
                    value={validateItem.date}
                    onChange={onSurfaceChange}
                />
            </Field>
            <br />
            <Field
                label="List of String"
                error={errors["listOfString"]}
                render={nestedErrors => (
                    <>
                        <button onClick={onAddNested("listOfString", "")}>Add</button>
                        <ol>
                            {validateItem.listOfString.map((str, i) => (
                                <li key={i}>
                                    <Field error={nestedErrors[i]}>
                                        <input
                                            value={str}
                                            onChange={onListChange("listOfString", i)}
                                        />
                                    </Field>
                                </li>
                            ))}
                        </ol>
                    </>
                )}
            ></Field>
            <Field
                label="Nested Validate Item"
                error={errors["nestedValidateItem"]}
                render={nestedErrors => (
                    <div style={{ marginLeft: 10 }}>
                        <Field label="String" error={nestedErrors["string"]}>
                            <input
                                name="string"
                                value={validateItem.nestedValidateItem.string}
                                onChange={onNestedChange("nestedValidateItem")}
                            />
                        </Field>
                        <Field label="Date" error={nestedErrors["date"]}>
                            <input
                                name="date"
                                type="date"
                                value={validateItem.nestedValidateItem.date}
                                onChange={onNestedChange("nestedValidateItem")}
                            />
                        </Field>
                    </div>
                )}
            />
            <Field
                label="List of Validate Items"
                error={errors["listOfValidatableItems"]}
                render={nestedErrors => (
                    <>
                        <button onClick={onAddNested("listOfValidatableItems", newItem)}>
                            Add
                        </button>
                        <ol>
                            {validateItem.listOfValidatableItems.map((item, i) => {
                                const error = nestedErrors[i] || EMPTY_OBJECT;
                                return (
                                    <li key={i}>
                                        <Field label="String" error={error["string"]}>
                                            <input
                                                value={item.string}
                                                name="string"
                                                onChange={onListChange("listOfValidatableItems", i)}
                                            />
                                        </Field>
                                        <Field label="Date" error={error["date"]}>
                                            <input
                                                value={item.date}
                                                name="date"
                                                type="date"
                                                onChange={onListChange("listOfValidatableItems", i)}
                                            />
                                        </Field>
                                    </li>
                                );
                            })}
                        </ol>
                    </>
                )}
            />
            <Field
                label="List of No Validate Items"
                error={errors["listOfItems"]}
                render={nestedErrors => (
                    <>
                        <button onClick={onAddNested("listOfItems", newItem)}>Add</button>
                        <ol>
                            {validateItem.listOfItems.map((item, i) => {
                                const errors = nestedErrors[i] || EMPTY_OBJECT;
                                return (
                                    <li key={i}>
                                        <Field label="String" error={errors["string"]}>
                                            <input
                                                value={item.string}
                                                name="string"
                                                onChange={onListChange("listOfItems", i)}
                                            />
                                        </Field>
                                        <Field label="Date" error={errors["date"]}>
                                            <input
                                                value={item.date}
                                                name="date"
                                                type="date"
                                                onChange={onListChange("listOfItems", i)}
                                            />
                                        </Field>
                                    </li>
                                );
                            })}
                        </ol>
                    </>
                )}
            />
        </div>
    );
};
