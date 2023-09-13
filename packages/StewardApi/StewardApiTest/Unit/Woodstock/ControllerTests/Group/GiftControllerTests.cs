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
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Group;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.LiveOps.StewardTest.Unit.Woodstock.Helpers;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests.Group
{
    [TestClass]
    public sealed class GiftControllerTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [UnitTest]
        public async Task GiftItemsToUserGroup_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var gift = Fixture.Create<WoodstockGift>();
            gift.Inventory.Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.CarHorns = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.Emotes = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };
            gift.Inventory.QuickChatLines = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 1, Quantity = 1 } };

            // Act.
            async Task<IActionResult> Action() => await controller.GiftItemsToUserGroup(groupId, gift).ConfigureAwait(false);

            // Assert.
            Action().Should().BeAssignableTo<Task<IActionResult>>();
            var result = await Action().ConfigureAwait(false) as OkObjectResult;
            result.Should().NotBeNull();
            result.StatusCode.Should().Be(200);
            result.Value.Should().NotBeNull();
        }

        [TestMethod]
        [UnitTest]
        public void GiftItemsToUserGroups_WithNullGift_Throws()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var groupId = Fixture.Create<int>();

            // Act.
            Func<Task<IActionResult>> action = async () => await controller.GiftItemsToUserGroup(groupId, null).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gift"));
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

            public IWoodstockPlayerInventoryProvider PlayerInventoryProvider { get; set; } = Substitute.For<IWoodstockPlayerInventoryProvider>();
            public IWoodstockItemsProvider ItemsProvider { get; set; } = Substitute.For<IWoodstockItemsProvider>();
            public IRequestValidator<WoodstockGift> GiftRequestValidator { get; set; } = Substitute.For<IRequestValidator<WoodstockGift>>();
            public IRequestValidator<WoodstockMasterInventory> MasterInventoryRequestValidator { get; set; } = Substitute.For<IRequestValidator<WoodstockMasterInventory>>();
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
                this.PlayerInventoryProvider.UpdateGroupInventoriesAsync(Arg.Any<int>(), Arg.Any<WoodstockGift>(), Arg.Any<string>(), Arg.Any<bool>(), Arg.Any<WoodstockProxyBundle>()).Returns(Fixture.Create<GiftResponse<int>>());
            }

            public GiftController Build() => new GiftController(
                this.Mapper,
                this.UserProvider,
                this.PlayerInventoryProvider,
                this.ItemsProvider,
                this.GiftRequestValidator,
                this.MasterInventoryRequestValidator)
            { ControllerContext = this.ControllerContext };
        }
    }
}
