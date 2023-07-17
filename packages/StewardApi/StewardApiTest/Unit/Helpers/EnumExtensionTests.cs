using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardTest.Unit
{
    [TestClass]
    public sealed class EnumExtensionTests
    {
        [TestMethod]
        [TestCategory("Unit")]
        public void Convert_ToGeoflags_VariousSamples()
        {
            (null as int[]).AsEnumList<WoodstockUgcGeoFlagOption>().Should().BeEmpty();
            (new int[] { }).AsEnumList<WoodstockUgcGeoFlagOption>().Should().BeEmpty();
            (new int[] { 0 }).AsEnumList<WoodstockUgcGeoFlagOption>().Should().BeEquivalentTo(new[] { WoodstockUgcGeoFlagOption.None });
            (new int[] { 1 }).AsEnumList<WoodstockUgcGeoFlagOption>().Should().BeEquivalentTo(new[] { WoodstockUgcGeoFlagOption.China });
            (new int[] { 2 }).AsEnumList<WoodstockUgcGeoFlagOption>().Should().BeEquivalentTo(new[] { WoodstockUgcGeoFlagOption.Australia });
            (new int[] { 1, 2 }).AsEnumList<WoodstockUgcGeoFlagOption>().Should().BeEquivalentTo(new[] { WoodstockUgcGeoFlagOption.China, WoodstockUgcGeoFlagOption.Australia });
            (new int[] { 2, 1 }).AsEnumList<WoodstockUgcGeoFlagOption>().Should().BeEquivalentTo(new[] { WoodstockUgcGeoFlagOption.Australia, WoodstockUgcGeoFlagOption.China });
            (new int[] { 0, 1, 2 }).AsEnumList<WoodstockUgcGeoFlagOption>().Should().BeEquivalentTo(new[] { WoodstockUgcGeoFlagOption.None, WoodstockUgcGeoFlagOption.China, WoodstockUgcGeoFlagOption.Australia });
        }
    }
}
