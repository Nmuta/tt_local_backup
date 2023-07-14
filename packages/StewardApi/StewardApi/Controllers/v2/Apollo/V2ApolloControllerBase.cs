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
    /// <summary>Base class for Apollo V2 controllers.</summary>
    public class V2ApolloControllerBase : V2ControllerBase
    {
        /// <summary>Gets the Apollo proxy service.</summary>
        protected ApolloProxyBundle Services => this.ApolloServices.Value;
    }
}
