﻿using System;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

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
    [StandardTags(Dev.WoodstockTest)]
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
            if (!this.VerifyServiceProxy(() => services.AuctionManagementService, "AuctionManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.ConfigurationManagementService, "ConfigurationManagementService", out exception))
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

            if (!this.VerifyServiceProxy(() => services.NotificationsManagementService, "NotificationsManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.PermissionsManagementService, "PermissionsManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.RareCarShopService, "RareCarShopService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.StorefrontManagementService, "StorefrontManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.UserInventoryManagementService, "UserInventoryManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.UserManagementService, "UserManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.PermissionsManagementService, "PermissionsManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.StorefrontManagementService, "StorefrontManagementService", out exception))
            {
                failedServiceProcies.Append($"{exception.Message}, ");
            }

            if (!this.VerifyServiceProxy(() => services.ScoreboardManagementService, "ScoreboardManagementService", out exception))
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
        [HttpGet("LiveOpsService")]
        [SwaggerResponse(200)]
        public IActionResult TestLiveOpsProxy()
        {
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.LiveOpsService, "LiveOpsService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies User Inventory Management Service proxy.
        /// </summary>
        [HttpGet("UserInventoryManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestUserInventoryProxy()
        {
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.UserInventoryManagementService, "UserInventoryManagementService", out var exception))
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
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.UserManagementService, "UserManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies Permissions Management Service proxy.
        /// </summary>
        [HttpGet("PermissionsManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult TestPermissionsManagementServiceProxy()
        {
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.PermissionsManagementService, "PermissionsManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies Permissions Management Service proxy.
        /// </summary>
        [HttpGet("StorefrontManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult StorefrontManagementProxy()
        {
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.StorefrontManagementService, "StorefrontManagementService", out var exception))
            {
                throw exception;
            }

            return this.Ok();
        }

        /// <summary>
        ///     Verifies Scoreboard Management Service proxy.
        /// </summary>
        [HttpGet("ScoreboardManagementService")]
        [SwaggerResponse(200, type: typeof(bool))]
        public IActionResult ScoreboardManagementServiceProxy()
        {
            var services = this.WoodstockServices.Value;

            if (!this.VerifyServiceProxy(() => services.ScoreboardManagementService, "ScoreboardManagementService", out var exception))
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
