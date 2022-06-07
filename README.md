# shared-validator

Many developers hate to write duplicated validation in both frontend and the backend. This package consolidate the validation logic in .net backend!

## Flow
1.  Define validation rule attribute in backend .net code
2.  Frontend initate a handshake to backend
3.  Backend generate validation schema from defined validation rule and send it to frontend during handshake
4.  Frontend retrieve validation schema and initiate the validator

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
    public ActionResult PostData(ValidateItem item)
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
const isLoaded = ValidatorFactory.load(data);

//validate model
const errors = validateFor.ValidateItem(item);
```
