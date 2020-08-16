using CoreServer.Validators.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreServer.Validators.DTOs
{
    public class SharedValidationPropertyRuleDTO
    {

        public SharedValidationPropertyRuleDTO()
        {

        }

        public SharedValidationPropertyRuleDTO(SharedValidationAttribute validationAttr, string messageName, string propType)
        {
            ValidateStatus = validationAttr.ValidateStatus;
            ValidateCondition = validationAttr.ValidateCondition;
            Required = validationAttr.Required;
            Message = validationAttr.Message;
            MessageName = messageName;
            PropertyType = propType.ToLower();
        }

        public string UseValidator { get; set; }

        public ValidateCondition ValidateCondition { get; set; }

        public object ValidateStatus { get; set; }

        public bool Required { get; set; } = true;

        public string Message { get; set; }

        public string MessageName { get; set; }

        public string PropertyType { get; set; }
    }
}
