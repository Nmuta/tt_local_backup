using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo;
using ApolloContracts = Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Apollo
{
    /// <summary>
    ///     Base class for v2 controllers.
    /// </summary>
    public class V2ApolloControllerBase : ControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="V2ApolloControllerBase"/> class.
        /// </summary>
        protected V2ApolloControllerBase()
        {
            this.ApolloEndpoint = new Lazy<string>(() => this.GetApolloEndpoint());

            this.ApolloServices = new Lazy<ApolloProxyBundle>(() =>
            {
                var componentContext = this.HttpContext.RequestServices.GetService<IComponentContext>();
                var proxyBundle = componentContext.Resolve<ApolloProxyBundle>();
                proxyBundle.Endpoint = this.ApolloEndpoint.Value;
                return proxyBundle;
            });
        }

        /// <summary>
        ///     Gets the Apollo proxy service.
        /// </summary>
        protected ApolloProxyBundle Services
        {
            get { return this.ApolloServices.Value; }
        }

        /// <summary>Gets (lazily) the Apollo Endpoint passed to this call.</summary>
        protected Lazy<string> ApolloEndpoint { get; }

        /// <summary>Gets (lazily) the Apollo services.</summary>
        private Lazy<ApolloProxyBundle> ApolloServices { get; }

        private string GetApolloEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Apollo", out var key))
            {
                key = ApolloContracts.ApolloEndpoint.V2Default;
            }

            return ApolloContracts.ApolloEndpoint.GetEndpoint(key);
        }
    }
}
