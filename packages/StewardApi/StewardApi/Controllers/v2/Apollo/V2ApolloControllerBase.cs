using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Apollo
{
    /// <summary>Base class for Apollo V2 controllers.</summary>
    public class V2ApolloControllerBase : V2ControllerBase
    {
        /// <summary>Gets the Apollo proxy service.</summary>
        protected ApolloProxyBundle Services => this.ApolloServices.Value;
    }
}
