using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH4.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using Xls.WebServices.FH4.Generated;
using static Forza.LiveOps.FH4.Generated.UserManagementService;
using static Forza.WebServices.FH4.Generated.LiveOpsService;
using static Forza.WebServices.FH4.Generated.RareCarShopService;
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
        public async Task GetPlayerIdentitiesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var query = Fixture.Create<IList<IdentityQueryAlpha>>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<IdentityResultAlpha>> Action() => await provider.GetPlayerIdentitiesAsync(query, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<IdentityResultAlpha>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentitiesAsync_WithNullQuery_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IList<IdentityResultAlpha>>> action = async () => await provider.GetPlayerIdentitiesAsync(null, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "queries"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetailsAsync_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerDetailsAsync(null, endpoint).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(TestConstants.Empty, endpoint).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(TestConstants.WhiteSpace, endpoint).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task DoesPlayerExistAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<bool>>>
            {
                async () => await provider.DoesPlayerExistAsync(xuid, endpoint).ConfigureAwait(false),
                async () => await provider.DoesPlayerExistAsync(gamertag, endpoint).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                var result = await action().ConfigureAwait(false);
                result.Should().BeTrue();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DoesPlayerExistAsync_WithNullEmptyWhitespaceGamertag_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.DoesPlayerExistAsync(null, endpoint).ConfigureAwait(false),
                async () => await provider.DoesPlayerExistAsync(TestConstants.Empty, endpoint).ConfigureAwait(false),
                async () => await provider.DoesPlayerExistAsync(TestConstants.WhiteSpace, endpoint).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gamertag"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetConsolesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var maxResults = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<ConsoleDetails>> Action() => await provider.GetConsolesAsync(xuid, maxResults, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<ConsoleDetails>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetConsoleBanStatusAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var banStatus = Fixture.Create<bool>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.SetConsoleBanStatusAsync(xuid, banStatus, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetSharedConsoleUsersAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<SharedConsoleUser>> Action() => await provider.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<SharedConsoleUser>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUserFlagsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<SunriseUserFlags> Action() => await provider.GetUserFlagsAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<SunriseUserFlags>();
            result.IsEarlyAccess.Should().BeFalse();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlagsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var userFlags = Fixture.Create<SunriseUserFlags>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.SetUserFlagsAsync(xuid, userFlags, endpoint).ConfigureAwait(false);

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
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.SetUserFlagsAsync(xuid, null, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "userFlags"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetProfileSummaryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<ProfileSummary> Action() => await provider.GetProfileSummaryAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<ProfileSummary>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetCreditUpdatesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<CreditUpdate>> Action() => await provider.GetCreditUpdatesAsync(xuid, startIndex, maxResults, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<CreditUpdate>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetBackstagePassTransactionsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<BackstagePassUpdate>> Action() => await provider.GetBackstagePassUpdatesAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<BackstagePassUpdate>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetProfileNotesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<ProfileNote>> Action() => await provider.GetProfileNotesAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<ProfileNote>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void AddProfileNotesAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var note = Fixture.Create<ProfileNote>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.AddProfileNoteAsync(xuid, note, endpoint).ConfigureAwait(false);

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
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.AddProfileNoteAsync(xuid, null, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "note"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task BanUsersAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var banParameters = GenerateBanParameters();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<BanResult>> Action() => await provider.BanUsersAsync(banParameters, requesterObjectId, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<BanResult>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanUsersAsync_WithNullEmptyWhitespaceRequesterObjectId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var banParameters = GenerateBanParameters();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<IList<BanResult>>>>
            {
                async () => await provider.BanUsersAsync(banParameters, null, endpoint).ConfigureAwait(false),
                async () => await provider.BanUsersAsync(banParameters, TestConstants.WhiteSpace, endpoint).ConfigureAwait(false),
                async () => await provider.BanUsersAsync(banParameters, TestConstants.Empty, endpoint).ConfigureAwait(false)
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
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IList<BanResult>>> action = async () => await provider.BanUsersAsync(null, requesterObjectId, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banParameters"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUserBanSummariesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuids = Fixture.Create<List<ulong>>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<BanSummary>> Action() => await provider.GetUserBanSummariesAsync(xuids, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<BanSummary>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetUserBanHistoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<LiveOpsBanHistory>> Action() => await provider.GetUserBanHistoryAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<LiveOpsBanHistory>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerAuctionsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var filters = Fixture.Create<AuctionFilters>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<PlayerAuction>> Action() => await provider.GetPlayerAuctionsAsync(xuid, filters, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<PlayerAuction>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerAuctionsAsync_WithNullFilters_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IList<PlayerAuction>>> action = async () => await provider.GetPlayerAuctionsAsync(xuid, null, endpoint).ConfigureAwait(false);

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
                this.SunriseService.GetLiveOpsUserDataByGamerTagAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<GetLiveOpsUserDataByGamerTagOutput>());
                this.SunriseService.GetLiveOpsUserDataByGamerTagAsync("gamerT1", Arg.Any<string>()).Returns(GenerateGetLiveOpsUserDataByGamerTagOutPut());
                this.SunriseService.GetLiveOpsUserDataByXuidAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetLiveOpsUserDataByXuidOutput>());
                this.SunriseService.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetConsolesOutput>());
                this.SunriseService.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetSharedConsoleUsersOutput>());
                this.SunriseService.GetUserGroupMembershipsAsync(Arg.Any<ulong>(), Arg.Any<int[]>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetUserGroupMembershipsOutput>());
                this.SunriseService.GetIsUnderReviewAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetIsUnderReviewOutput>());
                this.SunriseService.GetProfileSummaryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetProfileSummaryOutput>());
                this.SunriseService.GetProfileNotesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetAdminCommentsOutput>());
                this.SunriseService.GetCreditUpdateEntriesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetCreditUpdateEntriesOutput>());
                this.SunriseService.GetUserIdsAsync(Arg.Any<ForzaPlayerLookupParameters[]>(), Arg.Any<string>()).Returns(Fixture.Create<GetUserIdsOutput>());
                this.SunriseService.BanUsersAsync(Arg.Any<WebServicesContracts.ForzaUserBanParameters[]>(), Arg.Any<string>()).Returns(GenerateBanUsersOutput());
                this.SunriseService.GetUserBanSummariesAsync(Arg.Any<ulong[]>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<WebServicesContracts.UserService.GetUserBanSummariesOutput>());
                this.SunriseService.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(GenerateGetUserBanHistoryOutput());
                this.SunriseService.GetTokenTransactionsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<AdminGetTransactionsOutput>());
                this.SunriseService.GetPlayerAuctionsAsync(Arg.Any<LiveOpsContracts.ForzaAuctionFilters>(), Arg.Any<string>()).Returns(Fixture.Create<LiveOpsContracts.AuctionManagementService.SearchAuctionHouseOutput>());
                this.Mapper.SafeMap<SunrisePlayerDetails>(Arg.Any<UserData>()).Returns(Fixture.Create<SunrisePlayerDetails>());
                this.Mapper.SafeMap<IList<ConsoleDetails>>(Arg.Any<LiveOpsContracts.ForzaConsole[]>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.Mapper.SafeMap<IList<SharedConsoleUser>>(Arg.Any<LiveOpsContracts.ForzaSharedConsoleUser[]>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.Mapper.SafeMap<ProfileSummary>(Arg.Any<WebServicesContracts.ForzaProfileSummary>()).Returns(Fixture.Create<ProfileSummary>());
                this.Mapper.SafeMap<IList<CreditUpdate>>(Arg.Any<WebServicesContracts.ForzaCreditUpdateEntry[]>()).Returns(Fixture.Create<IList<CreditUpdate>>());
                this.Mapper.SafeMap<IList<BanResult>>(Arg.Any<WebServicesContracts.ForzaUserBanResult[]>()).Returns(Fixture.Create<IList<BanResult>>());
                this.Mapper.SafeMap<IList<BanSummary>>(Arg.Any<WebServicesContracts.ForzaUserBanSummary[]>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.Mapper.SafeMap<List<BanDescription>>(Arg.Any<WebServicesContracts.ForzaUserBanDescription[]>()).Returns(Fixture.Create<IList<BanDescription>>());
                this.Mapper.SafeMap<IdentityResultAlpha>(Arg.Any<SunrisePlayerDetails>()).Returns(Fixture.Create<IdentityResultAlpha>());
                this.Mapper.SafeMap<IList<ProfileNote>>(Arg.Any<ForzaUserAdminComment[]>()).Returns(Fixture.Create<IList<ProfileNote>>());
                this.Mapper.SafeMap<IList<BackstagePassUpdate>>(Arg.Any<WebServicesContracts.RareCarShopTransaction[]>()).Returns(Fixture.Create<IList<BackstagePassUpdate>>());
                this.Mapper.SafeMap<ForzaAuctionFilters>(Arg.Any<AuctionFilters>()).Returns(Fixture.Create<LiveOpsContracts.ForzaAuctionFilters>());
                this.Mapper.SafeMap<IList<PlayerAuction>>(Arg.Any<ForzaAuctionWithFileData[]>()).Returns(Fixture.Create<IList<PlayerAuction>>());
                this.RefreshableCacheStore.GetItem<IList<CreditUpdate>>(Arg.Any<string>()).Returns((IList<CreditUpdate>)null);
                this.RefreshableCacheStore.GetItem<IList<BackstagePassUpdate>>(Arg.Any<string>()).Returns((IList<BackstagePassUpdate>)null);
                this.Mapper.SafeMap<IList<IdentityResultAlpha>>(Arg.Any<ForzaPlayerLookupResult[]>()).Returns(Fixture.Create<IList<IdentityResultAlpha>>());
                this.Mapper.SafeMap<IList<ProfileNote>>(Arg.Any<ForzaUserAdminComment[]>()).Returns(Fixture.Create<IList<ProfileNote>>());
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

            private static WebServicesContracts.UserService.GetUserBanHistoryOutput GenerateGetUserBanHistoryOutput()
            {
                // Cannot use random uint value for feature area, we must build our own valid fake data
                var rnd = new Random();
                var fakeBanHistories = new List<WebServicesContracts.ForzaUserBanDescription>();
                var numberOfFakeBanHistories = rnd.Next(1, 10);
                for (var i = 0; i < numberOfFakeBanHistories; i++)
                {
                    fakeBanHistories.Add(Fixture.Build<WebServicesContracts.ForzaUserBanDescription>().With(x => x.FeatureAreas, (uint)2).Create());
                }

                return Fixture.Build<WebServicesContracts.UserService.GetUserBanHistoryOutput>().With(x => x.bans, fakeBanHistories.ToArray()).Create();
            }

            private static WebServicesContracts.UserService.BanUsersOutput GenerateBanUsersOutput()
            {
                var fakeBanResults = new List<WebServicesContracts.ForzaUserBanResult>
                {
                    Fixture.Build<WebServicesContracts.ForzaUserBanResult>().With(x => x.Xuid, (ulong) 111).Create()
                };

                return Fixture.Build<WebServicesContracts.UserService.BanUsersOutput>().With(x => x.banResults, fakeBanResults.ToArray()).Create();
            }

            private static GetLiveOpsUserDataByGamerTagOutput GenerateGetLiveOpsUserDataByGamerTagOutPut()
            {
                var fakeUser = Fixture.Build<UserData>().With(x => x.qwXuid, (ulong)111).Create();

                return Fixture.Build<GetLiveOpsUserDataByGamerTagOutput>().With(x => x.userData, fakeUser).Create();
            }
        }
    }
}
