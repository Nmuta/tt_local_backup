using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using Xls.WebServices.FH4.Generated;
using Xls.WebServices.NotificationsObjects.FH4.Generated;
using static Forza.LiveOps.FH4.Generated.UserManagementService;
using static Forza.WebServices.FH4.Generated.LiveOpsService;
using static Forza.WebServices.FH4.Generated.RareCarShopService;
using static Xls.WebServices.FH4.Generated.NotificationsService;
using LiveOpsContracts = Forza.LiveOps.FH4.Generated;
using WebServicesContracts = Forza.WebServices.FH4.Generated;

namespace Turn10.LiveOps.StewardTest.Unit.Sunrise
{
    [TestClass]
    public sealed class SunrisePlayerDetailsProviderTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_DoesNotThrow()
        {
            // Arrange.
            var dependencies = new Dependencies();

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSunriseServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunriseService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunriseService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenMapperNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Mapper = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "mapper"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenRefreshableCacheStoreNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { RefreshableCacheStore = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "refreshableCacheStore"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentitiesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var query = Fixture.Create<IList<IdentityQueryAlpha>>();

            // Act.
            async Task<IList<IdentityResultAlpha>> Action() => await provider.GetPlayerIdentitiesAsync(query).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<IdentityResultAlpha>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentitiesAsync_WithNullQuery_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            Func<Task<IList<IdentityResultAlpha>>> action = async () => await provider.GetPlayerIdentitiesAsync(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "queries"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetailsAsync_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerDetailsAsync(null).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EnsurePlayerExistsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<bool>>>
            {
                async () => await provider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(gamertag).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeTrue();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EnsurePlayerExistsAsync_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.EnsurePlayerExistsAsync(null).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.EnsurePlayerExistsAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetConsolesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IList<ConsoleDetails>> Action() => await provider.GetConsolesAsync(xuid, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<ConsoleDetails>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetConsoleBanStatusAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var banStatus = Fixture.Create<bool>();

            // Act.
            Func<Task> action = async () => await provider.SetConsoleBanStatusAsync(xuid, banStatus).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetSharedConsoleUsersAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IList<SharedConsoleUser>> Action() => await provider.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<SharedConsoleUser>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUserFlagsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<SunriseUserFlags> Action() => await provider.GetUserFlagsAsync(xuid).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<SunriseUserFlags>();
            Action().Result.ShouldNotBeNull();
            Action().Result.IsEarlyAccess.Should().Be(false);
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlagsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var userFlags = Fixture.Create<SunriseUserFlags>();

            // Act.
            Func<Task> action = async () => await provider.SetUserFlagsAsync(xuid, userFlags).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlagsAsync_WithNullUserFlags_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task> action = async () => await provider.SetUserFlagsAsync(xuid, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "userFlags"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetProfileSummaryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<ProfileSummary> Action() => await provider.GetProfileSummaryAsync(xuid).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<ProfileSummary>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetCreditUpdatesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IList<CreditUpdate>> Action() => await provider.GetCreditUpdatesAsync(xuid, startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<CreditUpdate>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetBackstagePassTransactionsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IList<BackstagePassUpdate>> Action() => await provider.GetBackstagePassUpdatesAsync(xuid).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<BackstagePassUpdate>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetProfileNotesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<IList<SunriseProfileNote>> Action() => await provider.GetProfileNotesAsync(xuid).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<SunriseProfileNote>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void AddProfileNotesAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var note = Fixture.Create<SunriseProfileNote>();

            // Act.
            Func<Task> action = async () => await provider.AddProfileNoteAsync(xuid, note).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void AddProfileNotesAsync_WithNullProfileNote_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task> action = async () => await provider.AddProfileNoteAsync(xuid, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "note"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanUsersAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var banParameters = GenerateBanParameters();
            var requesterObjectId = Fixture.Create<string>();

            // Act.
            async Task<IList<BanResult>> Action() => await provider.BanUsersAsync(banParameters, requesterObjectId).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<BanResult>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanUsersAsync_WithNullEmptyWhitespaceRequesterObjectId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var banParameters = GenerateBanParameters();

            // Act.
            var actions = new List<Func<Task<IList<BanResult>>>>
            {
                async () => await provider.BanUsersAsync(banParameters, null).ConfigureAwait(false),
                async () => await provider.BanUsersAsync(banParameters, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.BanUsersAsync(banParameters, TestConstants.Empty).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requesterObjectId"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanUsersAsync_WithNullBanParameters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var requesterObjectId = Fixture.Create<string>();

            // Act.
            Func<Task<IList<BanResult>>> action = async () => await provider.BanUsersAsync(null, requesterObjectId).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banParameters"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUserBanSummariesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuids = Fixture.Create<List<ulong>>();

            // Act.
            async Task<IList<BanSummary>> Action() => await provider.GetUserBanSummariesAsync(xuids).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<BanSummary>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUserBanHistoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<IList<LiveOpsBanHistory>>>>
            {
                async () => await provider.GetUserBanHistoryAsync(xuid).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<List<LiveOpsBanHistory>>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerNotificationsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IList<Notification>> Action() => await provider.GetPlayerNotificationsAsync(xuid, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<Notification>>();
            Action().Result.ShouldNotBeNull();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendCommunityMessageAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuids = Fixture.Create<List<ulong>>();
            var message = Fixture.Create<string>();
            var expireTime = Fixture.Create<DateTime>();

            // Act.
            async Task<IList<MessageSendResult<ulong>>> Action() => await provider.SendCommunityMessageAsync(xuids, message, expireTime).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<MessageSendResult<ulong>>>();
            Action().Result.ShouldNotBeNull();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendCommunityMessageAsync_WithNullXuids_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var message = Fixture.Create<string>();
            var expireTime = Fixture.Create<DateTime>();

            // Act.
            Func<Task<IList<MessageSendResult<ulong>>>> action = async () => await provider.SendCommunityMessageAsync(null, message, expireTime).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "xuids"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendCommunityMessageAsync_WithNullEmptyWhitespaceMessage_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuids = Fixture.Create<List<ulong>>();
            var groupId = Fixture.Create<int>();
            var expireTime = Fixture.Create<DateTime>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SendCommunityMessageAsync(xuids, null, expireTime).ConfigureAwait(false),
                async () => await provider.SendCommunityMessageAsync(xuids, TestConstants.Empty, expireTime).ConfigureAwait(false),
                async () => await provider.SendCommunityMessageAsync(xuids, TestConstants.WhiteSpace, expireTime).ConfigureAwait(false),
                async () => await provider.SendCommunityMessageAsync(groupId, null, expireTime).ConfigureAwait(false),
                async () => await provider.SendCommunityMessageAsync(groupId, TestConstants.Empty, expireTime).ConfigureAwait(false),
                async () => await provider.SendCommunityMessageAsync(groupId, TestConstants.WhiteSpace, expireTime).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "message"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendCommunityMessageAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var message = Fixture.Create<string>();
            var expireTime = Fixture.Create<DateTime>();

            async Task<MessageSendResult<int>> Action() => await provider.SendCommunityMessageAsync(groupId, message, expireTime).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<MessageSendResult<int>>();
            Action().Result.ShouldNotBeNull();


            // Act.
            Func<Task> action = async () => await provider.SendCommunityMessageAsync(groupId, message, expireTime).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerAuctionsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var filters = Fixture.Create<AuctionFilters>();

            // Act.
            async Task<IList<PlayerAuction>> Action() => await provider.GetPlayerAuctionsAsync(xuid, filters).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<PlayerAuction>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerAuctionsAsync_WithNullFilters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var filters = Fixture.Create<AuctionFilters>();

            // Act.
            Func<Task<IList<PlayerAuction>>> action = async () => await provider.GetPlayerAuctionsAsync(xuid, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "filters"));
        }


        private List<SunriseBanParameters> GenerateBanParameters()
        {
            var newParams = new SunriseBanParameters
            {
                Xuid = 111,
                Gamertag = "gamerT1",
                FeatureArea = "Matchmaking",
                Reason = "Disgusting license plate.",
                StartTimeUtc = DateTime.UtcNow,
                ExpireTimeUtc = DateTime.UtcNow.AddSeconds(1),
                BanAllConsoles = false,
                BanAllPcs = false,
                DeleteLeaderboardEntries = false,
                SendReasonNotification = false
            };

            return new List<SunriseBanParameters> { newParams };
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SunriseService.GetLiveOpsUserDataByGamerTagAsync(Arg.Any<string>()).Returns(Fixture.Create<GetLiveOpsUserDataByGamerTagOutput>());
                this.SunriseService.GetLiveOpsUserDataByGamerTagAsync("gamerT1").Returns(GenerateGetLiveOpsUserDataByGamerTagOutPut());
                this.SunriseService.GetLiveOpsUserDataByXuidAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetLiveOpsUserDataByXuidOutput>());
                this.SunriseService.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<GetConsolesOutput>());
                this.SunriseService.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<GetSharedConsoleUsersOutput>());
                this.SunriseService.GetUserGroupMembershipsAsync(Arg.Any<ulong>(), Arg.Any<int[]>(), Arg.Any<int>()).Returns(Fixture.Create<GetUserGroupMembershipsOutput>());
                this.SunriseService.GetIsUnderReviewAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetIsUnderReviewOutput>());
                this.SunriseService.GetProfileSummaryAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetProfileSummaryOutput>());
                this.SunriseService.GetProfileNotesAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<GetAdminCommentsOutput>());
                this.SunriseService.GetCreditUpdateEntriesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<GetCreditUpdateEntriesOutput>());
                this.SunriseService.GetUserIds(Arg.Any<LiveOpsContracts.ForzaPlayerLookupParameters[]>()).Returns(Fixture.Create<GetUserIdsOutput>());
                this.SunriseService.BanUsersAsync(Arg.Any<LiveOpsContracts.ForzaUserBanParameters[]>(), Arg.Any<int>()).Returns(GenerateBanUsersOutput());
                this.SunriseService.GetUserBanSummariesAsync(Arg.Any<ulong[]>(), Arg.Any<int>()).Returns(Fixture.Create<GetUserBanSummariesOutput>());
                this.SunriseService.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(GenerateGetUserBanHistoryOutput());
                this.SunriseService.LiveOpsRetrieveForUserAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<LiveOpsRetrieveForUserOutput>());
                this.SunriseService.SendMessageNotificationToMultipleUsersAsync(Arg.Any<List<ulong>>(), Arg.Any<string>(), Arg.Any<DateTime>()).Returns(Fixture.Create<SendMessageNotificationToMultipleUsersOutput>());
                this.SunriseService.GetTokenTransactionsAsync(Arg.Any<ulong>()).Returns(Fixture.Create<AdminGetTransactionsOutput>());
                this.SunriseService.GetPlayerAuctions(Arg.Any<LiveOpsContracts.ForzaAuctionFilters>()).Returns(Fixture.Create<LiveOpsContracts.AuctionManagementService.SearchAuctionHouseOutput>());
                this.Mapper.Map<SunrisePlayerDetails>(Arg.Any<UserData>()).Returns(Fixture.Create<SunrisePlayerDetails>());
                this.Mapper.Map<IList<ConsoleDetails>>(Arg.Any<LiveOpsContracts.ForzaConsole[]>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.Mapper.Map<IList<SharedConsoleUser>>(Arg.Any<LiveOpsContracts.ForzaSharedConsoleUser[]>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.Mapper.Map<ProfileSummary>(Arg.Any<WebServicesContracts.ForzaProfileSummary>()).Returns(Fixture.Create<ProfileSummary>());
                this.Mapper.Map<IList<CreditUpdate>>(Arg.Any<WebServicesContracts.ForzaCreditUpdateEntry[]>()).Returns(Fixture.Create<IList<CreditUpdate>>());
                this.Mapper.Map<IList<BanResult>>(Arg.Any<LiveOpsContracts.ForzaUserBanResult[]>()).Returns(Fixture.Create<IList<BanResult>>());
                this.Mapper.Map<IList<BanSummary>>(Arg.Any<LiveOpsContracts.ForzaUserBanSummary[]>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.Mapper.Map<List<BanDescription>>(Arg.Any<LiveOpsContracts.ForzaUserBanDescription[]>()).Returns(Fixture.Create<IList<BanDescription>>());
                this.Mapper.Map<IdentityResultAlpha>(Arg.Any<SunrisePlayerDetails>()).Returns(Fixture.Create<IdentityResultAlpha>());
                this.Mapper.Map<IList<Notification>>(Arg.Any<LiveOpsNotification[]>()).Returns(Fixture.Create<IList<Notification>>());
                this.Mapper.Map<IList<MessageSendResult<ulong>>>(Arg.Any<ForzaUserMessageSendResult[]>()).Returns(Fixture.Create<IList<MessageSendResult<ulong>>>());
                this.Mapper.Map<IList<SunriseProfileNote>>(Arg.Any<LiveOpsContracts.ForzaUserAdminComment[]>()).Returns(Fixture.Create<IList<SunriseProfileNote>>());
                this.Mapper.Map<IList<BackstagePassUpdate>>(Arg.Any<WebServicesContracts.RareCarShopTransaction[]>()).Returns(Fixture.Create<IList<BackstagePassUpdate>>());
                this.Mapper.Map<LiveOpsContracts.ForzaAuctionFilters>(Arg.Any<AuctionFilters>()).Returns(Fixture.Create<LiveOpsContracts.ForzaAuctionFilters>());
                this.Mapper.Map<IList<PlayerAuction>>(Arg.Any<LiveOpsContracts.ForzaAuctionWithFileData[]>()).Returns(Fixture.Create<IList<PlayerAuction>>());
                this.RefreshableCacheStore.GetItem<IList<CreditUpdate>>(Arg.Any<string>()).Returns((IList<CreditUpdate>)null);
                this.RefreshableCacheStore.GetItem<IList<BackstagePassUpdate>>(Arg.Any<string>()).Returns((IList<BackstagePassUpdate>)null);
                this.Mapper.Map<IList<IdentityResultAlpha>>(Arg.Any<LiveOpsContracts.ForzaPlayerLookupResult[]>()).Returns(Fixture.Create<IList<IdentityResultAlpha>>());
                this.Mapper.Map<IList<SunriseProfileNote>>(Arg.Any<LiveOpsContracts.ForzaUserAdminComment[]>()).Returns(Fixture.Create<IList<SunriseProfileNote>>());
            }

            public ISunriseService SunriseService { get; set; } = Substitute.For<ISunriseService>();
            
            public ISunriseBanHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<ISunriseBanHistoryProvider>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IRefreshableCacheStore RefreshableCacheStore { get; set; } = Substitute.For<IRefreshableCacheStore>();

            public SunrisePlayerDetailsProvider Build() => new SunrisePlayerDetailsProvider(
                this.SunriseService,
                this.GiftHistoryProvider,
                this.Mapper,
                this.RefreshableCacheStore);

            private static GetUserBanHistoryOutput GenerateGetUserBanHistoryOutput()
            {
                // Cannot use random uint value for feature area, we must build our own valid fake data
                var rnd = new Random();
                var fakeBanHistories = new List<LiveOpsContracts.ForzaUserBanDescription>();
                var numberOfFakeBanHistories = rnd.Next(1, 10);
                for (var i = 0; i < numberOfFakeBanHistories; i++)
                {
                    fakeBanHistories.Add(Fixture.Build<LiveOpsContracts.ForzaUserBanDescription>().With(x => x.FeatureAreas, (uint)2).Create());
                }

                return Fixture.Build<GetUserBanHistoryOutput>().With(x => x.bans, fakeBanHistories.ToArray()).Create();
            }

            private static BanUsersOutput GenerateBanUsersOutput()
            {
                var fakeBanResults = new List<LiveOpsContracts.ForzaUserBanResult>
                {
                    Fixture.Build<LiveOpsContracts.ForzaUserBanResult>().With(x => x.Xuid, (ulong) 111).Create()
                };

                return Fixture.Build<BanUsersOutput>().With(x => x.banResults, fakeBanResults.ToArray()).Create();
            }

            private static GetLiveOpsUserDataByGamerTagOutput GenerateGetLiveOpsUserDataByGamerTagOutPut()
            {
                var fakeUser = Fixture.Build<UserData>().With(x => x.qwXuid, (ulong) 111).Create();

                return Fixture.Build<GetLiveOpsUserDataByGamerTagOutput>().With(x => x.userData, fakeUser).Create();
            }
        }
    }
}
