using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Controllers.V2.Apollo;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Data;

namespace Turn10.LiveOps.StewardTest.Unit.Apollo.ControllerTests.V2
{
    [TestClass]
    public sealed class ApolloGiftingControllerTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public void Ctor_WhenApolloPlayerDetailsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloPlayerDetailsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerDetailsProvider"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenApolloPlayerInventoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ApolloPlayerInventoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventoryProvider"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenConfigurationNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Configuration = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "configuration"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenSchedulerNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Scheduler = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "scheduler"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenJobTrackerNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { JobTracker = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "jobTracker"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenConfigurationValuesNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies(false);

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentException>().WithMessage($"{TestConstants.ArgumentExceptionMissingSettingMessagePartial}{ConfigurationKeyConstants.KeyVaultUrl}");
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

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

                var httpContext = new DefaultHttpContext();
                httpContext.Request.Path = TestConstants.TestRequestPath;
                httpContext.Request.Host = new HostString(TestConstants.TestRequestHost);
                httpContext.Request.Scheme = TestConstants.TestRequestScheme;

                var claims = new List<Claim> { new Claim("http://schemas.microsoft.com/identity/claims/objectidentifier", "unit-test-azure-object-id") };
                var claimsIdentities = new List<ClaimsIdentity> { new ClaimsIdentity(claims) };
                httpContext.User = new ClaimsPrincipal(claimsIdentities);

                this.ControllerContext = new ControllerContext { HttpContext = httpContext };

                this.ApolloPlayerDetailsProvider.GetPlayerIdentityAsync(Arg.Any<IdentityQueryAlpha>(), Arg.Any<string>()).Returns(Fixture.Create<IdentityResultAlpha>());
                this.ApolloPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<ApolloPlayerDetails>());
                this.ApolloPlayerDetailsProvider.GetPlayerDetailsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<ApolloPlayerDetails>());
                this.ApolloPlayerDetailsProvider.DoesPlayerExistAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(true);
                this.ApolloPlayerDetailsProvider.GetUserBanHistoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<LiveOpsBanHistory>>());
                this.ApolloPlayerDetailsProvider.GetUserBanSummariesAsync(Arg.Any<IList<ulong>>(), Arg.Any<string>()).Returns(Fixture.Create<IList<BanSummary>>());
                this.ApolloPlayerDetailsProvider.GetConsolesAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<ConsoleDetails>>());
                this.ApolloPlayerDetailsProvider.GetSharedConsoleUsersAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<IList<SharedConsoleUser>>());
                this.ApolloPlayerDetailsProvider.GetUserFlagsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<ApolloUserFlags>());
                this.ApolloPlayerDetailsProvider.DoesPlayerExistAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(true);
                this.ApolloPlayerDetailsProvider.DoesPlayerExistAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(true);
                this.ApolloPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<ApolloPlayerInventory>());
                this.ApolloPlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<ApolloPlayerInventory>());
                this.ApolloPlayerInventoryProvider.GetInventoryProfilesAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<ApolloInventoryProfile>>());
                this.ApolloPlayerInventoryProvider.UpdateGroupInventoriesAsync(Arg.Any<int>(), Arg.Any<ApolloGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<string>()).Returns(Fixture.Create<GiftResponse<int>>()); ;
                this.ApolloPlayerInventoryProvider.UpdatePlayerInventoriesAsync(Arg.Any<ApolloGroupGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<string>()).Returns(Fixture.Create<IList<GiftResponse<ulong>>>());
            }

            public IActionLogger ActionLogger { get; set; } = Substitute.For<IActionLogger>();

            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();

            public IApolloPlayerDetailsProvider ApolloPlayerDetailsProvider { get; set; } = Substitute.For<IApolloPlayerDetailsProvider>();

            public IApolloPlayerInventoryProvider ApolloPlayerInventoryProvider { get; set; } = Substitute.For<IApolloPlayerInventoryProvider>();

            public IApolloStorefrontProvider StorefrontProvider { get; set; } = Substitute.For<IApolloStorefrontProvider>();

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();

            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();

            public IMapper Mapper { get; set; } = Substitute.ForPartsOf<Mapper>(new MapperConfiguration(mc =>
            {
                mc.AddProfile(new ApolloProfileMapper());
                mc.AllowNullCollections = true;
            }));

            public ApolloGiftingController Build() => new ApolloGiftingController(
                this.ActionLogger,
                this.LoggingService,
                this.ApolloPlayerDetailsProvider,
                this.ApolloPlayerInventoryProvider,
                this.StorefrontProvider,
                this.Configuration,
                this.Scheduler,
                this.JobTracker,
                this.Mapper)
            { ControllerContext = this.ControllerContext };
        }
    }
}
