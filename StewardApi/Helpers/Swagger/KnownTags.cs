using System.Collections.Generic;
using System.Globalization;
using System.Linq;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member: It's a constants file
#pragma warning disable SA1600 // Elements should be documented: It's a constants file
#pragma warning disable CA1034 // Nested types should not be visible: It's a constants file
namespace Turn10.LiveOps.StewardApi.Helpers.Swagger
{
    /// <summary>
    ///     Known tags for use with WebAPI [Tag(...)] attribute.
    ///     Influence sorting.
    /// </summary>
    public static class KnownTags
    {
        private const string DangerousPrefix = "Dangerous: ";

        /// <summary>Returns true if the given tag is "Dangerous".</summary>
        public static bool IsDangerous(string tag)
        {
            return tag.StartsWith(DangerousPrefix, true, CultureInfo.InvariantCulture);
        }

        /// <summary>Converts the given tag to its "Dangerous" form.</summary>
        public static string MakeDangerous(string tag)
        {
            return $"{DangerousPrefix}{tag}";
        }

        /// <summary>Converts the given tags to their "Dangerous" form.</summary>
        public static IEnumerable<string> MakeDangerous(IEnumerable<string> tags)
        {
            return tags.Select(MakeDangerous);
        }

        /// <summary>Adds the All tag to the API.</summary>
        public static IEnumerable<string> WithAll(IEnumerable<string> tags)
        {
            return tags.Concat(new[] { Meta.All });
        }

        /// <summary>
        ///     Utility tags not for development.
        /// </summary>
        public static class Meta
        {
            /// <summary>A meta-tag to enable ctrl+f on APIs.</summary>
            public const string All = "All";

            /// <summary>A meta-tag to enable ctrl+f on Dangerous APIs.</summary>
            public static readonly string DangerousAll = MakeDangerous(All);
        }

        /// <summary>
        ///     Utility tags for development purposes. Controls sorting.
        /// </summary>
        public static class Dev
        {
            /// <summary>Use to bring in-development APIs to the top of the docs list. Do not commit.</summary>
            public const string InDev = "Dev: InDev";

            /// <summary>Use to send incomplete-but-merged APIs to the top of the docs.</summary>
            public const string Incomplete = "Dev: Incomplete";

            /// <summary>Use to tag items as needing their tags revised.</summary>
            public const string ReviseTags = "Dev: Revise Tags";

            /// <summary>Use to tag items as only for steelhead test.</summary>
            public const string SteelheadTest = "Dev: Steelhead Test";

            /// <summary>Use to tag items as only for woodstock test.</summary>
            public const string WoodstockTest = "Dev: Woodstock Test";

            /// <summary>Use to tag items as only for sunrise test.</summary>
            public const string SunriseTest = "Dev: Sunrise Test";

            /// <summary>Use to tag items as only for apollo test.</summary>
            public const string ApolloTest = "Dev: Apollo Test";
        }

        /// <summary>
        ///     Identifies the titles an endpoint targets.
        /// </summary>
        public static class Title
        {
            /// <summary>Use for services that call multiple upstream LSPs.</summary>
            public const string Multiple = "Title: Multiple";

            /// <summary>Use for services that do not call LSP, or do not care which LSP/title they call.</summary>
            public const string Agnostic = "Title: Agnostic";

            public const string Steelhead = "Title: Steelhead";
            public const string Woodstock = "Title: Woodstock";
            public const string Sunrise = "Title: Sunrise";
            public const string Apollo = "Title: Apollo";
        }

        /// <summary>
        ///     Primary resource ID-type associated with the request, to identify the primary target of the operation.
        /// </summary>
        public static class Target
        {
            /// <summary>For endpoints which perform operations on LSP Groups.</summary>
            public const string LspGroup = "Target: LSP Group";

            /// <summary>For endpoints which perform operations on a single player.</summary>
            public const string Player = "Target: Player";

            /// <summary>For endpoints which perform operations on multiple players.</summary>
            public const string Players = "Target: Players";

            /// <summary>For endpoints which perform operations on non-player, non-lsp-group IDs; or which perform queries on such resources.</summary>
            public const string Details = "Target: Details";

            /// <summary>For endpoints which perform operations on the LSP.</summary>
            public const string Lsp = "Target: LSP";
        }

        /// <summary>
        ///     The type of resource the endpoint works with.
        /// </summary>
        public static class Topic
        {
            public const string Ugc = "Topic: UGC";
            public const string Auctions = "Topic: Auctions";
            public const string Gifting = "Topic: Gifting";
            public const string Messaging = "Topic: Messaging";
            public const string Banning = "Topic: Banning";
            public const string BanHistory = "Topic: Ban History";
            public const string Consoles = "Topic: Consoles";
            public const string LspGroups = "Topic: LSP Groups";
            public const string Inventory = "Topic: Inventory";
            public const string Localization = "Topic: Localization";
            public const string Flags = "Topic: Flags";
            public const string Leaderboards = "Topic: Leaderboards";
            public const string LoyaltyRewards = "Topic: Loyalty Rewards";
            public const string Profile = "Topic: Profile";
            public const string ProfileNotes = "Topic: Profile Notes";
            public const string ReportWeight = "Topic: Report Weight";
            public const string ProfileTemplates = "Topic: Profile Templates";
            public const string Calendar = "Topic: Calendar";
            public const string RacersCup = "Topic: Racers Cup";
            public const string BuildersCup = "Topic: Builders Cup";
            public const string WelcomeCenter = "Topic: Welcome Center";
            public const string CmsOverride = "Topic: Cms Override";
            public const string Permissions = "Topic: Permissions";
            public const string StewardPermissions = "Topic: Steward Permissions";
            public const string Pegasus = "Topic: Pegasus";
            public const string Git = "Topic: Git";
            public const string StewardUsers = "Topic: Steward Users";
        }

        /// <summary>
        ///     Do not use as a tag. Used for indicating where all unknown tags should be sorted.
        /// </summary>
        public static class Sentinel
        {
            public const string UnknownAlphabetic = "Sentinel_Unknown_Alphabetic";
            public const string Dangerous = "Sentinel_Dangerous";
            public const string NonDangerousAlphabetic = "Sentinel_Unknown_NonDangerous_Alphabetic";

            public static ISet<string> Values { get; } = new HashSet<string>
            {
                UnknownAlphabetic,
                Dangerous,
                NonDangerousAlphabetic,
            };
        }
    }
}
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
#pragma warning restore SA1600 // Elements should be documented
#pragma warning restore CA1034 // Nested types should not be visible
