using System;
using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Woodstock.ServiceTests
{
    [TestClass]
    public sealed class WoodstockServiceWrapperTests
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
        [TestCategory("Unit")]
        public void Ctor_WhenWoodstockServiceFactoryNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { WoodstockServiceFactory = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "woodstockServiceFactory"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
            }

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();
            public IWoodstockServiceFactory WoodstockServiceFactory { get; set; } = Substitute.For<IWoodstockServiceFactory>();

            public WoodstockServiceWrapper Build() => new WoodstockServiceWrapper(this.Configuration, this.WoodstockServiceFactory);
        }
    }
}
