﻿using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FM8.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.Services.LiveOps.FM8.Generated;

using UserManagementService = Turn10.Services.LiveOps.FM8.Generated.UserManagementService;
using LiveOpsService = Forza.WebServices.FM8.Generated.LiveOpsService;

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

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.SteelheadService.GetUserGroupsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<UserManagementService.GetUserGroupsOutput>());
                this.Mapper.Map<IList<LspGroup>>(Arg.Any<ForzaUserGroup[]>()).Returns(Fixture.Create<IList<LspGroup>>());
            }

            public ISteelheadService SteelheadService { get; set; } = Substitute.For<ISteelheadService>();

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public ISteelheadPegasusService SteelheadPegasusService { get; set; } =
                Substitute.For<ISteelheadPegasusService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public SteelheadServiceManagementProvider Build() => new SteelheadServiceManagementProvider(this.SteelheadService, this.LoggingService, this.SteelheadPegasusService, this.Mapper);
        }
    }
}
