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
using Turn10.LiveOps.StewardApi.Controllers.v2.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Steelhead
{
    /// <summary>
    ///     Test controller for testing service proxies.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/test/proxies")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("Steelhead Test")]
    public class TestProxiesController : V2ControllerBase
    {
        /// <summary>
        ///     Verifies all service proxies.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200)]
        public IActionResult TestAllServiceProxies()
        {
            var services = this.SteelheadServices.Value;
            var failedServiceProcies = new StringBuilder();

            Exception exception;
            if (!this.VerifyServiceProxy(() => services.AuctionManagementService, "AuctionManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.GiftingManagementService, "GiftingManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.LiveOpsService, "LiveOpsService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.LocalizationManagementService, "LocalizationManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.UserManagementService, "UserManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.UserInventoryManagementService, "UserInventoryManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.StorefrontManagementService, "StorefrontManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.NotificationManagementService, "NotificationManagementService", out exception))
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
        ///     Verifies auction management service proxy.
        /// </summary>
        [HttpGet("AuctionManagementService")]
        [SwaggerResponse(200)]
        public IActionResult TestAuctionManagementServiceProxy()
        {
            var services = this.SteelheadServices.Value;

            if (!this.VerifyServiceProxy(() => services.AuctionManagementService, "AuctionManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies gifting management service proxy.
        /// </summary>
        [HttpGet("GiftingManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestGiftingManagementServiceProxy()
        {
            var services = this.SteelheadServices.Value;

            if (!this.VerifyServiceProxy(() => services.GiftingManagementService, "GiftingManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies live ops service proxy.
        /// </summary>
        [HttpGet("LiveOpsService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestLiveOpsServiceProxy()
        {
            var services = this.SteelheadServices.Value;

            if (!this.VerifyServiceProxy(() => services.LiveOpsService, "LiveOpsService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies localization management service proxy.
        /// </summary>
        [HttpGet("LocalizationManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestLocalizationManagementServiceProxy()
        {
            var services = this.SteelheadServices.Value;

            if (!this.VerifyServiceProxy(() => services.LocalizationManagementService, "LocalizationManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies user management service proxy.
        /// </summary>
        [HttpGet("UserManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestUserManagementServiceProxy()
        {
            var services = this.SteelheadServices.Value;

            if (!this.VerifyServiceProxy(() => services.UserManagementService, "UserManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies user inventory management service proxy.
        /// </summary>
        [HttpGet("UserInventoryManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestUserInventoryManagementServiceProxy()
        {
            var services = this.SteelheadServices.Value;

            if (!this.VerifyServiceProxy(() => services.UserInventoryManagementService, "UserInventoryManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies storefront management service proxy.
        /// </summary>
        [HttpGet("StorefrontManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestStorefrontManagementServiceProxy()
        {
            var services = this.SteelheadServices.Value;

            if (!this.VerifyServiceProxy(() => services.StorefrontManagementService, "StorefrontManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies notification management service proxy.
        /// </summary>
        [HttpGet("NotificationManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestNotificationManagementServiceProxy()
        {
            var services = this.SteelheadServices.Value;

            if (!this.VerifyServiceProxy(() => services.NotificationManagementService, "NotificationManagementService", out var exception))
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
