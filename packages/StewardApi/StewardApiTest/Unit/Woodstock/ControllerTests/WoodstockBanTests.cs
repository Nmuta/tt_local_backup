using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.LiveOps.StewardTest.Unit.Woodstock.Helpers;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
{
    [TestClass]
    public sealed class WoodstockBanTests
    {
        private static readonly Fixture Fixture = new Fixture();
        private static readonly ulong ValidXuid = 2535405314408422; // Testing 01001 (lugeiken)

        [TestMethod]
        [TestCategory("Unit")]
        public async Task BanPlayers_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var banParameters = GenerateBanParameters();

            // Act.
            async Task<IActionResult> Action() => await controller.BanPlayers(banParameters, false).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            Action().Should().NotBeNull();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            var details = result.Value as IList<BanResult>;
            details.Should().NotBeNull();
            details.Should().BeOfType<List<BanResult>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanPlayers_WithNullBanParameters_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(null, false).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banInput"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanPlayers_WithValidParameters_UseBackgroundProcessing_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var banParameters = GenerateBanParameters();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(banParameters, true).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void BanPlayers_WithNullBanParameters_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.BanPlayers(null, true).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "banInput"));
        }

        private IList<V2BanParametersInput> GenerateBanParameters()
        {
            return new List<V2BanParametersInput>
            {
                new V2BanParametersInput {
                    Xuid = ValidXuid,
                    Reason = "Testing",
                    ReasonGroupName = "Developer",
                    DeleteLeaderboardEntries = false,
                    Override = false,
                    OverrideBanConsoles = false,
                    OverrideDurationPermanent = false,
                    OverrideDuration = new TimeSpan(0,0,0),
                },
                new V2BanParametersInput {
                    Xuid = ValidXuid,
                    Reason = "Testing",
                    ReasonGroupName = "Developer",
                    DeleteLeaderboardEntries = false,
                    Override = false,
                    OverrideBanConsoles = false,
                    OverrideDurationPermanent = false,
                    OverrideDuration = new TimeSpan(0,0,0),
                },
                new V2BanParametersInput {
                    Xuid = ValidXuid,
                    Reason = "Testing",
                    ReasonGroupName = "Developer",
                    DeleteLeaderboardEntries = false,
                    Override = true,
                    OverrideBanConsoles = false,
                    OverrideDurationPermanent = false,
                    OverrideDuration = new TimeSpan(12,0,0),
                }
            };
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();
            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();
            public IWoodstockPegasusService PegasusService { get; set; } = Substitute.For<IWoodstockPegasusService>();
            public IRequestValidator<V2BanParametersInput> BanParametersRequestValidator { get; set; } = Substitute.For<IRequestValidator<V2BanParametersInput>>();
            public IWoodstockBanHistoryProvider BanHistoryProvider { get; set; } = Substitute.For<IWoodstockBanHistoryProvider>();
            public IActionLogger ActionLogger { get; set; } = Substitute.For<IActionLogger>();
            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();
            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();


            public Dependencies()
            {
                this.ControllerContext = new ControllerContext { HttpContext = ProxyControllerHelper.Create(Fixture) };
                this.Mapper.SafeMap<BanConfiguration>(Arg.Any<BanConfiguration>()).Returns(Fixture.Create<BanConfiguration>());
                this.Mapper.SafeMap<IList<ForzaUserBanParametersV2>>(Arg.Any<IList<V2BanParametersInput>>()).Returns(Fixture.Create<IList<ForzaUserBanParametersV2>>());
                this.Mapper.SafeMap<IList<BanResult>>(Arg.Any<ForzaUserBanResult[]>()).Returns(Fixture.Create<IList<BanResult>>());
            }

            public BanController Build() => new BanController(
                PegasusService,
                Mapper,
                BanParametersRequestValidator,
                BanHistoryProvider,
                ActionLogger,
                JobTracker,
                LoggingService,
                Scheduler)
            { ControllerContext = this.ControllerContext };
        }
    }
}
