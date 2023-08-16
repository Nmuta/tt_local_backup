using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Sunrise
{
    /// <summary>Base class for Sunrise V2 controllers.</summary>
    public class V2SunriseControllerBase : V2ControllerBase
    {
        /// <summary>Initializes a new instance of the <see cref="V2SunriseControllerBase"/> class.</summary>
        protected V2SunriseControllerBase()
        {
        }

        /// <summary>Gets the Sunrise proxy service.</summary>
        protected SunriseProxyBundle Services => this.SunriseServices.Value;
    }
}
