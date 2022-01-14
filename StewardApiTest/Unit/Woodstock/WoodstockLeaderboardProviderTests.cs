using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.Scoreboard.FH5.Generated;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.Services.CMSRetrieval;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock
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
        public void Ctor_WhenPegasusCmsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { PegasusCmsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "pegasusCmsProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenKustoProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { KustoProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "kustoProvider"));
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
        public void Ctor_WhenConfigurationValuesNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies(false);

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentException>().WithMessage($"{TestConstants.ArgumentExceptionMissingSettingMessagePartial}{ConfigurationKeyConstants.PegasusCmsEnvironment}");
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

        private sealed class Dependencies
        {
            public Dependencies(bool validConfiguration = true)
            {
                if (validConfiguration)
                {
                    this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
                }
                else
                {
                    this.Configuration[Arg.Any<string>()].ReturnsNull();
                }
            }

            public IWoodstockService WoodstockService { get; set; } = Substitute.For<IWoodstockService>();

            public PegasusCmsProvider PegasusCmsProvider { get; set; } = new PegasusCmsProvider();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IKustoProvider KustoProvider { get; set; } = Substitute.For<IKustoProvider>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public WoodstockLeaderboardProvider Build() => new WoodstockLeaderboardProvider(this.WoodstockService, this.PegasusCmsProvider,
                    this.KustoProvider, this.Mapper, this.Configuration);
        }
    }
}
