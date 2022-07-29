using AutoFixture;
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
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.UserGroup;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
{
    [TestClass]
    public sealed class WoodstockUserGroupTests
    {
        private static readonly Fixture Fixture = new Fixture();
        private static readonly ulong ValidXuid = 2535405314408422; // Testing 01001 (lugeiken)

        [TestMethod]
        [TestCategory("Unit")]
        public async Task CreateUserGroup_ShouldReturnValidValue()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var userGroupName = Fixture.Create<string>();

            // Act.
            async Task<IActionResult> action() => await controller.CreateUserGroup(userGroupName).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false) as OkObjectResult;
            result.Value.ShouldNotBeNull();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task AddUsersToGroup_ShouldNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuids = new List<ulong>() { ValidXuid };
            var userGroupId = Fixture.Create<int>();

            // Act.
            Func<Task> action = async () => await controller.AddUsersToGroup(userGroupId, xuids).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task RemoveUsersFromGroup_ShouldNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuids = new List<ulong>() { ValidXuid };
            var userGroupId = Fixture.Create<int>();

            // Act.
            Func<Task> action = async () => await controller.RemoveUsersFromGroup(userGroupId, xuids).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void AddUsersToGroup_UseBackgroundProcessing_ShouldNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuids = new List<ulong>() { ValidXuid };
            var userGroupId = Fixture.Create<int>();

            // Act.
            Func<Task> action = async () => await controller.AddUsersToGroupUseBackgroundProcessing(userGroupId, xuids).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void RemoveUsersFromGroup_UseBackgroundProcessing_ShouldNotThrow()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuids = new List<ulong>() { ValidXuid };
            var userGroupId = Fixture.Create<int>();

            // Act.
            Func<Task> action = async () => await controller.RemoveUsersFromGroupUseBackgroundProcessing(userGroupId, xuids).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public IWoodstockServiceManagementProvider serviceManagementProvider { get; set; } = Substitute.For<IWoodstockServiceManagementProvider>();
            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();
            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();
            public IActionLogger ActionLogger { get; set; } = Substitute.For<IActionLogger>();


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

                this.serviceManagementProvider.CreateLspGroupAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<LspGroup>());
                this.serviceManagementProvider.AddUsersToLspGroupAsync(Arg.Any<List<ulong>>(), Arg.Any<int>(), Arg.Any<string>())
                    .Returns(new List<UserGroupManagementResponse>());
                this.serviceManagementProvider.RemoveUsersFromLspGroupAsync(Arg.Any<List<ulong>>(), Arg.Any<int>(), Arg.Any<string>())
                    .Returns(new List<UserGroupManagementResponse>());
            }

            public UserGroupController Build() => new UserGroupController(
                this.serviceManagementProvider,
                this.JobTracker,
                this.ActionLogger,
                this.Scheduler)
            { ControllerContext = this.ControllerContext };
        }
    } 
}
