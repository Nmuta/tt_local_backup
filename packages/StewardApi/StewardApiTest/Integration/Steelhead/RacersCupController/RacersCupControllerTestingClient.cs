using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class RacersCupControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public RacersCupControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<RacersCupSchedule> GetRacersCupSchedule()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/racerscup/schedule");

            return await ServiceClient.SendRequestAsync<RacersCupSchedule>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<RacersCupSchedule> GetRacersCupSchedule(Dictionary<string, string> addressVars)
        {
            string pathWithParams = $"{TitlePath}/racerscup/schedule?";
            foreach(var addressVar in addressVars)
            {
                pathWithParams += $"{addressVar.Key}={addressVar.Value}&";
            }
            pathWithParams = pathWithParams.Substring(0, pathWithParams.Length - 1);

            var path = new Uri(this.baseUri, pathWithParams);

            return await ServiceClient.SendRequestAsync<RacersCupSchedule>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<RacersCupSchedule> GetRacersCupSchedule(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/racerscup/player/{xuid}/schedule");

            return await ServiceClient.SendRequestAsync<RacersCupSchedule>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<Guid, string>> GetRacersCupSeries()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/racerscup/series");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
