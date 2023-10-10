using System;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class TestProxiesControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public TestProxiesControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
        }

        public async Task TestAllServiceProxies()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestAuctionManagementServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/AuctionManagementService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestGiftingManagementServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/GiftingManagementService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestLiveOpsServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/LiveOpsService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestLocalizationManagementServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/LocalizationManagementService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestUserManagementServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/UserManagementService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestUserInventoryManagementServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/UserInventoryManagementService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestStorefrontManagementServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/StorefrontManagementService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestNotificationManagementServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/NotificationManagementService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task TestPermissionsManagementServiceProxy()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies/PermissionsManagementService");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
