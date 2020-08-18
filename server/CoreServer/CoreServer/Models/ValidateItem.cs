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

        public ValidateItem() { }

        [SharedValidation]
        public string String { get; set; }


        [SharedValidation]

        public DateTime? Date { get; set; }


        [SharedValidation]

        public NestedValidateItem NestedValidateItem { get; set; }


        [SharedValidation(Status.Completed, ValidateCondition.Equal)]

        public IEnumerable<string> ListOfString { get; set; }


        public IEnumerable<NestedItem> ListOfItems { get; set; } = new List<NestedItem>();


        [SharedValidation(Status.Approved, ValidateCondition.GreaterOrEqual)]

        public IEnumerable<NestedValidateItem> ListOfValidatableItems { get; set; } = new List<NestedValidateItem>();

        public Status Status { get; set; } = Status.Draft;
    }
}
