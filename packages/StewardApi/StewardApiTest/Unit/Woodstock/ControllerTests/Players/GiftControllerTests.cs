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
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Players;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.LiveOps.StewardTest.Unit.Woodstock.Helpers;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests.Players
{
    [TestClass]
    public sealed class GiftControllerTests
    {
        private static readonly Fixture Fixture = new Fixture();
        private const ulong ValidXuid = 2535405314408422; // Testing 01001 (lugeiken)

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GiftItemsToPlayersUseBackgroundProcessing_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<WoodstockGroupGift>();
            groupGift.Xuids = new List<ulong>() { ValidXuid };
            groupGift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.CarHorns = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.Emotes = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.QuickChatLines = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GiftItemsToPlayersUseBackgroundProcessing(groupGift).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Should().BeAssignableTo<Task<IActionResult>>();
                var result = await action().ConfigureAwait(true) as ObjectResult;
                result.Should().NotBeNull();
                result.StatusCode.Should().Be(201);
                result.Value.Should().NotBeNull();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GiftItemsToPlayersUseBackgroundProcessing_WithNullGroupGift_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task<IActionResult>>>
            {
                async () => await controller.GiftItemsToPlayersUseBackgroundProcessing(null).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GiftItemsToPlayersUseBackgroundProcessing_WithValidParameters_UseBackgroundProcessing_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupGift = Fixture.Create<WoodstockGroupGift>();
            groupGift.Xuids = new List<ulong>() { ValidXuid };
            groupGift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.CarHorns = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.Emotes = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            groupGift.Inventory.QuickChatLines = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };

            // Act.
            async Task<IActionResult> Action() => await controller.GiftItemsToPlayersUseBackgroundProcessing(groupGift).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<CreatedResult>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GiftItemsToPlayersUseBackgroundProcessing_WithNullGroupGift_UseBackgroundProcessing_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GiftItemsToPlayersUseBackgroundProcessing(null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "groupGift"));
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public IWoodstockPlayerInventoryProvider PlayerInventoryProvider { get; set; } = Substitute.For<IWoodstockPlayerInventoryProvider>();
            public IActionLogger ActionLogger { get; set; } = Substitute.For<IActionLogger>();
            public IJobTracker JobTracker { get; set; } = Substitute.For<IJobTracker>();
            public ILoggingService LoggingService { get; set; } = Substitute.For<ILoggingService>();
            public IScheduler Scheduler { get; set; } = Substitute.For<IScheduler>();
            public IWoodstockItemsProvider ItemsProvider { get; set; } = Substitute.For<IWoodstockItemsProvider>();
            public IRequestValidator<WoodstockGift> GiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<WoodstockGift>>();
            public IRequestValidator<WoodstockMasterInventory> MasterInventoryRequestValidator { get; set; } = Substitute.For<IRequestValidator<WoodstockMasterInventory>>();

            public IRequestValidator<WoodstockGroupGift> GroupGiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<WoodstockGroupGift>>();
            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();
            public IStewardUserProvider UserProvider { get; set; } = Substitute.For<IStewardUserProvider>();

            public Dependencies()
            {
                var fakeMasterInventory = new WoodstockMasterInventory()
                {
                    CreditRewards = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    Cars = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    CarHorns = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    VanityItems = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    Emotes = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                    QuickChatLines = new List<MasterInventoryItem>() { new MasterInventoryItem { Id = 1, Quantity = 1 } },
                };

                this.ControllerContext = new ControllerContext { HttpContext = ProxyControllerHelper.Create(Fixture) };
                this.ItemsProvider.GetCarsAsync<SimpleCar>().Returns(Fixture.Create<IEnumerable<SimpleCar>>());
                this.ItemsProvider.GetMasterInventoryAsync(Arg.Any<string>()).Returns(fakeMasterInventory);
                this.PlayerInventoryProvider.GetPlayerInventoryAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<WoodstockPlayerInventory>());
                this.PlayerInventoryProvider.GetInventoryProfilesAsync(Arg.Any<ulong>(), Arg.Any<string>()).Returns(Fixture.Create<IList<WoodstockInventoryProfile>>());
                this.PlayerInventoryProvider.UpdatePlayerInventoriesAsync(Arg.Any<WoodstockGroupGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<WoodstockProxyBundle>()).Returns(Fixture.Create<IList<GiftResponse<ulong>>>());
            }

            public GiftController Build() => new GiftController(
                this.ItemsProvider,
                this.ActionLogger,
                this.JobTracker,
                this.LoggingService,
                this.Scheduler,
                this.Mapper,
                this.UserProvider,
                this.PlayerInventoryProvider,
                this.MasterInventoryRequestValidator,
                this.GiftRequestValidator,
                this.GroupGiftRequestValidator)
            { ControllerContext = this.ControllerContext };
        }
    }
}
