using CoreServer.Validators.Attributes;
using CoreServer.Validators.DTOs;
using CoreServer.Validdators.DTOs;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

namespace CoreServer.Validators.Factory
{
    public class SharedValidationFactory : ISharedValidationFactory
    {
        private static readonly Regex NAME_FORMAT_PATTERN = new Regex(@"[A-Z][a-z]");
        private static readonly Type VALIDATABLE_TYPE = typeof(SharedValidatableAttribute);
        private static readonly Type VALIDATION_TYPE = typeof(SharedValidationAttribute);

        public SharedValidationFactory() { }

        public IList<SharedValidatorDTO> GetValidatorSchemas(params Type[] targetTypes)
        {
            var validators = new List<SharedValidatorDTO>();
            foreach (var type in targetTypes)
            {
                PopulateValidatorSchema(validators, type);
            }
            return validators;
        }

        public void PopulateValidatorSchema(ICollection<SharedValidatorDTO> validators, Type targetType)
        {
            if (isValidatable(targetType))
            {
                if (!validators.Any(v => v.ValidatorName == targetType.Name))
                {
                    var validatorDTO = new SharedValidatorDTO()
                    {
                        ValidatorName = targetType.Name
                    };
                    validators.Add(validatorDTO);

                    foreachValidationPropertiesOf(targetType, (prop, metadata) =>
                    {
                        if (!validatorDTO.PropertyRules.ContainsKey(prop.Name))
                        {
                            var propType = prop.PropertyType;

                            var validatePropertyDTO = new SharedValidationPropertyRuleDTO(metadata, formatName(prop.Name), getTypeName(propType));

                            if (isList(propType))
                            {
                                propType = propType.GetGenericArguments().Last();
                            }

                            //add nested validatable object
                            if (isValidatable(propType))
                            {
                                validatePropertyDTO.UseValidator = propType.Name;
                                PopulateValidatorSchema(validators, propType);
                            }

                            validatorDTO.PropertyRules[prop.Name] = validatePropertyDTO;
                        }
                    });
                }
            }
        }

    

        public IList<string> Validate<T, TStatus>(T target, TStatus compareStatus, IList<string> errorMessages = null)
        {
            if (errorMessages == null)
            {
                errorMessages = new List<string>();
            }
            return validate(typeof(T), target, compareStatus, errorMessages);
        }


        public IList<string> validate<TStatus>(Type targetType, object target, TStatus compareStatus, IList<string> errorMessages)
        {
            if (isValidatable(targetType))
            {
                if (target == null)
                {
                    errorMessages.Add($"{formatName(targetType.Name)} cannot be null");
                }
                else
                {
                    foreachValidationPropertiesOf(targetType, (prop, metadata) =>
                    {
                        if (metadata.Required && validateStatus(compareStatus, metadata))
                        {
                            var value = prop.GetValue(target);
                            var isValid = value != null;
                            if (isValid)
                            {
                                var valueType = value.GetType();

                                if (isValidatable(valueType))
                                {
                                    validate(valueType, value, compareStatus, errorMessages);
                                }
                                else if (value is string)
                                {
                                    isValid = validateString(value);
                                }
                                else if (isList(valueType))
                                {
                                    isValid = validateList(value, prop, metadata, errorMessages, compareStatus);
                                }
                            }
                            if (!isValid)
                            {
                                errorMessages.Add(getRequiredMessage(prop, metadata));
                            }
                        }
                    });
                }
            }
            return errorMessages;
        }

        private bool validateStatus<TStatus>(TStatus compareStatus, SharedValidationAttribute metadata)
        {

            if (metadata.ValidateStatus is null)
            {
                return true;
            }
            else if (compareStatus.Equals(default(TStatus)))
            {
                return false;
            }


            var attrStatus = (TStatus)metadata.ValidateStatus;
            var statusType = typeof(TStatus);

            if (statusType.IsEnum || isNumeric(statusType))
            {
                var attrNumb = Convert.ToInt64(attrStatus);
                var compareNum = Convert.ToInt64(compareStatus);
                switch (metadata.ValidateCondition)
                {
                    case ValidateCondition.Equal:
                        return compareNum == attrNumb;
                    case ValidateCondition.Greater:
                        return compareNum > attrNumb;
                    case ValidateCondition.GreaterOrEqual:
                        return compareNum >= attrNumb;
                    case ValidateCondition.Less:
                        return compareNum < attrNumb;
                    case ValidateCondition.LessOrEqual:
                        return compareNum <= attrNumb;
                }
            }

            return compareStatus.Equals(attrStatus);
        }

        private bool validateString(object value)
        {
            return !string.IsNullOrEmpty((string)value);
        }

        private bool validateList<TStatus>(object value, PropertyInfo prop, SharedValidationAttribute metadata, IList<string> errorMessages, TStatus compareStatus)
        {
            IEnumerable<object> list = getList(value);
            if (list.Count() <= 0)
            {
                return false;
            }

            if (metadata.ValidateChildren)
            {
                for (int i = 0; i < list.Count(); i++)
                {
                    var obj = list.ElementAt(i);
                    if (obj == null || (obj is string && !validateString(obj)))
                    {
                        errorMessages.Add(getRequiredMessage(prop, i, metadata));
                    }
                    else
                    {
                        validate(obj.GetType(), obj, compareStatus, errorMessages);
                    }
                }
            }
            return true;
        }


        private string formatName(string name)
        {
            return NAME_FORMAT_PATTERN.Replace(name, " ${0}").Trim();
        }

        private void foreachValidationPropertiesOf(Type targetType, Action<PropertyInfo, SharedValidationAttribute> action)
        {
            foreach (var prop in targetType.GetProperties())
            {
                var metadata = getValidationMetadata(prop);
                if (metadata != null)
                {
                    action(prop, metadata);
                }
            }
        }


        private string getRequiredMessage(PropertyInfo prop, SharedValidationAttribute SharedValidationAttribute)
        {
            return SharedValidationAttribute.Message ?? $"{formatName(prop.Name)} is required.";
        }

        private string getRequiredMessage(PropertyInfo prop, int index, SharedValidationAttribute SharedValidationAttribute)
        {
            return SharedValidationAttribute.Message ?? $"{formatName(prop.Name)}-{index} is required.";
        }

        private string getTypeName(Type propType)
        {
            if (isNumeric(propType))
            {
                return "number";
            }
            else if (propType.Equals(typeof(string)))
            {
                return "string";
            }
            else if (propType.Equals(typeof(IDictionary)))
            {
                return "object";
            }
            else if (typeof(IEnumerable).IsAssignableFrom(propType))
            {
                return "array";
            }
            return "object";
        }

        private IEnumerable<object> getList(object value)
        {
            if (value is IDictionary)
            {
                return  ((IDictionary)value).Values.Cast<object>();
            }
            else
            {
                return ((IEnumerable)value).Cast<object>();
            }
        }

        private SharedValidationAttribute getValidationMetadata(PropertyInfo prop)
        {
            return (SharedValidationAttribute)Attribute.GetCustomAttribute(prop, VALIDATION_TYPE);
        }

        private bool isNumeric(Type type)
        {
            switch (Type.GetTypeCode(type))
            {
                case TypeCode.Byte:
                case TypeCode.SByte:
                case TypeCode.UInt16:
                case TypeCode.UInt32:
                case TypeCode.UInt64:
                case TypeCode.Int16:
                case TypeCode.Int32:
                case TypeCode.Int64:
                case TypeCode.Decimal:
                case TypeCode.Double:
                case TypeCode.Single:
                    return true;
                default:
                    return false;
            }
        }

        private bool isValidatable(Type type)
        {
            return type.IsDefined(VALIDATABLE_TYPE, false);
        }

        private bool isList(Type type)
        {
            return type != typeof(string) &&  typeof(IEnumerable).IsAssignableFrom(type);
        }
    }
}
