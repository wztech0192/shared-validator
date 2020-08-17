using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreServer.Models;
using CoreServer.Validators.Factory;
using Microsoft.AspNetCore.Mvc;

namespace CoreServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {

        private readonly ISharedValidationFactory _validationFactory;

        public TestController(ISharedValidationFactory validationFactory)
        {
            _validationFactory = validationFactory;
        }

        [HttpGet]
        public ActionResult GetData()
        {
            //the second param typeof(NestedValidateItem) is unnessasary because ValidateItem contains NestedValidateItem validator metadata
            return Ok(_validationFactory.GetValidatorSchemas(typeof(ValidateItem), typeof(NestedValidateItem)));
        }

     

        // POST api/values
        [HttpPost]
        public ActionResult Post([FromBody] ValidateItem item)
        {
            var errors = _validationFactory.Validate(item, item.Status);

            if (errors.Any())
            {
                return BadRequest(errors);
            }

            return Ok();
        }
    }
}
