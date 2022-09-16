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
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.UserGroup;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using static Turn10.Services.LiveOps.FH5_main.Generated.UserManagementService;
using Microsoft.Extensions.Configuration;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services;

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
            var playerList = new UpdateUserGroupInput() { Xuids = xuids.ToArray() };
            var userGroupId = Fixture.Create<int>();

            // Act.
            Func<Task> action = async () => await controller.AddUsersToGroup(userGroupId, false, playerList).ConfigureAwait(false);

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
            var playerList = new UpdateUserGroupInput() { Xuids = xuids.ToArray() };
            var userGroupId = Fixture.Create<int>();

            // Act.
            Func<Task> action = async () => await controller.RemoveUsersFromGroup(userGroupId, false, playerList).ConfigureAwait(false);

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
            var playerList = new UpdateUserGroupInput() { Xuids = xuids.ToArray() };
            var userGroupId = Fixture.Create<int>();

            // Act.
            Func<Task> action = async () => await controller.AddUsersToGroup(userGroupId, true, playerList).ConfigureAwait(false);

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
            var playerList = new UpdateUserGroupInput() { Xuids = xuids.ToArray() };
            var userGroupId = Fixture.Create<int>();

            // Act.
            Func<Task> action = async () => await controller.RemoveUsersFromGroup(userGroupId, true, playerList).ConfigureAwait(false);

            // Assert.
            action.Should().NotThrow();
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();
            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();
            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();


            public Dependencies()
            {
                this.ControllerContext = new ControllerContext { HttpContext = ProxyControllerHelper.Create(Fixture) };
            }

            public UserGroupController Build() => new UserGroupController(
                this.JobTracker,
                this.Scheduler,
                this.LoggingService)
            { ControllerContext = this.ControllerContext };
        }
    } 
}
