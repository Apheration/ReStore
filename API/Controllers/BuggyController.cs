using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("not-found")] // ("") - route
        public ActionResult GetNotFound() { return NotFound(); }

        [HttpGet("bad-Request")]
        public ActionResult GetBadRequest() { return BadRequest(new ProblemDetails { Title = "This is a bad requeset"}); }

        [HttpGet("unauthorized")]
        public ActionResult GetUnAuthorized() { return Unauthorized(); }

        [HttpGet("validation-error")]
        public ActionResult GetValidationError() 
        {
            //ModelState represents errors from USER INPUT: model binding and model validation
            //ex: integer typed into string field, where data doesn't conform to business rules
            //happens before execution of controller
            //need to also use ModelState.IsValid except when [ApiController] being used
            // using [ApiController] automatically returns 400 response containing error
            ModelState.AddModelError("Problem1", "This is the first error");
            ModelState.AddModelError("Problem2", "This is the second error");
            return ValidationProblem();
                
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError() { throw new Exception("This is a server error"); }
    }
}


