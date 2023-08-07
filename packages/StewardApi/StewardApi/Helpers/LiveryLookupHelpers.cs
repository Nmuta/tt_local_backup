using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using static Turn10.Services.LiveOps.FM8.Generated.StorefrontManagementService;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    public static class LiveryLookupHelpers
    {
        public static async Task<IEnumerable<UgcItem>> LookupSteelheadLiveriesAsync(IEnumerable<string> liveryIds, IMapper mapper, IStorefrontManagementService service)
        {
            var lookups = liveryIds.Select(id => LookupSteelheadLiveryAsync(id, mapper, service)).ToList();
            await Task.WhenAll(lookups).ConfigureAwait(false);
            var results = lookups.Select(v => v.GetAwaiter().GetResult());
            return results;
        }

        public static async Task<UgcItem> LookupSteelheadLiveryAsync(string liveryId, IMapper mapper, IStorefrontManagementService service)
        {
            var liveryGuid = liveryId.TryParseGuidElseThrow("Invalid livery id: {liveryId}");

            GetUGCLiveryOutput livery;

            try
            {
                livery = await service.GetUGCLivery(liveryGuid).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get livery. (liveryId: {liveryId})", ex);
            }

            if (livery == null)
            {
                throw new InvalidArgumentsStewardException($"Livery not found: {liveryId}");
            }

            var mappedLivery = mapper.SafeMap<UgcLiveryItem>(livery.result);
            return mappedLivery;
        }
    }
}
