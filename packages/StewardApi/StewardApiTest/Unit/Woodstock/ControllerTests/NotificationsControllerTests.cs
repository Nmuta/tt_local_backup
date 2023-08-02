using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using AutoMapper;
using Turn10.Services.LiveOps.FH5_main.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardTest.Unit.Woodstock.Helpers;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
{
    [TestClass]
    public sealed class NotificationsControllerTests
    {
        private static readonly Fixture Fixture = new Fixture();
        private static readonly ulong InvalidXuid = 1234;

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteAllNotifications_InvalidXuid_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = InvalidXuid;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.DeleteAllPlayerNotifications(xuid).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<BadRequestStewardException>()
                .WithMessage($"Provided XUID does not meet requirements: {xuid}");
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public Dependencies()
            {
                this.ControllerContext = new ControllerContext { HttpContext = ProxyControllerHelper.Create(Fixture) };
            }

            public NotificationsController Build() => new NotificationsController()
            { ControllerContext = this.ControllerContext };
        }
    } 
}
