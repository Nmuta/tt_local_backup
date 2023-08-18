using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ServiceTests
{
    [TestClass]
    public sealed class WoodstockServiceWrapperTests
    {
        private static readonly Fixture Fixture = new Fixture();

        [TestMethod]
        [UnitTest]
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
        [UnitTest]
        public void Ctor_WhenConfigurationNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { Configuration = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "configuration"));
        }

        [TestMethod]
        [UnitTest]
        public void Ctor_WhenStewardProjectionWoodstockServiceFactoryNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { StewardProjectionWoodstockServiceFactory = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "stewardProjectionServiceFactory"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
            }

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();
            public ILiveProjectionWoodstockServiceFactory LiveProjectionWoodstockServiceFactory { get; set; } = Substitute.For<ILiveProjectionWoodstockServiceFactory>();
            public IStewardProjectionWoodstockServiceFactory StewardProjectionWoodstockServiceFactory { get; set; } = Substitute.For<IStewardProjectionWoodstockServiceFactory>();

            public WoodstockServiceWrapper Build() => new WoodstockServiceWrapper(this.Configuration, this.StewardProjectionWoodstockServiceFactory);
        }
    }
}
