using System;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;

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
        ///     Gets a <see cref="IAuctionManagementService" />.
        /// </summary>
        public IAuctionManagementService AuctionManagementService => this.SteelheadFactory.PrepareAuctionManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IGiftingManagementService" />.
        /// </summary>
        public IGiftingManagementService GiftingManagementService => this.SteelheadFactory.PrepareGiftingManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="ILiveOpsService" />.
        /// </summary>
        public ILiveOpsService LiveOpsService => this.SteelheadFactory.PrepareLiveOpsService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="ILocalizationManagementService" />.
        /// </summary>
        public ILocalizationManagementService LocalizationManagementService => this.SteelheadFactory.PrepareLocalizationManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IUserManagementService" />.
        /// </summary>
        public IUserManagementService UserManagementService => this.SteelheadFactory.PrepareUserManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IUserInventoryManagementService" />.
        /// </summary>
        public IUserInventoryManagementService UserInventoryManagementService => this.SteelheadFactory.PrepareUserInventoryManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IOldUserInventoryManagementService" />.
        /// </summary>
        public IOldUserInventoryManagementService OldUserInventoryManagementService => this.SteelheadFactory.PrepareOldUserInventoryManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IStorefrontManagementService" />.
        /// </summary>
        public IStorefrontManagementService StorefrontManagementService => this.SteelheadFactory.PrepareStorefrontManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="INotificationManagementService" />.
        /// </summary>
        public INotificationManagementService NotificationManagementService => this.SteelheadFactory.PrepareNotificationManagementService(this.Endpoint);

        private ISteelheadProxyFactory SteelheadFactory { get; }
    }
}
