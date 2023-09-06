using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using SteelheadLiveOpsContent;
using StewardGitApi;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;
using PullRequest = Turn10.LiveOps.StewardApi.Contracts.Git.PullRequest;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead Pegasus.
    /// </summary>
    public interface ISteelheadPegasusService
    {
        /// <summary>
        ///     Retrieves a collection of supported locales.
        /// </summary>
        Task<IEnumerable<SupportedLocale>> GetSupportedLocalesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Retrieve localized strings from Pegasus.
        /// </summary>
        /// <remarks>Utilizes a supported subset of BCP 47 Language Codes.</remarks>
        Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStringsAsync(
            bool useInternalIds = true,
            string environment = null,
            string slot = null,
            string snapshot = null);

        /// <summary>
        ///     Gets car classes.
        /// </summary>
        Task<IEnumerable<CarClass>> GetCarClassesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Ugc reporting reasons.
        /// </summary>
        Task<Dictionary<Guid, UGCReportingCategory>> GetUgcReportingReasonsAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets cars.
        /// </summary>
        Task<IEnumerable<DataCar>> GetCarsAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets car makes.
        /// </summary>
        /// <remarks>Only exists in LiveOps version of the nuget. Steelhead needs an exact copy of this.</remarks>
        Task<Dictionary<Guid, string>> GetCarMakesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets vanity items.
        /// </summary>
        Task<IEnumerable<VanityItem>> GetVanityItemsAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets safety rating configuration.
        /// </summary>
        Task<SafetyRatingConfiguration> GetSafetyRatingConfig(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets tracks.
        /// </summary>
        Task<IEnumerable<Track>> GetTracksAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets playlist data for Racer's Cup.
        /// </summary>
        Task<Dictionary<Guid, ChampionshipPlaylistDataV3>> GetRacersCupPlaylistDataV3Async(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets championship data for Racer's Cup.
        /// </summary>
        Task<RacersCupChampionships> GetRacersCupChampionshipScheduleV4Async(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets data for Builder's Cup's dynamic content.
        /// </summary>
        Task<BuildersCupCupDataV3> GetBuildersCupFeaturedCupLadderAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets welcome center columns.
        /// </summary>
        Task<WorldOfForzaConfigV3> GetWelcomeCenterDataAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets welcome center tile details.
        /// </summary>
        Task<WorldOfForzaTileCMSCollection> GetWelcomeCenterTileDataAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets leaderboards.
        /// </summary>
        Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Creates pull request.
        /// </summary>
        Task<PullRequest> CreatePullRequestAsync(GitPush pushed, string pullRequestTitle, string pullRequestDescription);

        /// <summary>
        ///     Commits and push changes.
        /// </summary>
        Task<GitPush> CommitAndPushAsync(CommitRefProxy[] changes);

        /// <summary>
        ///     Edits and saves Message of the Day
        ///     using deserialized xml entry.
        /// </summary>
        Task<CommitRefProxy> EditMessageOfTheDayAsync(MotdBridge messageOfTheDayBridge, Guid id);

        /// <summary>
        ///     Gets current Message of the Day values for the entry
        ///     with matching id.
        /// </summary>
        Task<MotdBridge> GetMessageOfTheDayCurrentValuesAsync(Guid id);

        /// <summary>
        ///     Gets Message of the Day selection options.
        /// </summary>
        Task<Dictionary<Guid, string>> GetMessageOfTheDaySelectionsAsync();

        /// <summary>
        ///     Gets a Message of the Day entry as an Xelement.
        /// </summary>
        Task<XElement> GetMessageOfTheDayElementAsync(Guid id);

        /// <summary>
        ///     Edits and saves World of Forza Image Text Tile
        ///     using deserialized xml entry.
        /// </summary>
        Task<CommitRefProxy> EditWorldOfForzaImageTextTileAsync(WofImageTextBridge wofTileBridge, Guid id);

        /// <summary>
        ///     Edits and saves World of Forza Generic Popup Tile
        ///     using deserialized xml entry.
        /// </summary>
        Task<CommitRefProxy> EditWorldOfForzaGenericPopupTileAsync(WofGenericPopupBridge wofTileBridge, Guid id);

        /// <summary>
        ///     Edits and saves World of Forza Deeplink Tile
        ///     using deserialized xml entry.
        /// </summary>
        Task<CommitRefProxy> EditWorldOfForzaDeeplinkTileAsync(WofDeeplinkBridge wofTileBridge, Guid id);

        /// <summary>
        ///     Gets current World of Forza Image Text Tile values for the entry
        ///     with matching id.
        /// </summary>
        Task<WofImageTextBridge> GetWorldOfForzaImageTextTileAsync(Guid id);

        /// <summary>
        ///     Gets current World of Forza Generic Popup Tile values for the entry
        ///     with matching id.
        /// </summary>
        Task<WofGenericPopupBridge> GetWorldOfForzaGenericPopupTileAsync(Guid id);

        /// <summary>
        ///     Gets current World of Forza Deeplink Tile values for the entry
        ///     with matching id.
        /// </summary>
        Task<WofDeeplinkBridge> GetWorldOfForzaDeeplinkTileAsync(Guid id);

        /// <summary>
        ///     Gets World of Forza Image Text tile selection options.
        /// </summary>
        Task<Dictionary<Guid, string>> GetWorldOfForzaImageTextTileSelectionsAsync();

        /// <summary>
        ///     Gets World of Forza Generic Popup tile selection options.
        /// </summary>
        Task<Dictionary<Guid, string>> GetWorldOfForzaGenericPopupSelectionsAsync();

        /// <summary>
        ///     Gets World of Forza Deeplink tile selection options.
        /// </summary>
        Task<Dictionary<Guid, string>> GetWorldOfForzaDeeplinkSelectionsAsync();

        /// <summary>
        ///     Gets a World of Forza Image Text entry as an Xelement.
        /// </summary>
        Task<XElement> GetWorldOfForzaImageTextTileElementAsync(Guid id);

        /// <summary>
        ///     Gets a World of Forza Generic Popup entry as an Xelement.
        /// </summary>
        Task<XElement> GetWorldOfForzaGenericPopupTileElementAsync(Guid id);

        /// <summary>
        ///     Gets a World of Forza Deeplink entry as an Xelement.
        /// </summary>
        Task<XElement> GetWorldOfForzaDeeplinkTileElementAsync(Guid id);

        /// <summary>
        ///     Gets pull pull requests from the steward user.
        /// </summary>
        Task<IEnumerable<PullRequest>> GetPullRequestsAsync(PullRequestStatus status, string subject);

        /// <summary>
        /// Abandons the pull request.
        /// </summary>
        Task<GitPullRequest> AbandonPullRequestAsync(int pullRequestId, bool deleteSourceBranch);

        /// <summary>
        ///     Gets all branches.
        /// </summary>
        Task<IEnumerable<GitRef>> GetAllBranchesAsync();

        /// <summary>
        ///     Runs the specified build pipeline.
        /// </summary>
        public Task<Build> RunFormatPipelineAsync(GitPush push);

        /// <summary>
        ///     Writes localized strings to Pegasus.
        /// </summary>
        public Task<CommitRefProxy> WriteLocalizedStringToPegasusAsync(LocalizedStringBridge localizedString);

        /// <summary>
        ///     Gets localization categories available in repository.
        /// </summary>
        public Task<IEnumerable<string>> GetLocalizationCategoriesFromRepoAsync();

        /// <summary>
        ///     Gets display conditions.
        /// </summary>
        Task<Dictionary<Guid, DisplayCondition>> GetDisplayConditionsAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Car Featured Showcases.
        /// </summary>
        Task<IEnumerable<LiveOpsContracts.CarFeaturedShowcase>> GetCarFeaturedShowcasesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Division Featured Showcases.
        /// </summary>
        Task<IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase>> GetDivisionFeaturedShowcasesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Manufacturer Featured Showcases.
        /// </summary>
        Task<IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase>> GetManufacturerFeaturedShowcasesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Car Sales.
        /// </summary>
        Task<IEnumerable<CarSale>> GetCarSalesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Rivals Events.
        /// </summary>
        Task<IEnumerable<LiveOpsContracts.RivalsEvent>> GetRivalsEventsAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Rivals Events Reference.
        /// </summary>
        Task<Dictionary<Guid, string>> GetRivalsEventsReferenceAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Cars Reference.
        /// </summary>
        Task<Dictionary<Guid, string>> GetCarsReferenceAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Rivals Categories.
        /// </summary>
        Task<Dictionary<Guid, string>> GetRivalsEventCategoriesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Store Entitlements.
        /// </summary>
        Task<Dictionary<Guid, string>> GetStoreEntitlementsAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Racers Cup Series.
        /// </summary>
        Task<Dictionary<Guid, string>> GetRacersCupSeriesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Builders Cup Championship.
        /// </summary>
        Task<Dictionary<Guid, string>> GetBuildersCupChampionshipsAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Builders Cup Ladder.
        /// </summary>
        Task<Dictionary<Guid, string>> GetBuildersCupLaddersAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets Builders Cup Series.
        /// </summary>
        Task<Dictionary<Guid, string>> GetBuildersCupSeriesAsync(string environment = null, string slot = null, string snapshot = null);

        /// <summary>
        ///     Gets ban configurations.
        /// </summary>
        Task<Dictionary<Guid, SteelheadLiveOpsContent.BanConfiguration>> GetBanConfigurationsAsync(string environment = null, string slot = null, string snapshot = null);
    }
}
