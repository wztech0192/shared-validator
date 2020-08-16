using CoreServer.Validators.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreServer.Validdators.DTOs
{
    public class SharedValidatorDTO
    {
        public string ValidatorName { get; set; }

        public IDictionary<string, SharedValidationPropertyRuleDTO> PropertyRules { get; set; } = new Dictionary<string, SharedValidationPropertyRuleDTO>();
    }
}
