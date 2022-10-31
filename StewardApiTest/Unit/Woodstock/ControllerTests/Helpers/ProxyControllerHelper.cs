using Autofac;
using Autofac.Core;
using AutoFixture;
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
using static Turn10.Services.LiveOps.FH5_main.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
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

            var mockProxyBundle = new WoodstockProxyBundle(GenerateProxyFactory(Fixture));
            mockProxyBundle.Endpoint = "fake";

            var builder = new ContainerBuilder();
            builder.Register(c => mockProxyBundle).Named<WoodstockProxyBundle>("woodstockProdLiveProxyBundle").As<WoodstockProxyBundle>();
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

        private static IWoodstockProxyFactory GenerateProxyFactory(Fixture Fixture)
        {
            var proxyFactory = Substitute.For<IWoodstockProxyFactory>();

            var mockUserManagementService = GenerateUserManagementService(Fixture); //Can't pass method directly as Returns parameter.
            proxyFactory.PrepareUserManagementService(Arg.Any<string>()).Returns(mockUserManagementService);

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

            return mockUserManagementService;
        }
    }
}
