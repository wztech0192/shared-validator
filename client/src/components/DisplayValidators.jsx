import React from "react";
import { validatorMetadatas } from "../validators/validatorFactory";
import { status, validateCondition } from "../common";

export default () => (
    <ul>
        {Object.entries(validatorMetadatas).map(([name, metadata]) => (
            <li key={name}>
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
