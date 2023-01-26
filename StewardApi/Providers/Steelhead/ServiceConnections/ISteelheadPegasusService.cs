﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using SteelheadLiveOpsContent;
using StewardGitApi;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;

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
        Task<IEnumerable<SupportedLocale>> GetSupportedLocalesAsync();

        /// <summary>
        ///     Retrieve localized strings from Pegasus.
        /// </summary>
        /// <remarks>Utilizes a supported subset of BCP 47 Language Codes.</remarks>
        Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStringsAsync(bool useInternalIds = true);

        /// <summary>
        ///     Gets car classes.
        /// </summary>
        Task<IEnumerable<CarClass>> GetCarClassesAsync(string pegasusEnvironment, string slotId = SteelheadPegasusSlot.Daily);

        /// <summary>
        ///     Gets cars.
        /// </summary>
        Task<IEnumerable<SteelheadLiveOpsContent.DataCar>> GetCarsAsync(string slotId = SteelheadPegasusSlot.Daily);

        /// <summary>
        ///     Gets car makes.
        /// </summary>
        /// <remarks>Only exists in LiveOps version of the nuget. Steelhead needs an exact copy of this.</remarks>
        Task<IEnumerable<SteelheadLiveOpsContent.ListCarMake>> GetCarMakesAsync();

        /// <summary>
        ///     Gets vanity items.
        /// </summary>
        Task<IEnumerable<SteelheadLiveOpsContent.VanityItem>> GetVanityItemsAsync(string slotId = SteelheadPegasusSlot.Daily);

        /// <summary>
        ///     Gets playlist data for Racer's Cup.
        /// </summary>
        Task<Dictionary<Guid, SteelheadLiveOpsContent.ChampionshipPlaylistDataV3>> GetRacersCupPlaylistDataV3Async(
            string pegasusEnvironment = null,
            string pegasusSlot = null,
            string pegasusSnapshot = null);

        /// <summary>
        ///     Gets championship data for Racer's Cup.
        /// </summary>
        Task<SteelheadLiveOpsContent.RacersCupChampionships> GetRacersCupChampionshipScheduleV4Async(
            string pegasusEnvironment = null,
            string pegasusSlot = null,
            string pegasusSnapshot = null);

        /// <summary>
        ///     Gets leaderboards.
        /// </summary>
        Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string pegasusEnvironment, string slotId = SteelheadPegasusSlot.Daily);

        /// <summary>
        ///     Creates pull request.
        /// </summary>
        Task<GitPullRequest> CreatePullRequestAsync(GitPush pushed, string pullRequestTitle, string pullRequestDescription);

        /// <summary>
        ///     Commits and push changes.
        /// </summary>
        Task<GitPush> CommitAndPushAsync(CommitRefProxy[] changes);

        /// <summary>
        ///     Edits and saves Message of the Day
        ///     using deserialized xml entry.
        /// </summary>
        Task<CommitRefProxy> EditMessageOfTheDayAsync(MotdBridge messageOfTheDayBridge, Guid id, string commitComment);

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
        ///     Edits and saves World of Forza Tile
        ///     using deserialized xml entry.
        /// </summary>
        Task<CommitRefProxy> EditWorldOfForzaTileAsync(WofBridge wofTileBridge, Guid id, string commitComment);

        /// <summary>
        ///     Gets current World of Forza values for the entry
        ///     with matching id.
        /// </summary>
        Task<WofBridge> GetWorldOfForzaCurrentValuesAsync(Guid id);

        /// <summary>
        ///     Gets World of Forza selection options.
        /// </summary>
        Task<Dictionary<Guid, string>> GetWorldOfForzaSelectionsAsync();

        /// <summary>
        ///     Gets a World of Forza entry as an Xelement.
        /// </summary>
        Task<XElement> GetWorldOfForzaElementAsync(Guid id);

        /// <summary>
        ///     Gets pull pull requests from the steward user.
        /// </summary>
        Task<IEnumerable<(GitPullRequest, string authorEmail)>> GetPullRequestsAsync(PullRequestStatus status);

        /// <summary>
        /// Abandons the pull request.
        /// </summary>
        Task<GitPullRequest> AbandonPullRequestAsync(int pullRequestId);

        /// <summary>
        ///     Gets all branches.
        /// </summary>
        Task<IEnumerable<GitRef>> GetAllBranchesAsync();

        /// <summary>
        ///     Runs the specified build pipeline.
        /// </summary>
        public Task<Build> RunFormatPipelineAsync(GitPush push);
    }
}
