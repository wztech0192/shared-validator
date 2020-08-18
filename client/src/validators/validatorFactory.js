const VALIDATE_CONDITION = {
    Equal: 1,
    Greater: 2,
    Less: 3,
    GreaterOrEqual: 4,
    LessOrEqual: 5
};

//valid functions
const validateFor = {};

//validator metadata
const validatorMetadatas = {};

class ValidatorFactory {
    validateFor = validateFor;
    validatorMetadatas = validatorMetadatas;

    /**
     * Load validator metadatas
     * @param {metadata[]} metadatas
     */
    load(metadatas) {
        for (let metadata of metadatas) {
            if (!this.loadSingle(metadata)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Load single validator metadata
     * @param {metadata} metadata
     */
    loadSingle(metadata) {
        try {
            this.validatorMetadatas[metadata.validatorName] = metadata;
            this.validateFor[metadata.validatorName] = (item, status) =>
                this.validate(metadata.validatorName, item, status);
            return true;
        } catch (e) {
            console.error("validator failed to load");
            console.error(e);
        }
        return false;
    }

    /**
     * check if the object is empty
     * @param {object} errors
     */
    hasError(errors) {
        if (errors) {
            if (typeof errors === "string") {
                return errors;
            }
            let error;

            for (let key in errors) {
                error = errors[key];
                if (error && this.hasError(error)) {
                    return errors;
                }
            }
        }
        return undefined;
    }

    /**
     * check if the property should be validate base on the status provide
     * @param {any} compareStatus
     * @param {any} propRule
     */
    validateStatus(compareStatus, propRule) {
        const validateStatus = propRule.validateStatus;
        if (
            validateStatus === null ||
            validateStatus === undefined ||
            compareStatus === validateStatus
        ) {
            return true;
        }

        if (typeof validateStatus === "number") {
            const compareStatusNum = parseInt(compareStatus); //make sure compareStatus is number too
            switch (propRule.validateCondition) {
                case VALIDATE_CONDITION.Equal:
                    return compareStatusNum === validateStatus;
                case VALIDATE_CONDITION.Greater:
                    return compareStatusNum > validateStatus;
                case VALIDATE_CONDITION.GreaterOrEqual:
                    return compareStatusNum >= validateStatus;
                case VALIDATE_CONDITION.Less:
                    return compareStatusNum < validateStatus;
                case VALIDATE_CONDITION.LessOrEqual:
                    return compareStatusNum <= validateStatus;
                default:
            }
        }

        return compareStatus === validateStatus;
    }

    getErrorMessage(propRule) {
        return propRule.message || `${propRule.messageName} is required`;
    }

    validateObject(validatorName, item, status) {
        const metadata = this.validatorMetadatas[validatorName];
        if (metadata) {
            const rules = metadata.propertyRules;
            const errors = {};
            let propRule, value;
            for (let propName in rules) {
                if (!(propRule = rules[propName])) throw new Error("Invalid metadata error");

                console.log("***For " + propName);
                if (propRule.required && this.validateStatus(status, propRule)) {
                    value = item[propName];
                    console.log(value, typeof value, propRule);
                    if (!value) {
                        errors[propName] = this.getErrorMessage(propRule);
                    } else if (typeof value === "object") {
                        errors[propName] = this.validate(
                            propRule.useValidator,
                            value,
                            status,
                            propRule
                        );
                    }
                }
            }
            return this.hasError(errors);
        }
    }

    /**
     * validate item
     * @param {string} validatorName
     * @param {any} item
     * @param {any} status
     */
    validate(validatorName, item, status, propRule) {
        let errors;
        if (Array.isArray(item)) {
            //validate list length
            if (item.length === 0) {
                errors = `${propRule.messageName} is empty`;
            } else {
                errors = {};
                //validate list children
                if (propRule.validateChildren) {
                    for (let i in item) {
                        if (!item[i]) {
                            errors[i] = `${propRule.messageName} - ${i} is empty`;
                        } else if (typeof item[i] === "object") {
                            errors[i] = this.validate(validatorName, item[i], status, propRule);
                        }
                    }
                }
            }
        } else {
            //validate object
            errors = this.validateObject(validatorName, item, status);
        }
        return this.hasError(errors);
    }
}

var factoryInstance = new ValidatorFactory();
export { factoryInstance as default, validateFor, validatorMetadatas, VALIDATE_CONDITION };
