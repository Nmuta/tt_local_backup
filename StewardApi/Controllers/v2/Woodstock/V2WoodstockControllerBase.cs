﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Base class for v2 controllers.
    /// </summary>
    public class V2WoodstockControllerBase : ControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="V2WoodstockControllerBase"/> class.
        /// </summary>
        protected V2WoodstockControllerBase()
        {
            this.WoodstockEndpoint = new Lazy<string>(() => this.GetWoodstockEndpoint());

            this.WoodstockServices = new Lazy<WoodstockProxyBundle>(() =>
            {
                var woodstockProxyBundle = this.HttpContext.RequestServices.GetService<WoodstockProxyBundle>();
                woodstockProxyBundle.Endpoint = this.WoodstockEndpoint.Value;
                return woodstockProxyBundle;
            });
        }

        /// <summary>
        ///     Gets the Woodstock proxy service.
        /// </summary>
        protected WoodstockProxyBundle Services
        {
            get { return this.WoodstockServices.Value; }
        }

        /// <summary>Gets (lazily) the Woodstock Endpoint passed to this call.</summary>
        protected Lazy<string> WoodstockEndpoint { get; }

        /// <summary>Gets (lazily) the Woodstock services.</summary>
        private Lazy<WoodstockProxyBundle> WoodstockServices { get; }

        private string GetWoodstockEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Woodstock", out var key))
            {
                key = WoodstockContracts.WoodstockEndpoint.V2Default;
            }

            return WoodstockContracts.WoodstockEndpoint.GetEndpoint(key);
        }
    }
}
