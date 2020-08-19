# shared-validator

A simple shared validator that is able to validate both js front-end and .net back-end

## Demo

http://wztechs.com/shared-validator/

## How to use

1. Add SharedValidation Attribute in the Backend model

```C#
    [SharedValidatable]
    class ValidateItem{

        [SharedValidation]
        public string Proeprty{get;set;}
    }
```

2. Backend validation

```C#
    public ActionResult PostData()
    {
        var _validationFactory = new ValidationFactory();
        var errors = _validationFactory.Validate(item);
    }
```

3. Pass validator metadata to the frontend

```C#
    public ActionResult GetData()
    {
        return Ok(_validationFactory.GetValidatorSchemas(typeof(ValidateItem));
    }
```

4. In the Frontend, load the validator metadata, and use it to validate

```javascript
import ValidatorFactory, { validateFor } from "./validatorFactory";

//load metadata
setValidatorLoaded(ValidatorFactory.load(data));

//validate model
const errors = validateFor.ValidateItem(item);
```
