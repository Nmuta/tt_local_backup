using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.Services.LiveOps.FH5_main.Generated;
using Xls.WebServices.FH5_main.Generated;
using static Forza.WebServices.FH5_main.Generated.LiveOpsService;
using static Forza.WebServices.FH5_main.Generated.RareCarShopService;
using static Turn10.Services.LiveOps.FH5_main.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ProviderTests
{
    [TestClass]
    public sealed class WoodstockPlayerDetailsProviderTests
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
        public void Ctor_WhenWoodstockServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockService"));
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
            var queries = Fixture.Create<IList<IdentityQueryAlpha>>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<IdentityResultAlpha>> Action() => await provider.GetPlayerIdentitiesAsync(queries, endpoint).ConfigureAwait(false);

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
        public async Task GetUserReportWeightAsync_WithValidParameters_ReturnsValidValue()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<UserReportWeight> Action() => await provider.GetUserReportWeightAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Weight.Should().BeInRange(1, 99);
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserReportWeightAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var reportWeight = Fixture.Create<UserReportWeightType>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.SetUserReportWeightAsync(xuid, reportWeight, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetHasPlayedRecordAsync_WithValidParameters_ReturnsValidValue()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<HasPlayedRecord>> Action() => await provider.GetHasPlayedRecordAsync(xuid, profileId, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<HasPlayedRecord>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void ResendProfileHasPlayedNotificationAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();
            var titles = Fixture.Create<int[]>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () => await provider.ResendProfileHasPlayedNotificationAsync(xuid, profileId, titles, endpoint).ConfigureAwait(false);

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
            var endpoint = WoodstockEndpoint.Studio;

            // Act.
            async Task<WoodstockUserFlags> Action() => await provider.GetUserFlagsAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<WoodstockUserFlags>();
            result.IsEarlyAccess.Should().BeFalse();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlagsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var userFlags = Fixture.Create<WoodstockUserFlags>();
            var endpoint = WoodstockEndpoint.Studio;

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
            var endpoint = WoodstockEndpoint.Studio;

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

        private sealed class Dependencies
        {
            public Dependencies()
            {
                Random rnd = new Random();
                var fakeGetUserReportWeightOutput = Fixture.Create<UserManagementService.GetUserReportWeightOutput>();
                var fakeGetReportWeight = Fixture.Create<UserReportWeight>();
                fakeGetUserReportWeightOutput.reportWeight = rnd.Next(1, 100);
                fakeGetReportWeight.Weight = fakeGetUserReportWeightOutput.reportWeight;

                this.WoodstockService.GetUserIdsAsync(Arg.Any<ForzaPlayerLookupParameters[]>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserIdsOutput>());
                this.WoodstockService.GetUserDataByGamertagAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<GetLiveOpsUserDataByGamerTagV2Output>());
                this.WoodstockService.GetUserDataByGamertagAsync("gamerT1", Arg.Any<string>()).Returns(GenerateGetLiveOpsUserDataByGamerTagOutPut());
                this.WoodstockService.GetUserDataByXuidAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetLiveOpsUserDataByXuidV2Output>());
                this.WoodstockService.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetConsolesOutput>());
                this.WoodstockService.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetSharedConsoleUsersOutput>());
                this.WoodstockService.GetUserGroupMembershipsAsync(Arg.Any<ulong>(), Arg.Any<int[]>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserGroupMembershipsOutput>());
                this.WoodstockService.GetIsUnderReviewAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetIsUnderReviewOutput>());
                this.WoodstockService.GetProfileSummaryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetProfileSummaryOutput>());
                this.WoodstockService.GetCreditUpdateEntriesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetCreditUpdateEntriesOutput>());
                this.WoodstockService.BanUsersAsync(Arg.Any<ForzaUserBanParameters[]>(), Arg.Any<int>(), Arg.Any<string>()).Returns(GenerateBanUsersOutput());
                this.WoodstockService.GetUserBanSummariesAsync(Arg.Any<ulong[]>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserBanSummariesOutput>());
                this.WoodstockService.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(GenerateGetUserBanHistoryOutput());
                this.WoodstockService.GetTokenTransactionsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<AdminGetTransactionsOutput>());
                this.WoodstockService.GetUserReportWeightAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(fakeGetUserReportWeightOutput);
                this.WoodstockService.SetUserReportWeightAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<Task>());
                this.WoodstockService.SetUserReportWeightTypeAsync(Arg.Any<ulong>(), Arg.Any<ForzaUserReportWeightType>(), Arg.Any<string>()).Returns(Fixture.Create<Task>());
                this.WoodstockService.GetHasPlayedRecordAsync(Arg.Any<ulong>(), Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetHasPlayedRecordOutput>());
                this.Mapper.SafeMap<WoodstockPlayerDetails>(Arg.Any<UserData>()).Returns(Fixture.Create<WoodstockPlayerDetails>());
                this.Mapper.SafeMap<IList<ConsoleDetails>>(Arg.Any<ForzaConsole[]>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.Mapper.SafeMap<IList<SharedConsoleUser>>(Arg.Any<ForzaSharedConsoleUser[]>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.Mapper.SafeMap<ProfileSummary>(Arg.Any<ForzaProfileSummary>()).Returns(Fixture.Create<ProfileSummary>());
                this.Mapper.SafeMap<IList<CreditUpdate>>(Arg.Any<ForzaCredityUpdateEntry[]>()).Returns(Fixture.Create<IList<CreditUpdate>>());
                this.Mapper.SafeMap<IList<BanResult>>(Arg.Any<ForzaUserBanResult[]>()).Returns(Fixture.Create<IList<BanResult>>());
                this.Mapper.SafeMap<IList<BanSummary>>(Arg.Any<ForzaUserBanSummary[]>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.Mapper.SafeMap<IList<BanDescription>>(Arg.Any<ForzaUserBanDescription[]>()).Returns(Fixture.Create<IList<BanDescription>>());
                this.Mapper.SafeMap<IdentityResultAlpha>(Arg.Any<WoodstockPlayerDetails>()).Returns(Fixture.Create<IdentityResultAlpha>());
                this.Mapper.SafeMap<IList<BackstagePassUpdate>>(Arg.Any<RareCarShopTransaction[]>()).Returns(Fixture.Create<IList<BackstagePassUpdate>>());
                this.Mapper.SafeMap<UserReportWeight>(Arg.Any<GetUserReportWeightOutput>()).Returns(fakeGetReportWeight);
                this.Mapper.SafeMap<IList<HasPlayedRecord>>(Arg.Any<ForzaLiveOpsHasPlayedRecord[]>()).Returns(Fixture.Create<IList<HasPlayedRecord>>());
                this.RefreshableCacheStore.GetItem<IList<CreditUpdate>>(Arg.Any<string>()).Returns((IList<CreditUpdate>)null);
                this.RefreshableCacheStore.GetItem<IList<BackstagePassUpdate>>(Arg.Any<string>()).Returns((IList<BackstagePassUpdate>)null);
                this.Mapper.SafeMap<IList<IdentityResultAlpha>>(Arg.Any<ForzaPlayerLookupResult[]>()).Returns(Fixture.Create<IList<IdentityResultAlpha>>());
            }

            public IWoodstockService WoodstockService { get; set; } = Substitute.For<IWoodstockService>();

            public IWoodstockBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<IWoodstockBanHistoryProvider>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IRefreshableCacheStore RefreshableCacheStore { get; set; } = Substitute.For<IRefreshableCacheStore>();

            public WoodstockPlayerDetailsProvider Build() => new WoodstockPlayerDetailsProvider(
                this.WoodstockService,
                this.BanHistoryProvider,
                this.Mapper,
                this.RefreshableCacheStore);

            private static UserManagementService.GetUserBanHistoryOutput GenerateGetUserBanHistoryOutput()
            {
                // Cannot use random uint value for feature area, we must build our own valid fake data
                var rnd = new Random();
                var fakeBanHistories = new List<ForzaUserBanDescription>();
                var numberOfFakeBanHistories = rnd.Next(1, 10);
                for (var i = 0; i < numberOfFakeBanHistories; i++)
                {
                    fakeBanHistories.Add(Fixture.Build<ForzaUserBanDescription>().With(x => x.FeatureAreas, (uint)2).Create());
                }

                return Fixture.Build<UserManagementService.GetUserBanHistoryOutput>().With(x => x.bans, fakeBanHistories.ToArray()).Create();
            }

            private static UserManagementService.BanUsersOutput GenerateBanUsersOutput()
            {
                var fakeBanResults = new List<ForzaUserBanResult>
                {
                    Fixture.Build<ForzaUserBanResult>().With(x => x.Xuid, (ulong) 111).Create()
                };

                return Fixture.Build<UserManagementService.BanUsersOutput>().With(x => x.banResults, fakeBanResults.ToArray()).Create();
            }

            private static GetLiveOpsUserDataByGamerTagV2Output GenerateGetLiveOpsUserDataByGamerTagOutPut()
            {
                var fakeUser = Fixture.Build<ForzaUserData>().With(x => x.Xuid, (ulong)111).Create();

                return Fixture.Build<GetLiveOpsUserDataByGamerTagV2Output>().With(x => x.userData, fakeUser).Create();
            }
        }
    }
}
