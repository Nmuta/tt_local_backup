using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FM7.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
using Xls.WebServices.FM7.Generated;
using static Forza.WebServices.FM7.Generated.UserService;
using static Xls.WebServices.FM7.Generated.UserService;

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
        public void GetPlayerIdentitiesAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var query = Fixture.Create<IdentityQueryAlpha>();

            // Act.
            async Task<IdentityResultAlpha> Action() => await provider.GetPlayerIdentityAsync(query).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<IdentityResultAlpha>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerIdentitiesAsync_WithNullQuery_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            Func<Task<IdentityResultAlpha>> action = async () => await provider.GetPlayerIdentityAsync(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "query"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerDetailsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var gamertag = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task<ApolloPlayerDetails>>>
            {
                async () => await provider.GetPlayerDetailsAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<ApolloPlayerDetails>();
            }
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
            var xuid = Fixture.Create<ulong>();
            var gamertag = Fixture.Create<string>();

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
                var result = action().Result;
                result.Should().BeOfType<List<LiveOpsBanHistory>>();
            }
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
        public void GetLspGroupsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var startIndex = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();

            // Act.
            async Task<IList<LspGroup>> Action() => await provider.GetLspGroupsAsync(startIndex, maxResults).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<List<LspGroup>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetUserFlagsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            async Task<ApolloUserFlags> Action() => await provider.GetUserFlagsAsync(xuid).ConfigureAwait(false);

            // Assert.
            Action().Result.Should().BeOfType<ApolloUserFlags>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SetUserFlagsAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var userFlags = Fixture.Create<ApolloUserFlags>();

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

            return new List<ApolloBanParameters> {newParams};
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.ApolloService.LiveOpsGetUserDataByGamertagAsync(Arg.Any<string>()).Returns(Fixture.Create<LiveOpsGetUserDataByGamertagOutput>());
                this.ApolloService.LiveOpsGetUserDataByXuidAsync(Arg.Any<ulong>()).Returns(Fixture.Create<LiveOpsGetUserDataByXuidOutput>());
                this.ApolloService.BanUsersAsync(Arg.Any<ForzaUserBanParameters[]>()).Returns(GenerateBanUsersOutput());
                this.ApolloService.GetUserBanSummariesAsync(Arg.Any<ulong[]>(), Arg.Any<int>()).Returns(Fixture.Create<GetUserBanSummariesOutput>());
                this.ApolloService.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(this.GenerateGetUserBanHistoryOutput());
                this.ApolloService.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<GetConsolesOutput>());
                this.ApolloService.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<GetSharedConsoleUsersOutput>());
                this.ApolloService.GetIsUnderReviewAsync(Arg.Any<ulong>()).Returns(Fixture.Create<GetIsUnderReviewOutput>());
                this.ApolloService.GetUserGroupMembershipsAsync(Arg.Any<ulong>(), Arg.Any<int[]>(), Arg.Any<int>()).Returns(Fixture.Create<GetUserGroupMembershipsOutput>());
                this.ApolloService.GetUserGroupsAsync(Arg.Any<int>(), Arg.Any<int>()).Returns(Fixture.Create<GetUserGroupsOutput>());
                this.Mapper.Map<ApolloPlayerDetails>(Arg.Any<CompositeUser>()).Returns(Fixture.Create<ApolloPlayerDetails>());
                this.Mapper.Map<IList<BanResult>>(Arg.Any<ForzaUserBanResult[]>()).Returns(Fixture.Create<IList<BanResult>>());
                this.Mapper.Map<IList<BanSummary>>(Arg.Any<ForzaUserBanSummary[]>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.Mapper.Map<List<BanDescription>>(Arg.Any<ForzaUserBanDescription[]>()).Returns(Fixture.Create<IList<BanDescription>>());
                this.Mapper.Map<IList<ConsoleDetails>>(Arg.Any<ForzaConsole[]>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.Mapper.Map<IList<SharedConsoleUser>>(Arg.Any<ForzaSharedConsoleUser[]>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.Mapper.Map<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
                this.Mapper.Map<IdentityResultAlpha>(Arg.Any<ApolloPlayerDetails>()).Returns(Fixture.Create<IdentityResultAlpha>());
            }

            public IApolloService ApolloService { get; set; } = Substitute.For<IApolloService>();
            
            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IApolloBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<IApolloBanHistoryProvider>();

            public ApolloPlayerDetailsProvider Build() => new ApolloPlayerDetailsProvider(this.ApolloService, this.Mapper, this.BanHistoryProvider);

            private GetUserBanHistoryOutput GenerateGetUserBanHistoryOutput()
            {
                // Cannot use random uint value for feature area, we must build our own valid fake data
                var rnd = new Random();
                var fakeBanHistories = new List<ForzaUserBanDescription>();
                var numberOfFakeBanHistories = rnd.Next(1, 10);
                for (var i = 0; i < numberOfFakeBanHistories; i++)
                {
                    fakeBanHistories.Add(Fixture.Build<ForzaUserBanDescription>().With(x => x.FeatureAreas, (uint)2).Create());
                }

                return Fixture.Build<GetUserBanHistoryOutput>().With(x => x.bans, fakeBanHistories.ToArray()).Create();
            }

            private static BanUsersOutput GenerateBanUsersOutput()
            {
                var fakeBanResults = new List<ForzaUserBanResult>
                {
                    Fixture.Build<ForzaUserBanResult>().With(x => x.Xuid, (ulong) 111).Create()
                };

                return Fixture.Build<BanUsersOutput>().With(x => x.banResults, fakeBanResults.ToArray()).Create();
            }
        }
    }
}
