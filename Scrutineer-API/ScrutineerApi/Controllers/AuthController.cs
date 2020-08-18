using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiScrutineer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ApiScrutineer.Controllers
{
    public class TestReponse {
        public bool result;
    }

    [ApiController]
    [Route("api")]
    [Authorize]
    public class AuthController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        [HttpGet("me")]
        public IActionResult GetUser()
        {
            var userIdentity = this.User;
            var role = "None";
            if (this.User.IsInRole("LiveOpsAdmin"))
            {
                role = "Admin";
            }
            else if (this.User.IsInRole("LiveOpsAgent"))
            {
                role = "Agent";
            }

            var user = new User()
            {
                Email = userIdentity.Identity.Name,
                Role = role,
            };

            return this.Ok(user);
        }
    }
}
