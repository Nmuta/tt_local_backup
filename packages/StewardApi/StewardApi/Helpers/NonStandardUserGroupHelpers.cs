using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///    Helper for tracking non standard user ground between titles and environmnets.
    /// </summary>
    public static class NonStandardUserGroupHelpers
    {
        private static Dictionary<string, NonStandardUserGroups> UserGroupIds => new Dictionary<string, NonStandardUserGroups>()
        {
            {
                SteelheadEndpoint.Retail, new NonStandardUserGroups()
                {
                    ContentCreatorId = 24,
                }
            },
            {
                SteelheadEndpoint.Flight, new NonStandardUserGroups()
                {
                    ContentCreatorId = 24,
                }
            },
            {
                SteelheadEndpoint.Studio, new NonStandardUserGroups()
                {
                    ContentCreatorId = 24,
                }
            },
            {
                WoodstockEndpoint.Retail, new NonStandardUserGroups()
                {
                    ContentCreatorId = 24,
                }
            },
            {
                WoodstockEndpoint.Studio, new NonStandardUserGroups()
                {
                    ContentCreatorId = 24,
                }
            },
        };

        /// <summary>
        ///     Gets non-standard user group ids from endpoint.
        /// </summary>
        public static NonStandardUserGroups GetUserGroups(string endpoint)
        {
            if (!UserGroupIds.TryGetValue(endpoint, out var nonStandardUserGroups))
            {
                throw new NotFoundStewardException($"Failed to get non-standard user group ids from provided endpoint. (endoint: {endpoint})");
            }

            return nonStandardUserGroups;
        }
    }
}
