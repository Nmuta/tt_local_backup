using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Forza.LiveOps.FH5.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using static Forza.LiveOps.FH5.Generated.NotificationsManagementService;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock
{
    [TestClass]
    public sealed class WoodstockNotificationProviderTests
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
        public void Ctor_WhenWoodstockServiceNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockService = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockService"));
        }


        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenNotificationHistoryProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { NotificationHistoryProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "notificationHistoryProvider"));
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
        public async Task GetPlayerNotificationsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var maxResults = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<Notification>> Action() => await provider.GetPlayerNotificationsAsync(xuid, maxResults, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<Notification>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task GetGroupNotificationsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var maxResults = Fixture.Create<int>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<UserGroupNotification>> Action() => await provider.GetGroupNotificationsAsync(groupId, maxResults, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<UserGroupNotification>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SendNotificationsAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuids = Fixture.Create<List<ulong>>();
            var message = Fixture.Create<string>();
            var expireTime = Fixture.Create<DateTime>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<IList<MessageSendResult<ulong>>> Action() => await provider.SendNotificationsAsync(xuids, message, expireTime, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<List<MessageSendResult<ulong>>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task SendGroupNotificationAsync_WithValidParameters_ReturnsCorrectType()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var groupId = Fixture.Create<int>();
            var message = Fixture.Create<string>();
            var expireTime = Fixture.Create<DateTime>();
            var deviceType = Fixture.Create<DeviceType>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            async Task<MessageSendResult<int>> Action() => await provider.SendGroupNotificationAsync(groupId, message, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false);

            // Assert.
            var result = await Action().ConfigureAwait(false);
            result.Should().BeOfType<MessageSendResult<int>>();
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendNotificationsAsync_WithNullXuids_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var message = Fixture.Create<string>();
            var expireTime = Fixture.Create<DateTime>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<IList<MessageSendResult<ulong>>>> action = async () => await provider.SendNotificationsAsync(null, message, expireTime, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "xuids"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendGroupNotificationAsync_WithInvalidGroupId_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var message = Fixture.Create<string>();
            var expireTime = Fixture.Create<DateTime>();
            var deviceType = Fixture.Create<DeviceType>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            Func<Task<MessageSendResult<int>>> action = async () => await provider.SendGroupNotificationAsync(TestConstants.NegativeValue, message, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false);

            // Assert.
            action.Should().Throw<ArgumentOutOfRangeException>().WithMessage(string.Format(TestConstants.ArgumentOutOfRangeExceptionMessagePartial, "groupId", -1, TestConstants.NegativeValue));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void SendNotificationsAsync_WithNullEmptyWhitespaceMessage_Throws()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuids = Fixture.Create<List<ulong>>();
            var groupId = Fixture.Create<int>();
            var expireTime = Fixture.Create<DateTime>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();
            var deviceType = Fixture.Create<DeviceType>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.SendNotificationsAsync(xuids, null, expireTime, endpoint).ConfigureAwait(false),
                async () => await provider.SendNotificationsAsync(xuids, TestConstants.Empty, expireTime, endpoint).ConfigureAwait(false),
                async () => await provider.SendNotificationsAsync(xuids, TestConstants.WhiteSpace, expireTime, endpoint).ConfigureAwait(false),
                async () => await provider.SendGroupNotificationAsync(groupId, null, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false),
                async () => await provider.SendGroupNotificationAsync(groupId, TestConstants.Empty, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false),
                async () => await provider.SendGroupNotificationAsync(groupId, TestConstants.WhiteSpace, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "message"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EditNotificationAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var notificationId = Fixture.Create<Guid>();
            var message = Fixture.Create<string>();
            var expireTime = Fixture.Create<DateTime>();
            var deviceType = Fixture.Create<DeviceType>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.EditNotificationAsync(notificationId, xuid, message, expireTime, endpoint).ConfigureAwait(false),
                async () => await provider.EditGroupNotificationAsync(notificationId, message, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void EditNotificationAsync_WithNullEmptyWhiteSpaceMessage_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var notificationId = Fixture.Create<Guid>();
            var expireTime = Fixture.Create<DateTime>();
            var deviceType = Fixture.Create<DeviceType>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.EditNotificationAsync(notificationId, xuid, null, expireTime, endpoint).ConfigureAwait(false),
                async () => await provider.EditNotificationAsync(notificationId, xuid, TestConstants.Empty, expireTime, endpoint).ConfigureAwait(false),
                async () => await provider.EditNotificationAsync(notificationId, xuid, TestConstants.WhiteSpace, expireTime, endpoint).ConfigureAwait(false),
                async () => await provider.EditGroupNotificationAsync(notificationId, null, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false),
                async () => await provider.EditGroupNotificationAsync(notificationId, TestConstants.Empty, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false),
                async () => await provider.EditGroupNotificationAsync(notificationId, TestConstants.WhiteSpace, expireTime, deviceType, requesterObjectId, endpoint).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "message"));
            }
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void DeleteNotificationAsync_WithValidParameters_DoesNotThrow()
        {
            // Arrange.
            var provider = new Dependencies().Build();
            var xuid = Fixture.Create<ulong>();
            var notificationId = Fixture.Create<Guid>();
            var requesterObjectId = Fixture.Create<string>();
            var endpoint = Fixture.Create<string>();

            // Act.
            var actions = new List<Func<Task>>
            {
                async () => await provider.DeleteNotificationAsync(notificationId, xuid, endpoint).ConfigureAwait(false),
                async () => await provider.DeleteGroupNotificationAsync(notificationId, requesterObjectId, endpoint).ConfigureAwait(false),
            };

            // Assert.
            foreach (var action in actions)
            {
                action.Should().NotThrow();
            }
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.WoodstockService.LiveOpsRetrieveForUserAsync(Arg.Any<ulong>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<LiveOpsRetrieveForUserExOutput>());
                this.WoodstockService.GetUserGroupNotificationsAsync(Arg.Any<int>(), Arg.Any<int>(), Arg.Any<string>()).Returns(Fixture.Create<GetAllUserGroupMessagesOutput>());
                this.WoodstockService.GetUserGroupNotificationAsync(Arg.Any<Guid>(), Arg.Any<string>()).Returns(Fixture.Create<GetUserGroupMessageOutput>());
                this.WoodstockService.SendMessageNotificationToMultipleUsersAsync(Arg.Any<List<ulong>>(), Arg.Any<string>(), Arg.Any<DateTime>(), Arg.Any<string>()).Returns(Fixture.Create<SendMessageNotificationToMultipleUsersOutput>());
                this.Mapper.Map<IList<Notification>>(Arg.Any<LiveOpsNotification[]>()).Returns(Fixture.Create<IList<Notification>>());
                this.Mapper.Map<IList<UserGroupNotification>>(Arg.Any<ForzaUserGroupMessage[]>()).Returns(Fixture.Create<IList<UserGroupNotification>>());
                this.Mapper.Map<IList<MessageSendResult<ulong>>>(Arg.Any<ForzaUserMessageSendResult[]>()).Returns(Fixture.Create<IList<MessageSendResult<ulong>>>());
            }

            public IWoodstockService WoodstockService { get; set; } = Substitute.For<IWoodstockService>();

            public IWoodstockNotificationHistoryProvider NotificationHistoryProvider { get; set; } = Substitute.For<IWoodstockNotificationHistoryProvider>();

            public IMapper Mapper { get; set; } = Substitute.For<IMapper>();

            public WoodstockNotificationProvider Build() => new WoodstockNotificationProvider(
                this.WoodstockService,
                this.NotificationHistoryProvider,
                this.Mapper);
        }
    }
}
