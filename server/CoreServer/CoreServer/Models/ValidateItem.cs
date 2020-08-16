using CoreServer.Enums;
using CoreServer.Validators.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreServer.Models
{
    [SharedValidatable]
    public class ValidateItem
    {
        public string String { get; set; }

        [SharedValidation]
        public string ValidateString { get; set; }

        public DateTime? Date { get; set; }

        [SharedValidation]

        public DateTime? ValidateDate { get; set; }


        public IEnumerable<string> ListOfString { get; set; }

        [SharedValidation(Status.Approved, ValidateCondition.GreaterOrEqual)]

        public IEnumerable<string> ListOfValidateString { get; set; }


        public IEnumerable<NestedItem> ListOfItems { get; set; } = new List<NestedItem>();

        [SharedValidation(Status.Approved)]

        public IEnumerable<NestedValidateItem> ListOfValidatableItems { get; set; } = new List<NestedValidateItem>();

        public Status Status { get; set; } = Status.Draft;
    }
}
