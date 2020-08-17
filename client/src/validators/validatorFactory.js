class ValidatorFactory {
    validateCondition = {
        Equal: 1,
        Greater: 2,
        Less: 3,
        GreaterOrEqual: 4,
        LessOrEqual: 5
    };

    validators = {};

    load(validatorMetadatas) {
        try {
            for (let metadata of validatorMetadatas) {
                validators[metadata.validatorName] = metadata;
            }

            console.log("validators", validators);

            return true;
        } catch (e) {
            console.error("validator failed to load");
            console.error(e);
        }
        return false;
    }
}

var factoryInstance = new ValidatorFactory();
const validators = factoryInstance.validators;
export { factoryInstance as default, validators };
