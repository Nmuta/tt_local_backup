using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH5_main.Generated;
using Forza.Scoreboard.FH5_main.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ProviderTests
{
    [TestClass]
    public sealed class WoodstockLeaderboardProviderTests
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
        public void Ctor_WhenPegasusServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { PegasusService =  null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "pegasusService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenLoggingServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { LoggingService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "loggingService"));
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
        public void GetLeaderboardScoresAsync_WithNullEndpoint_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var scoreboardType = Fixture.Create<ScoreboardType>();
            var scoreType = Fixture.Create<ScoreType>();
            var trackId = Fixture.Create<int>();
            var pivotId = Fixture.Create<string>();
            var startAt = 0;
            var maxResults = Fixture.Create<int>();


            // Act.
            Func<Task<IEnumerable<LeaderboardScore>>> action = async () => 
                await provider.GetLeaderboardScoresAsync(scoreboardType, scoreType, trackId, pivotId, startAt, maxResults, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "endpoint"));

        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetLeaderboardScoresAsync_WithNullPivotId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var scoreboardType = Fixture.Create<ScoreboardType>();
            var scoreType = Fixture.Create<ScoreType>();
            var trackId = Fixture.Create<int>();
            var startAt = 0;
            var maxResults = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IEnumerable<LeaderboardScore>>> action = async () =>
                await provider.GetLeaderboardScoresAsync(scoreboardType, scoreType, trackId, null, startAt, maxResults, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "pivotId"));

        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetLeaderboardScoresAsyncWithXuid_WithNullEndpoint_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var scoreboardType = Fixture.Create<ScoreboardType>();
            var scoreType = Fixture.Create<ScoreType>();
            var trackId = Fixture.Create<int>();
            var pivotId = Fixture.Create<string>();
            var maxResults = Fixture.Create<int>();


            // Act.
            Func<Task<IEnumerable<LeaderboardScore>>> action = async () =>
                await provider.GetLeaderboardScoresAsync(xuid, scoreboardType, scoreType, trackId, pivotId, maxResults, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "endpoint"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetLeaderboardScoresAsyncWithXuid_WithNullPivotId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var scoreboardType = Fixture.Create<ScoreboardType>();
            var scoreType = Fixture.Create<ScoreType>();
            var trackId = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IEnumerable<LeaderboardScore>>> action = async () =>
                await provider.GetLeaderboardScoresAsync(xuid, scoreboardType, scoreType, trackId, null, maxResults, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "pivotId"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetLeaderboardScoresAsyncWithXuid_WithValidParams_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var scoreboardType = Fixture.Create<ScoreboardType>();
            var scoreType = Fixture.Create<ScoreType>();
            var trackId = Fixture.Create<int>();
            var pivotId = Fixture.Create<string>();
            var maxResults = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IEnumerable<LeaderboardScore>> Action() =>
                await provider.GetLeaderboardScoresAsync(xuid, scoreboardType, scoreType, trackId, pivotId, maxResults, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.ToArray().Should().BeOfType<LeaderboardScore[]>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteLeaderboardScoresAsync_WithNullEndpoint_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var scoreIds = Fixture.Create<Guid[]>();

            // Act.
            Func<Task> action = async () =>
                await provider.DeleteLeaderboardScoresAsync(scoreIds, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "endpoint"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteLeaderboardScoresAsync_WithEmptyArrayOfScoreIds_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task> action = async () =>
                await provider.DeleteLeaderboardScoresAsync(new Guid[]{}, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<BadRequestStewardException>().WithMessage($"Cannot provided empty array of score ids.");
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.WoodstockService
                    .GetLeaderboardScoresAsync(Arg.Any<ForzaSearchLeaderboardsParameters>(), Arg.Any<int>(),
                        Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<ForzaRankedLeaderboardRow>>());
                this.PegasusService.GetCarClassesAsync().Returns(Fixture.Create<IEnumerable<CarClass>>());
                this.PegasusService.GetLeaderboardsAsync().Returns(Fixture.Create<IEnumerable<Leaderboard>>());
                this.Mapper.Map<IEnumerable<LeaderboardScore>>(Arg.Any<IList<ForzaRankedLeaderboardRow>>())
                    .Returns(Fixture.Create<IEnumerable<LeaderboardScore>>());
            }

            public IWoodstockService WoodstockService { get; set; } = Substitute.For<IWoodstockService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IWoodstockPegasusService PegasusService { get; set; } = Substitute.For<IWoodstockPegasusService>();

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public WoodstockLeaderboardProvider Build() => new WoodstockLeaderboardProvider(this.WoodstockService, this.PegasusService, this.LoggingService, this.Mapper);
        }
    }
}
