using AutoFixture;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;

namespace Turn10.LiveOps.StewardTest.Unit.Sunrise
{
    [TestClass]
    public sealed class SunriseServiceWrapperTests
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
        public void Ctor_WhenSunrisekServiceFactoryNull_Throws()
        {
            // Arrange.
            var dependencies = new Dependencies { SunriseServiceFactory = null };

            // Act.
            Action act = () => dependencies.Build();

            // Assert.
            act.Should().Throw<ArgumentNullException>().WithMessage(string.Format(TestConstants.ArgumentNullExceptionMessagePartial, "sunriseServiceFactory"));
        }

        private sealed class Dependencies
        {
            public Dependencies()
            {
                this.Configuration[Arg.Any<string>()].Returns(Fixture.Create<string>());
            }

            public IConfiguration Configuration { get; set; } = Substitute.For<IConfiguration>();
            public ISunriseServiceFactory SunriseServiceFactory { get; set; } = Substitute.For<ISunriseServiceFactory>();

            public SunriseServiceWrapper Build() => new SunriseServiceWrapper(this.Configuration, this.SunriseServiceFactory);
        }
    }
}
