using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;

using UserManagementService = Turn10.Services.LiveOps.FM8.Generated.UserManagementService;
using LiveOpsService = Forza.WebServices.FM8.Generated.LiveOpsService;
using Turn10.Services.LiveOps.FM8.Generated;
using Xls.WebServices.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardTest.Unit.Steelhead
{
    [TestClass]
    public sealed class SteelheadPlayerDetailsProviderTests
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
        public void Ctor_WhenSteelheadServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadUserService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadService"));
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

        private List<SteelheadBanParameters> GenerateBanParameters()
        {
            var newParams = new SteelheadBanParameters
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

            return new List<SteelheadBanParameters> { newParams };
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SteelheadUserService.LookupPlayersAsync(Arg.Any<ForzaPlayerLookupParameters[]>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserIdsOutput>());
                this.SteelheadUserService.GetUserDataByGamertagAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput>());
                this.SteelheadUserService.GetUserDataByGamertagAsync("gamerT1", Arg.Any<string>()).Returns(GenerateGetLiveOpsUserDataByGamerTagOutPut());
                this.SteelheadUserService.GetUserDataByXuidAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<LiveOpsService.GetLiveOpsUserDataByXuidOutput>());
                this.SteelheadUserService.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetConsolesOutput>());
                this.SteelheadUserService.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetSharedConsoleUsersOutput>());
                this.SteelheadUserService.GetUserGroupMembershipsAsync(Arg.Any<ulong>(), Arg.Any<int[]>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserGroupMembershipsOutput>());
                this.SteelheadUserService.GetIsUnderReviewAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetIsUnderReviewOutput>());
                this.SteelheadUserService.BanUsersAsync(Arg.Any<ForzaUserBanParameters[]>(), Arg.Any<int>(), Arg.Any<string>()).Returns(GenerateBanUsersOutput());
                this.SteelheadUserService.GetUserBanSummariesAsync(Arg.Any<ulong[]>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserBanSummariesOutput>());
                this.SteelheadUserService.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(GenerateGetUserBanHistoryOutput());
                this.Mapper.SafeMap<SteelheadPlayerDetails>(Arg.Any<UserData>()).Returns(Fixture.Create<SteelheadPlayerDetails>());
                this.Mapper.SafeMap<IList<ConsoleDetails>>(Arg.Any<ForzaConsole[]>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.Mapper.SafeMap<IList<SharedConsoleUser>>(Arg.Any<ForzaSharedConsoleUser[]>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.Mapper.SafeMap<IList<BanResult>>(Arg.Any<ForzaUserBanResult[]>()).Returns(Fixture.Create<IList<BanResult>>());
                this.Mapper.SafeMap<IList<BanSummary>>(Arg.Any<ForzaUserBanSummary[]>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.Mapper.SafeMap<List<BanDescription>>(Arg.Any<ForzaUserBanDescription[]>()).Returns(Fixture.Create<IList<BanDescription>>());
                this.Mapper.SafeMap<IdentityResultAlpha>(Arg.Any<SteelheadPlayerDetails>()).Returns(Fixture.Create<IdentityResultAlpha>());
                this.Mapper.SafeMap<IList<IdentityResultAlpha>>(Arg.Any<ForzaPlayerLookupResult[]>()).Returns(Fixture.Create<IList<IdentityResultAlpha>>());
            }

            public ISteelheadService SteelheadUserService { get; set; } = Substitute.For<ISteelheadService>();

            public ISteelheadBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<ISteelheadBanHistoryProvider>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public SteelheadPlayerDetailsProvider Build() => new SteelheadPlayerDetailsProvider(
                this.SteelheadUserService,
                this.BanHistoryProvider,
                this.Mapper);

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

            private static LiveOpsService.GetLiveOpsUserDataByGamerTagOutput GenerateGetLiveOpsUserDataByGamerTagOutPut()
            {
                var fakeUser = Fixture.Build<UserData>().With(x => x.qwXuid, (ulong)111).Create();

                return Fixture.Build<LiveOpsService.GetLiveOpsUserDataByGamerTagOutput>().With(x => x.userData, fakeUser).Create();
            }
        }
    }
}
