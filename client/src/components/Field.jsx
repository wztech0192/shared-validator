import React from "react";
import { EMPTY_OBJECT } from "../common";

export default ({ label, error = EMPTY_OBJECT, render, children }) => (
    <div>
        <label>{label}: </label>

        {children}
        {error && typeof error === "string" && <span style={{ color: "red" }}> {error}</span>}
        {render && render(typeof error !== "string" && error)}

        <br />
    </div>
);
