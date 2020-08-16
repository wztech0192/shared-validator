using CoreServer.Validators.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreServer.Models
{
    [SharedValidatable]
    public class NestedValidateItem
    {
        [SharedValidation]

        public string ValidateString { get; set; }

        [SharedValidation]

        public DateTime? ValidateDate { get; set; }
    }
}
