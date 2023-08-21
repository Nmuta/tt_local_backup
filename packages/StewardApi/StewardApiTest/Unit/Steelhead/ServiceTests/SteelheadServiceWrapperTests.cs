using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Steelhead
{
    [TestClass]
    public sealed class SteelheadServiceWrapperTests
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
        public void Ctor_WhenWoodstockServiceFactoryNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SteelheadServiceFactory = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "steelheadServiceFactory"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
            }

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();
            public ISteelheadServiceFactory SteelheadServiceFactory { get; set; } = Substitute.For<ISteelheadServiceFactory>();

            public SteelheadServiceWrapper Build() => new SteelheadServiceWrapper(this.Configuration, this.SteelheadServiceFactory);
        }
    }
}
