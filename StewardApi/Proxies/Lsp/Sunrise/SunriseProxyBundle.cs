using System;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise.Services;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise
{
    public class SunriseProxyBundle
    {
        private string endpoint;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseProxyBundle"/> class.
        /// </summary>
        public SunriseProxyBundle(ISunriseProxyFactory sunriseFactory)
        {
            this.SunriseFactory = sunriseFactory;
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
                    throw new NotFoundStewardException("Endpoint value could not be found for Sunrise Proxy Factory.");
                }

                return this.endpoint;
            }

            set
            {
                this.endpoint = value;
            }
        }

        /// <summary>
        ///     Gets live ops service.
        /// </summary>
        public IUserService UserService => this.SunriseFactory.PrepareUserService(this.Endpoint);

        /// <summary>
        ///     Gets user management service.
        /// </summary>
        public IUserManagementService UserManagementService => this.SunriseFactory.PrepareUserManagementService(this.Endpoint);

        private ISunriseProxyFactory SunriseFactory { get; }
    }
}
