using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FM7.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
using static Forza.WebServices.FM7.Generated.UserManagementService;
using static Forza.WebServices.FM7.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Apollo
{
    [TestClass]
    public sealed class ApolloPlayerDetailsProviderTests
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
        public void Ctor_WhenApolloServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "apolloService"));
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
        public void Ctor_WhenBanHistoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { BanHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banHistoryProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerIdentitiesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var query = Fixture.Create<IdentityQueryAlpha>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IdentityResultAlpha> Action() => await provider.GetPlayerIdentityAsync(query, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<IdentityResultAlpha>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentitiesAsync_WithNullQuery_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IdentityResultAlpha>> action = async () => await provider.GetPlayerIdentityAsync(null, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "query"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetPlayerDetailsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<ApolloPlayerDetails>>>
            {
                async () => await provider.GetPlayerDetailsAsync(xuid, endpoint).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(gamertag, endpoint).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                var result = await action().ConfigureAwait(false);
                result.Should().BeOfType<ApolloPlayerDetails>();
            }
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
            var xuid = Fixture.Create<ulong>();
            var gamertag = Fixture.Create<string>();
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
            async Task<ApolloUserFlags> Action() => await provider.GetUserFlagsAsync(xuid, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<ApolloUserFlags>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlagsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var userFlags = Fixture.Create<ApolloUserFlags>();
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

        private static List<ApolloBanParameters> GenerateBanParameters()
        {
            var newParams = new ApolloBanParameters
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

            return new List<ApolloBanParameters> { newParams };
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.ApolloService.LiveOpsGetUserDataByGamertagAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<LiveOpsGetUserDataByGamertagOutput>());
                this.ApolloService.LiveOpsGetUserDataByXuidAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<LiveOpsGetUserDataByXuidOutput>());
                this.ApolloService.BanUsersAsync(Arg.Any<ForzaUserBanParametersV2[]>(), Arg.Any<int>(), Arg.Any<string>()).Returns(GenerateBanUsersOutput());
                this.ApolloService.GetUserBanSummariesAsync(Arg.Any<ulong[]>(), Arg.Any<string>()).Returns(Fixture.Create<GetUserBanSummariesV2Output>());
                this.ApolloService.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(this.GenerateGetUserBanHistoryOutput());
                this.ApolloService.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetConsolesOutput>());
                this.ApolloService.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetSharedConsoleUsersOutput>());
                this.ApolloService.GetIsUnderReviewAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<GetIsUnderReviewOutput>());
                this.ApolloService.GetUserGroupMembershipsAsync(Arg.Any<ulong>(), Arg.Any<int[]>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetUserGroupMembershipsOutput>());
                this.ApolloService.GetUserGroupsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetUserGroupsOutput>());
                this.Mapper.SafeMap<ApolloPlayerDetails>(Arg.Any<CompositeUser>()).Returns(Fixture.Create<ApolloPlayerDetails>());
                this.Mapper.SafeMap<IList<BanResult>>(Arg.Any<ForzaUserBanResultV2[]>()).Returns(Fixture.Create<IList<BanResult>>());
                this.Mapper.SafeMap<IList<BanSummary>>(Arg.Any<ForzaUserBanSummaryV2[]>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.Mapper.SafeMap<List<BanDescription>>(Arg.Any<ForzaUserBanDescriptionV2[]>()).Returns(Fixture.Create<IList<BanDescription>>());
                this.Mapper.SafeMap<IList<ConsoleDetails>>(Arg.Any<ForzaConsole[]>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.Mapper.SafeMap<IList<SharedConsoleUser>>(Arg.Any<ForzaSharedConsoleUser[]>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.Mapper.SafeMap<IList<LspGroup>>(Arg.Any<Forza.WebServices.FM7.Generated.ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
                this.Mapper.SafeMap<IdentityResultAlpha>(Arg.Any<ApolloPlayerDetails>()).Returns(Fixture.Create<IdentityResultAlpha>());
            }

            public IApolloService ApolloService { get; set; } = Substitute.For<IApolloService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IApolloBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<IApolloBanHistoryProvider>();

            public ApolloPlayerDetailsProvider Build() => new ApolloPlayerDetailsProvider(this.ApolloService, this.Mapper, this.BanHistoryProvider);

            private GetUserBanHistoryV2Output GenerateGetUserBanHistoryOutput()
            {
                // Cannot use random uint value for feature area, we must build our own valid fake data
                var rnd = new Random();
                var fakeBanHistories = new List<ForzaUserBanDescriptionV2>();
                var numberOfFakeBanHistories = rnd.Next(1, 10);
                for (var i = 0; i < numberOfFakeBanHistories; i++)
                {
                    fakeBanHistories.Add(Fixture.Build<ForzaUserBanDescriptionV2>().With(x => x.FeatureAreas, (uint)2).Create());
                }

                return Fixture.Build<GetUserBanHistoryV2Output>().With(x => x.bans, fakeBanHistories.ToArray()).Create();
            }

            private static BanUsersV2Output GenerateBanUsersOutput()
            {
                var fakeBanResults = new List<ForzaUserBanResultV2>
                {
                    Fixture.Build<ForzaUserBanResultV2>().With(x => x.Xuid, (ulong) 111).Create()
                };

                return Fixture.Build<BanUsersV2Output>().With(x => x.banResults, fakeBanResults.ToArray()).Create();
            }
        }
    }
}
