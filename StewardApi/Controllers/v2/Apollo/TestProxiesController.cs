using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bond;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.SystemFunctions;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Apollo
{
    /// <summary>
    ///     Test controller for testing service proxies.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/apollo/test/proxies")]
    [LogTagTitle(TitleLogTags.Apollo)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Dev.ApolloTest)]
    public class TestProxiesController : V2ControllerBase
    {
        /// <summary>
        ///     Verifies all service proxies.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200)]
        public IActionResult TestAllServiceProxies()
        {
            var services = this.ApolloServices.Value;
            var failedServiceProcies = new StringBuilder();

            Exception exception;
            if (!this.VerifyServiceProxy(() => services.UserService, "UserService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.UserManagementService, "UserManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (failedServiceProcies.Length > 0)
            {
                throw new ServiceProxyStewardException(failedServiceProcies.ToString());
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies UserService service proxy.
        /// </summary>
        [HttpGet("UserService")]
        [SwaggerResponse(200)]
        public IActionResult TestUserProxy()
        {
            var services = this.ApolloServices.Value;

            if (!this.VerifyServiceProxy(() => services.UserService, "UserService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies User Management Service proxy.
        /// </summary>
        [HttpGet("UserManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestUserManagementProxy()
        {
            var services = this.ApolloServices.Value;

            if (!this.VerifyServiceProxy(() => services.UserManagementService, "UserManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        private bool VerifyServiceProxy<T>(Func<T> serviceProxyToTest, string serviceName, out Exception exception)
        {
            try
            {
                serviceProxyToTest();
                exception = null;

                return true;
            }
            catch (Exception ex)
            {
                exception = new ServiceProxyStewardException($"Failed to generate {serviceName} proxy", ex);
                return false;
            }
        }
    }
}
