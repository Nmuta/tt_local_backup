using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.Ugc;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ControllerTests
{
    [TestClass]
    public sealed class WoodstockUgcSearchTests
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
        public void Ctor_WhenStorefrontProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { storefrontProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "storefrontProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenItemsProviderNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { ItemsProvider = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "itemsProvider"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public void Ctor_WhenMapperNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { mapper = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "mapper"));
        }

        [TestMethod]
        [TestCategory("Unit")]
        public async Task Get_ReturnsCorrectType()
        {
            // Arrange.
            var controller = new Dependencies().Build();
            var filters = Fixture.Create<UGCSearchFilters>();
            var type = "Livery";

            // Act.
            async Task<IActionResult> action() => await controller.Get(filters, type).ConfigureAwait(false);

            // Assert.
            action().Should().BeAssignableTo<Task<IActionResult>>();
            action().Should().NotBeNull();
            var result = await action().ConfigureAwait(false);
            result.Should().BeOfType<OkObjectResult>();
        }

        private sealed class Dependencies
        {
            private readonly ControllerContext ControllerContext;

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

                this.storefrontProvider.SearchUgcContentAsync(Arg.Any<UgcType>(), Arg.Any<ForzaUGCSearchRequest>(), Arg.Any<string>()).Returns(Fixture.Create<IList<UgcItem>>());
                this.ItemsProvider.GetCarsAsync().Returns(Fixture.Create<IEnumerable<DetailedCar>>());
            }
            public IWoodstockStorefrontProvider storefrontProvider { get; set; } = Substitute.For<IWoodstockStorefrontProvider>();

            public IWoodstockItemsProvider ItemsProvider { get; set; } = Substitute.For<IWoodstockItemsProvider>();

            public IMapper mapper { get; set; } = Substitute.ForPartsOf<Mapper>(new MapperConfiguration(mc =>
            {
                mc.AddProfile(new WoodstockProfileMapper());
                mc.AllowNullCollections = true;
            }));

            public WoodstockUgcSearch Build() => new WoodstockUgcSearch(
                this.storefrontProvider,
                this.ItemsProvider,
                mapper)
            { ControllerContext = this.ControllerContext };
        }
    }
}
