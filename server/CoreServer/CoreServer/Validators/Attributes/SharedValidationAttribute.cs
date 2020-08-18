using System;

namespace CoreServer.Validators.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]

    public class SharedValidationAttribute: Attribute
    {

        public SharedValidationAttribute(object validateStatus = null, ValidateCondition validateCondition = ValidateCondition.Equal)
        {
            ValidateStatus = validateStatus;
            ValidateCondition = validateCondition;
        }

        public virtual ValidateCondition ValidateCondition { get; set; } 

        public virtual object ValidateStatus { get; set; }

        public virtual bool Required { get; set; } = true;

        public virtual string Message { get; set; }
        public virtual bool ValidateChildren { get; set; } = true;
    }

    public enum ValidateCondition
    {
        Equal = 1,
        Greater = 2,
        Less = 3,
        GreaterOrEqual = 4,
        LessOrEqual = 5
    }
}
