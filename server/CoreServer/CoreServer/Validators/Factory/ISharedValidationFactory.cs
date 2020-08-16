using CoreServer.Validdators.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreServer.Validators.Factory
{
    public interface ISharedValidationFactory
    {
        IList<SharedValidatorDTO> GetValidatorSchemas(params Type[] targetTypes);

        void PopulateValidatorSchema(ICollection<SharedValidatorDTO> validators, Type targetType);
        
        IList<string> Validate<T, TStatus>(T target, TStatus compareStatus, IList<string> errorMessages = null);

    }
}
