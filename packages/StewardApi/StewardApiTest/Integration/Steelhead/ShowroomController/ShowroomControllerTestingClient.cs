using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ShowroomControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ShowroomControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IEnumerable<CarFeaturedShowcase>> GetFeaturedCarShowcase()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/car-featured");

            return await ServiceClient.SendRequestAsync<IEnumerable<CarFeaturedShowcase>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<CarFeaturedShowcase>> GetFeaturedCarShowcase(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/player/{xuid}/carFeatured");

            return await ServiceClient.SendRequestAsync<IEnumerable<CarFeaturedShowcase>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<DivisionFeaturedShowcase>> GetFeaturedDivision()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/divisionFeatured");

            return await ServiceClient.SendRequestAsync<IEnumerable<DivisionFeaturedShowcase>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<DivisionFeaturedShowcase>> GetFeaturedDivision(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/player/{xuid}/divisionFeatured");

            return await ServiceClient.SendRequestAsync<IEnumerable<DivisionFeaturedShowcase>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<ManufacturerFeaturedShowcase>> GetFeaturedManufacturer()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/manufacturerFeatured");

            return await ServiceClient.SendRequestAsync<IEnumerable<ManufacturerFeaturedShowcase>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<ManufacturerFeaturedShowcase>> GetFeaturedManufacturer(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/player/{xuid}/manufacturerFeatured");

            return await ServiceClient.SendRequestAsync<IEnumerable<ManufacturerFeaturedShowcase>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<CarSale>> GetCarSales()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/carSales");

            return await ServiceClient.SendRequestAsync<IEnumerable<CarSale>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<CarSale>> GetCarSales(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/player/{xuid}/carSales");

            return await ServiceClient.SendRequestAsync<IEnumerable<CarSale>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<Guid, string>> GetFeaturedShowcases()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/showroom/featuredShowcases");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
