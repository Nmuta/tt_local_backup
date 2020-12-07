﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.WebServices.FMG.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity;
using static Forza.WebServices.FMG.Generated.UserService;

namespace Turn10.LiveOps.StewardTest.Unit.Gravity
{
    [TestClass]
    public sealed class GravityPlayerInventoryProviderTests
    {
        private static readonly Fixture Fixture = new Fixture();

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
        public void Ctor_WhenGravityUserServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GravityUserService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gravityUserService"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenGravityUserInventoryServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GravityUserInventoryService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "gravityUserInventoryService"));
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
        public void Ctor_WhenGiftHistoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { GiftHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "giftHistoryProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerInventoryAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var profileId = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var t10Id = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task<GravityPlayerInventory>>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(xuid, profileId).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id, profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action().Result.Should().BeOfType<GravityPlayerInventory>();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerInventoryAsync_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var profileId = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerInventoryAsync(null).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(null, profileId).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(TestConstants.Empty, profileId).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(TestConstants.WhiteSpace, profileId).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void GetPlayerInventoryAsync_WithNullEmptyWhitespaceProfileId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.GetPlayerInventoryAsync(xuid, null).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(xuid, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(xuid, TestConstants.WhiteSpace).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id, null).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.GetPlayerInventoryAsync(t10Id, TestConstants.WhiteSpace).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "profileId"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void CreateOrReplacePlayerInventoryAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var requestingAgent = Fixture.Create<string>();
            var playerInventory = Fixture.Create<GravityPlayerInventory>();
            var grantStartingPackage = Fixture.Create<bool>();
            var preserveBookingItems = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.CreateOrReplacePlayerInventoryAsync(xuid, playerInventory, requestingAgent, grantStartingPackage, preserveBookingItems).ConfigureAwait(false),
                async () => await provider.CreateOrReplacePlayerInventoryAsync(t10Id, playerInventory, requestingAgent, grantStartingPackage, preserveBookingItems).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void CreateOrReplacePlayerInventoryAsync_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var playerInventory = Fixture.Create<GravityPlayerInventory>();
            var requestingAgent = Fixture.Create<string>();
            var grantStartingPackage = Fixture.Create<bool>();
            var preserveBookingItems = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.CreateOrReplacePlayerInventoryAsync(null, playerInventory, requestingAgent, grantStartingPackage, preserveBookingItems).ConfigureAwait(false),
                async () => await provider.CreateOrReplacePlayerInventoryAsync(TestConstants.Empty, playerInventory, requestingAgent, grantStartingPackage, preserveBookingItems).ConfigureAwait(false),
                async () => await provider.CreateOrReplacePlayerInventoryAsync(TestConstants.WhiteSpace, playerInventory, requestingAgent, grantStartingPackage, preserveBookingItems).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void CreateOrReplacePlayerInventoryAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var playerInventory = Fixture.Create<GravityPlayerInventory>();
            var t10Id = Fixture.Create<string>();
            var grantStartingPackage = Fixture.Create<bool>();
            var preserveBookingItems = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.CreateOrReplacePlayerInventoryAsync(t10Id, playerInventory, null, grantStartingPackage, preserveBookingItems).ConfigureAwait(false),
                async () => await provider.CreateOrReplacePlayerInventoryAsync(t10Id, playerInventory, TestConstants.Empty, grantStartingPackage, preserveBookingItems).ConfigureAwait(false),
                async () => await provider.CreateOrReplacePlayerInventoryAsync(t10Id, playerInventory, TestConstants.WhiteSpace, grantStartingPackage, preserveBookingItems).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void CreateOrReplacePlayerInventoryAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var t10Id = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();
            var grantStartingPackage = Fixture.Create<bool>();
            var preserveBookingItems = Fixture.Create<bool>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.CreateOrReplacePlayerInventoryAsync(xuid, null, requestingAgent, grantStartingPackage, preserveBookingItems).ConfigureAwait(false),
                async () => await provider.CreateOrReplacePlayerInventoryAsync(t10Id, null, requestingAgent, grantStartingPackage, preserveBookingItems).ConfigureAwait(false)
            };
            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventory"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoryAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();
            var playerInventory = Fixture.Create<GravityPlayerInventory>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, playerInventory, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, playerInventory, requestingAgent).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoryAsync_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var playerInventory = Fixture.Create<GravityPlayerInventory>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(null, playerInventory, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(TestConstants.Empty, playerInventory, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(TestConstants.WhiteSpace, playerInventory, requestingAgent).ConfigureAwait(false)
            };
            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoryAsync_WithNullEmptyWhitespaceRequestingAgent_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var playerInventory = Fixture.Create<GravityPlayerInventory>();
            var t10Id = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, playerInventory, null).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, playerInventory, TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, playerInventory, TestConstants.WhiteSpace).ConfigureAwait(false)
            };
            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "requestingAgent"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void UpdatePlayerInventoryAsync_WithNullPlayerInventory_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var t10Id = Fixture.Create<string>();
            var requestingAgent = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.UpdatePlayerInventoryAsync(xuid, null, requestingAgent).ConfigureAwait(false),
                async () => await provider.UpdatePlayerInventoryAsync(t10Id, null, requestingAgent).ConfigureAwait(false)
            };
            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "playerInventory"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeletePlayerInventoryAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var t10Id = Fixture.Create<string>();
            var xuid = Fixture.Create<ulong>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.DeletePlayerInventoryAsync(xuid).ConfigureAwait(false),
                async () => await provider.DeletePlayerInventoryAsync(t10Id).ConfigureAwait(false)
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeletePlayerInventoryAsync_WithNullEmptyWhitespaceT10Id_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.DeletePlayerInventoryAsync(null).ConfigureAwait(false),
                async () => await provider.DeletePlayerInventoryAsync(TestConstants.Empty).ConfigureAwait(false),
                async () => await provider.DeletePlayerInventoryAsync(TestConstants.WhiteSpace).ConfigureAwait(false)
            };
            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "t10Id"));
            }
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.GravityUserService.LiveOpsGetUserDetailsByXuidAsync(Arg.Any<ulong>(), Arg.Any<int>()).Returns(Fixture.Create<LiveOpsGetUserDetailsByXuidOutput>());
                this.GravityUserService.LiveOpsGetUserDetailsByT10IdAsync(Arg.Any<string>()).Returns(Fixture.Create<LiveOpsGetUserDetailsByT10IdOutput>());
                this.GravityUserInventoryService.LiveOpsGetUserInventoryByT10IdAsync(Arg.Any<string>()).Returns(Fixture.Create<UserInventoryService.LiveOpsGetUserInventoryByT10IdOutput>());
                this.GravityUserInventoryService.LiveOpsGetInventoryByProfileIdAsync(Arg.Any<string>(), Arg.Any<string>()).Returns(Fixture.Create<UserInventoryService.LiveOpsGetInventoryByProfileIdOutput>());
                this.Mapper.Map<GravityPlayerInventory>(Arg.Any<LiveOpsUserInventory>()).Returns(Fixture.Create<GravityPlayerInventory>());
            }

            public IGravityUserService GravityUserService { get; set; } = Substitute.For<IGravityUserService>();

            public IGravityUserInventoryService GravityUserInventoryService { get; set; } = Substitute.For<IGravityUserInventoryService>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public IGravityGiftHistoryProvider GiftHistoryProvider { get; set; } = Substitute.For<IGravityGiftHistoryProvider>();

            public GravityPlayerInventoryProvider Build() => new GravityPlayerInventoryProvider(this.GravityUserService, this.GravityUserInventoryService, this.Mapper, this.GiftHistoryProvider);
        }
    }
}