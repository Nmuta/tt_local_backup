using Autofac;
using Autofac.Core;
using AutoFixture;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Documents;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.Services.LiveOps.FH5_main.Generated.NotificationsManagementService;
using static Turn10.Services.LiveOps.FH5_main.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.Helpers
{
    internal class ProxyControllerHelper
    {
        public static HttpContext Create(Fixture Fixture)
        {
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Path = TestConstants.TestRequestPath;
            httpContext.Request.Host = new HostString(TestConstants.TestRequestHost);
            httpContext.Request.Scheme = TestConstants.TestRequestScheme;

            var configuration = Substitute.For<IConfiguration>();
            configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
            configuration[Arg.Is<string>(x => x.Contains("Xuid") || x.Contains("TitleId"))].Returns(Fixture.Create<int>().ToString());

            var mockProxyBundle = CreateWoodstockProxyBundle(Fixture);

            var builder = new ContainerBuilder();
            builder.Register(c => mockProxyBundle).Named<WoodstockProxyBundle>("woodstockProdLiveStewardProxyBundle").As<WoodstockProxyBundle>();
            var container = builder.Build();

            var mockRequestServices = Substitute.For<IServiceProvider>();
            mockRequestServices.GetService<WoodstockProxyBundle>().Returns(mockProxyBundle);
            mockRequestServices.GetService<IComponentContext>().Returns(container);

            httpContext.HttpContext.RequestServices = mockRequestServices;

            var claims = new List<Claim> { new Claim("http://schemas.microsoft.com/identity/claims/objectidentifier", "unit-test-azure-object-id") };
            var claimsIdentities = new List<ClaimsIdentity> { new ClaimsIdentity(claims) };
            httpContext.User = new ClaimsPrincipal(claimsIdentities);

            return httpContext;
        }

        public static WoodstockProxyBundle CreateWoodstockProxyBundle(Fixture Fixture)
        {
            var mockProxyBundle = new WoodstockProxyBundle(GenerateProxyFactory(Fixture));
            mockProxyBundle.Endpoint = "fake";

            return mockProxyBundle;
        }

        private static IWoodstockProxyFactory GenerateProxyFactory(Fixture Fixture)
        {
            var proxyFactory = Substitute.For<IWoodstockProxyFactory>();

            var mockUserManagementService = GenerateUserManagementService(Fixture); //Can't pass method directly as Returns parameter.
            proxyFactory.PrepareUserManagementService(Arg.Any<string>()).Returns(mockUserManagementService);

            var mockNotificationsManagementService = GenerateNotificationsManagementService(Fixture);
            proxyFactory.PrepareNotificationsManagementService(Arg.Any<string>()).Returns(mockNotificationsManagementService);

            var mockGiftingManagementService = GenerateGiftingManagementService(Fixture);
            proxyFactory.PrepareGiftingManagementService(Arg.Any<string>()).Returns(mockGiftingManagementService);

            var mockRareCarShopService = GenerateRareCarShopService(Fixture);
            proxyFactory.PrepareRareCarShopService(Arg.Any<string>()).Returns(mockRareCarShopService);

            //Add more services as needed for testing. Each should be constrained in it's own method to make organization simple.

            return proxyFactory;
        }

        private static IUserManagementService GenerateUserManagementService(Fixture Fixture)
        {
            var mockUserManagementService = Substitute.For<IUserManagementService>();
            mockUserManagementService.RemoveFromUserGroups(Arg.Any<ulong>(), Arg.Any<int[]>()).Returns(Fixture.Create<Task>());
            mockUserManagementService.AddToUserGroups(Arg.Any<ulong>(), Arg.Any<int[]>()).Returns(Fixture.Create<Task>());
            mockUserManagementService.CreateUserGroup(Arg.Any<string>()).Returns(Fixture.Create<CreateUserGroupOutput>());
            mockUserManagementService.CreateUserGroupBulkOperation(Arg.Any<ForzaBulkOperationType>(), Arg.Any<int>(), Arg.Any<ForzaUserIds[]>()).Returns(Fixture.Create<CreateUserGroupBulkOperationOutput>());
            mockUserManagementService.GetUserGroupBulkOperationStatus(Arg.Any<ForzaBulkOperationType>(), Arg.Any<int>(), Arg.Any<Guid>()).Returns(Fixture.Create<GetUserGroupBulkOperationStatusOutput>());
            mockUserManagementService.CreateUserGroupBulkOperationV2(Arg.Any<ForzaBulkOperationType>(), Arg.Any<int>(), Arg.Any<ForzaUserGroupOperationPage[]>()).Returns(Fixture.Create<CreateUserGroupBulkOperationV2Output>());
            mockUserManagementService.BanUsersV2(Arg.Any<ForzaUserBanParametersV2[]>()).Returns(Fixture.Create<BanUsersV2Output>());

            var mockGetUserIdsOutput = new GetUserIdsOutput();
            mockGetUserIdsOutput.playerLookupResult = new[] { new ForzaPlayerLookupResult() { PlayerExists = true } };
            mockUserManagementService.GetUserIds(Arg.Any<int>(), Arg.Any<ForzaPlayerLookupParameters[]>()).Returns(mockGetUserIdsOutput);

            return mockUserManagementService;
        }

        private static INotificationsManagementService GenerateNotificationsManagementService(Fixture Fixture)
        {
            var mockNotificationsManagementService = Substitute.For<INotificationsManagementService>();
            mockNotificationsManagementService.DeleteNotificationsForUser(Arg.Any<ulong>()).Returns(Fixture.Create<DeleteNotificationsForUserOutput>());

            return mockNotificationsManagementService;
        }

        private static IGiftingManagementService GenerateGiftingManagementService(Fixture Fixture)
        {
            var mockGiftingManagementService = Substitute.For<IGiftingManagementService>();
            mockGiftingManagementService.AdminSendItemGiftV2(Arg.Any<ulong>(), Arg.Any<string>(), Arg.Any<int>(), Arg.Any<bool>(), Arg.Any<uint>()).Returns(Fixture.Create<Task>());
            mockGiftingManagementService.AdminSendItemGroupGiftV2(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<int>(), Arg.Any<bool>(), Arg.Any<uint>()).Returns(Fixture.Create<Task>());
            mockGiftingManagementService.AdminSendLiveryGift(Arg.Any<ulong[]>(), Arg.Any<int>(), Arg.Any<Guid>(), Arg.Any<bool>(), Arg.Any<uint>()).Returns(Fixture.Create<GiftingManagementService.AdminSendLiveryGiftOutput>());
            mockGiftingManagementService.AdminSendGroupLiveryGift(Arg.Any<int>(), Arg.Any<Guid>(), Arg.Any<bool>(), Arg.Any<uint>()).Returns(Fixture.Create<GiftingManagementService.AdminSendGroupLiveryGiftOutput>());

            return mockGiftingManagementService;
        }

        private static IRareCarShopService GenerateRareCarShopService(Fixture Fixture)
        {
            var mockRareCarShopService = Substitute.For<IRareCarShopService>();
            mockRareCarShopService.AdminGetTokenBalance(Arg.Any<ulong>()).Returns(Fixture.Create<RareCarShopService.AdminGetTokenBalanceOutput>());

            return mockRareCarShopService;
        }
    }
}
