using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
{
    [TestClass]
    public sealed class LoyaltyRewardsControllerTests
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
        public void Ctor_WhenMapperNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { mapper = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "mapper"));
        }

        [TestMethod]
        [UnitTest]
        [Ignore] // TODO: Investigate testing of V2 controllers that rely on proxy interfaces.
        public async Task GetHasPlayedRecord_ShouldReturnValidValue()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();

            // Act.
            async Task<IActionResult> action() => await controller.GetHasPlayedRecord(xuid, profileId.ToString()).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            result.Value.ShouldNotBeNull();
        }

        [TestMethod]
        [UnitTest]
        public void GetHasPlayedRecord_WithNullProfileId_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetHasPlayedRecord(xuid, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "externalProfileId"));
        }

        [TestMethod]
        [UnitTest]
        public void GetHasPlayedRecord_WithNonGuidProfileId_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = "abcde";

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GetHasPlayedRecord(xuid, profileId).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"External Profile ID provided is not a valid Guid: (externalProfileId: {profileId})");
        }

        [TestMethod]
        [UnitTest]
        [Ignore] // TODO: Investigate testing of V2 controllers that rely on proxy interfaces.
        public void ResendLoyaltyRewards_DoesNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();
            var titles = new string[] { "FM5" };

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.ResendLoyaltyRewards(xuid, profileId.ToString(), titles).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [UnitTest]
        public void ResendLoyaltyRewards_WithNullProfileId_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();
            var titles = new string[] { "FM5" };

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.ResendLoyaltyRewards(xuid, null, titles).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "externalProfileId"));
        }

        [TestMethod]
        [UnitTest]
        public void ResendLoyaltyRewards_WithNonGuidProfileId_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = "abcde";
            var titles = new string[] { "FM5" };

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.ResendLoyaltyRewards(xuid, profileId, titles).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<InvalidArgumentsStewardException>().WithMessage($"External Profile ID provided is not a valid Guid: (externalProfileId: {profileId})");
        }

        [TestMethod]
        [UnitTest]
        public void ResendLoyaltyRewards_WithNullTitles_ShouldThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var profileId = Fixture.Create<Guid>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.ResendLoyaltyRewards(xuid, profileId.ToString(), null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gameTitles"));
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public Dependencies()
            {
                var httpContext = new DefaultHttpContext();
                httpContext.Request.Path = TestConstants.TestRequestPath;
                httpContext.Request.Host = new HostString(TestConstants.TestRequestHost);
                httpContext.Request.Scheme = TestConstants.TestRequestScheme;

                var claims = new List<Claim> { new Claim("http://schemas.microsoft.com/identity/claims/objectidentifier", "unit-test-azure-object-id") };
                var claimsIdentities = new List<ClaimsIdentity> { new ClaimsIdentity(claims) };
                httpContext.User = new ClaimsPrincipal(claimsIdentities);

                this.ControllerContext = new ControllerContext { HttpContext = httpContext };

                this.userManagementService.GetHasPlayedRecord(Arg.Any<ulong>(), Arg.Any<Guid>()).Returns(Fixture.Create<UserManagementService.GetHasPlayedRecordOutput>());
            }
            public IUserManagementService userManagementService { get; set; } = Substitute.For<IUserManagementService>();

            public IMapper mapper { get; set; } = Substitute.ForPartsOf<Mapper>(new MapperConfiguration(mc =>
            {
                mc.AddProfile(new WoodstockProfileMapper());
                mc.AllowNullCollections = true;
            }));

            public ILoggingService loggingService { get; set; } = Substitute.For<ILoggingService>();

            public LoyaltyRewardsController Build() => new LoyaltyRewardsController(
                this.mapper, this.loggingService)
            { ControllerContext = this.ControllerContext };
        }
    }
}
