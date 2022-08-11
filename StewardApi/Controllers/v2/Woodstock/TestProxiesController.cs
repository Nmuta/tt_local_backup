using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bond;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.SystemFunctions;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Test controller for testing service proxies.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/test/proxies")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("Woodstock Test")]
    public class TestProxiesController : V2ControllerBase
    {
        /// <summary>
        ///     Verifies all service proxies.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200)]
        public IActionResult TestAllServiceProxies()
        {
            var services = this.WoodstockServices.Value;
            var failedServiceProcies = new StringBuilder();

            Exception exception;
            if (!this.VerifyServiceProxy(() => services.LiveOps, "LiveOps", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.UserInventory, "UserInventory", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.UserManagement, "UserManagement", out exception))
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
        ///     Verifies LiveOps service proxy.
        /// </summary>
        [HttpGet("LiveOps")]
        [SwaggerResponse(200)]
        public IActionResult TestLiveOpsProxy()
        {
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.LiveOps, "LiveOps", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies User Inventory service proxy.
        /// </summary>
        [HttpGet("UserInventory")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestUserInventoryProxy()
        {
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.UserInventory, "UserInventory", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies User Management proxy.
        /// </summary>
        [HttpGet("UserManagement")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestUserManagementProxy()
        {
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.UserManagement, "UserManagement", out var exception))
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
