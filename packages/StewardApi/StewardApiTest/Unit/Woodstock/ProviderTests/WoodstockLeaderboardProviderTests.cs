using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.Scoreboard.FH5_main.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

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
            var dependencies = new Dependencies { PegasusService = null };

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


        

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.PegasusService.GetCarClassesAsync().Returns(Fixture.Create<IEnumerable<CarClass>>());
                this.PegasusService.GetLeaderboardsAsync(Arg.Any<string>()).Returns(Fixture.Create<IEnumerable<Leaderboard>>());
                this.Mapper.SafeMap<IEnumerable<LeaderboardScore>>(Arg.Any<IList<ServicesLiveOps.ForzaRankedLeaderboardRow>>())
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
