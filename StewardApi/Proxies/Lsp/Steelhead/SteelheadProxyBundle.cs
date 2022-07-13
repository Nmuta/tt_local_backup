using System;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead
{
    public class SteelheadProxyBundle
    {
        private string endpoint;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadProxyBundle"/> class.
        /// </summary>
        public SteelheadProxyBundle(ISteelheadProxyFactory steelheadFactory)
        {
            this.SteelheadFactory = steelheadFactory;
        }

        /// <summary>
        ///     Gets or sets the Endpoint.
        /// </summary>
        public string Endpoint
        {
            get
            {
                if (string.IsNullOrEmpty(this.endpoint))
                {
                    throw new NotFoundStewardException("Endpoint value could not be found for Steelhead Proxy Factory.");
                }

                return this.endpoint;
            }

            set
            {
                this.endpoint = value;
            }
        }

        /// <summary>
        ///     Gets user inventory service.
        /// </summary>
        public IUserInventoryService UserInventory => this.SteelheadFactory.PrepareUserInventoryService(this.Endpoint);

        private ISteelheadProxyFactory SteelheadFactory { get; }
    }
}
