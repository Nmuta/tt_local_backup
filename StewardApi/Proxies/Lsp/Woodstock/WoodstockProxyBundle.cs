﻿using System;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock
{
    public class WoodstockProxyBundle
    {
        private string endpoint;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockProxyBundle"/> class.
        /// </summary>
        public WoodstockProxyBundle(IWoodstockProxyFactory woodstockFactory)
        {
            this.WoodstockFactory = woodstockFactory;
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
                    throw new NotFoundStewardException("Endpoint value could not be found for Woodstock Proxy Factory.");
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
        public IUserInventoryManagementService UserInventoryManagementService => this.WoodstockFactory.PrepareUserInventoryManagementService(this.Endpoint);

        /// <summary>
        ///     Gets live ops service.
        /// </summary>
        public ILiveOpsService LiveOpsService => this.WoodstockFactory.PrepareLiveOpsService(this.Endpoint);

        /// <summary>
        ///     Gets user management service.
        /// </summary>
        public IUserManagementService UserManagementService => this.WoodstockFactory.PrepareUserManagementService(this.Endpoint);

        /// <summary>
        ///     Gets permissions management service.
        /// </summary>
        public IPermissionsManagementService PermissionsManagementService => this.WoodstockFactory.PreparePermissionsManagementService(this.Endpoint);

        /// <summary>
        ///     Gets a <see cref="IStorefrontManagementService" />.
        /// </summary>
        public IStorefrontManagementService StorefrontManagement => this.WoodstockFactory.PrepareStorefrontManagementService(this.Endpoint);

        private IWoodstockProxyFactory WoodstockFactory { get; }
    }
}
