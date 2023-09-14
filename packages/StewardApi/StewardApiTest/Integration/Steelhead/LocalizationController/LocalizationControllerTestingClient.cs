using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;
using SteelheadLiveOpsContent;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class LocalizationControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public LocalizationControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedString()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/localization");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<SupportedLocale>> GetSupportedLocales()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/localization/supportedLocales");

            return await ServiceClient.SendRequestAsync<IEnumerable<SupportedLocale>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
