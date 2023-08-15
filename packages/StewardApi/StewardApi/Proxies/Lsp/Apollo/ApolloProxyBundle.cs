using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo.Services;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo
{
    public class ApolloProxyBundle
    {
        private string endpoint;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloProxyBundle"/> class.
        /// </summary>
        public ApolloProxyBundle(IApolloProxyFactory apolloFactory)
        {
            this.ApolloFactory = apolloFactory;
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
                    throw new NotFoundStewardException("Endpoint value could not be found for Apollo Proxy Factory.");
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
        public IUserService UserService => this.ApolloFactory.PrepareUserService(this.Endpoint);

        /// <summary>
        ///     Gets user management service.
        /// </summary>
        public IUserManagementService UserManagementService => this.ApolloFactory.PrepareUserManagementService(this.Endpoint);

        private IApolloProxyFactory ApolloFactory { get; }
    }
}
