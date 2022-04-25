﻿using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
{
    [TestClass]
    public sealed class WoodstockPlayerControllerTests
    {
        private static readonly Fixture Fixture = new Fixture();
        private static readonly ulong ValidXuid = 2535405314408422; // Testing 01001 (lugeiken)
        private static readonly ulong InvalidXuid = 1234;

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
        public void Ctor_WhenNotificationProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { NotificationProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "notificationProvider"));
        }


        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteAllNotifications_InvalidXuid_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var xuid = InvalidXuid;

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.DeleteAllNotifications(xuid).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<BadRequestStewardException>()
                .WithMessage($"Provided XUID does not meet requirements: {xuid}");
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public Dependencies(bool validConfiguration = true)
            {
                var httpContext = new DefaultHttpContext();
                httpContext.Request.Path = TestConstants.TestRequestPath;
                httpContext.Request.Host = new HostString(TestConstants.TestRequestHost);
                httpContext.Request.Scheme = TestConstants.TestRequestScheme;

                var claims = new List<Claim> { new Claim("http://schemas.microsoft.com/identity/claims/objectidentifier", "unit-test-azure-object-id") };
                var claimsIdentities = new List<ClaimsIdentity> { new ClaimsIdentity(claims) };
                httpContext.User = new ClaimsPrincipal(claimsIdentities);

                this.ControllerContext = new ControllerContext { HttpContext = httpContext };

                var fakeMasterInventory = new WoodstockMasterInventory()
                {
                    CreditRewards = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    Cars = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    CarHorns = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    VanityItems = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    Emotes = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    QuickChatLines = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                };

                this.NotificationProvider.DeleteAllUserNotificationsAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Task.CompletedTask);
            }
            public IWoodstockNotificationProvider NotificationProvider { get; set; } = Substitute.For<IWoodstockNotificationProvider>();

            public WoodstockPlayerController Build() => new WoodstockPlayerController(this.NotificationProvider)
            { ControllerContext = this.ControllerContext };
        }
    }
}
