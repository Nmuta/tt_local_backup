using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FM8.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Forza.WebServices.FM8.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Steelhead
{
    [TestClass]
    public sealed class SteelheadServiceManagementProviderTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenSteelheadServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadService"));
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
        public async Task GetLspGroupsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<LspGroup>> Action() => await provider.GetLspGroupsAsync(endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<LspGroup>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetCmsRacersCupScheduleAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var environment = Fixture.Create<string>();
            var slotId = Fixture.Create<string>();
            var snapshotId = Fixture.Create<string>();
            var startTime = DateTime.UtcNow.AddMinutes(1);
            var daysForward = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<RacersCupSchedule> Action() => await provider.GetCmsRacersCupScheduleAsync(environment, slotId, snapshotId, startTime, daysForward, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<RacersCupSchedule>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetCmsRacersCupScheduleAsync_WithNullEndpoint_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var environment = Fixture.Create<string>();
            var slotId = Fixture.Create<string>();
            var snapshotId = Fixture.Create<string>();
            var startTime = DateTime.UtcNow.AddMinutes(1);
            var daysForward = Fixture.Create<int>();


            // Act.
            Func<Task<RacersCupSchedule>> action = async () => await provider.GetCmsRacersCupScheduleAsync(environment, slotId, snapshotId, startTime, daysForward, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "endpoint"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SteelheadService.GetUserGroupsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserGroupsOutput>());
                this.SteelheadService.GetCmsRacersCupScheduleAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<LiveOpsService.GetCMSRacersCupScheduleOutput>());
                this.Mapper.Map<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
                this.Mapper.Map<RacersCupSchedule>(Arg.Any<ForzaRacersCupScheduleData>()).Returns(Fixture.Create<RacersCupSchedule>());
            }

            public ISteelheadService SteelheadService { get; set; } = Substitute.For<ISteelheadService>();

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public SteelheadServiceManagementProvider Build() => new SteelheadServiceManagementProvider(this.SteelheadService, this.LoggingService, this.Mapper);
        }
    }
}
