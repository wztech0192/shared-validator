﻿using CoreServer.Validators.Attributes;
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

        public string String { get; set; }

        [SharedValidation]

        public DateTime? Date { get; set; }
    }
}
