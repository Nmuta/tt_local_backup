using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi;

namespace Turn10.LiveOps.StewardTest.Unit
{
    [TestClass]
    public sealed class AttributeAuthorizationTests
    {
        [TestMethod]
        [TestCategory("Unit")]
        public void AllActionsHaveAttributes()
        {
            var host = Host.CreateDefaultBuilder(new string[] { })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                }).Build();

            var collection = host.Services.GetService(typeof(IActionDescriptorCollectionProvider)) as ActionDescriptorCollectionProvider;
            List<string> lines = new List<string>();
            foreach (var descriptor in collection.ActionDescriptors.Items)
            {
                try
                {
                    var cad = descriptor as ControllerActionDescriptor;
                    var api = cad.AttributeRouteInfo.Template;
                    var controllerName = cad.ControllerName;

                    var rolesOnAction = cad.MethodInfo.GetCustomAttributes(typeof(AuthorizeRolesAttribute), true).Select(attr => (attr as AuthorizeRolesAttribute).Roles);
                    var rolesOnController = cad.ControllerTypeInfo.GetCustomAttributes(typeof(AuthorizeRolesAttribute), true).Select(attr => (attr as AuthorizeRolesAttribute).Roles);

                    // If the action and the controller have no roles defined
                    if(!rolesOnController.Any() && !rolesOnController.Any())
                    {
                        var method = cad.ActionConstraints.Where(c => c is HttpMethodActionConstraint).FirstOrDefault() as HttpMethodActionConstraint;
                        lines.Add($"{controllerName}:{cad.ActionName}:{string.Join(",", method.HttpMethods)}:{api}:{string.Join(",", rolesOnAction.Concat(rolesOnController))}");
                    }
                }
                catch (Exception e)
                {
                    lines.Add(e.Message);
                }
            }

            Assert.IsTrue(!lines.Any());
        }

        [TestMethod]
        public void Scratch()
        {
            var attributes = new string[] {"Proposed Attribute","ServicesFeature","ServicesFeature","N/A (technically a GET)","BanPlayer","BanPlayer","DeleteBan","DeleteBan","N/A (technically a GET)","BanConsole","UpdateUserGroup","PlayerGifting","PlayerGifting","GroupGifting","PlayerLiveryGifting","GroupLiveryGifting","DeleteAuction","NA","Ban","Ban","UpdateAuctionBlocklist","UpdateAuctionBlocklist","AdminFeature","OverrideCMS","OverrideCMS","OverrideCMS","OverrideCMS","BanConsole","UpdateUserGroup","SetUGCGeoFlag","PlayerGifting","PlayerLiveryGifting","PlayerGifting","PlayerLiveryGifting","GroupGifting","GroupLiveryGifting","NA","NA","NA","AdminFeature","AdminFeature","AdminFeature","N/A (technically a GET)","AdminFeature","AdminFeature","AdminFeature","AddLocalizedString","SendLoyaltyRewards","SendLoyaltyRewards","PlayerMessaging","PlayerMessaging","PlayerMessaging","PlayerMessaging","GroupMessaging","GroupMessaging","GroupMessaging","N/A (technically a GET)","UpdateObligationPipeline","UpdateObligationPipeline","UpdateObligationPipeline","UpdateObligationPipeline","UpdateObligationPipeline","N/A (technically a GET)","N/A (technically a GET)","BanPlayer","BanPlayer","UpdateProfile","UpdateProfile","UpdateProfile","AddProfileNote","SetReportWeight","SetReportWeight","AdminFeature","N/A (technically a GET)","BanConsole","BanPlayer","BanPlayer","N/A (technically a GET)","PlayerGifitng","PlayerGifting","GroupGifting","PlayerMessaging","GroupMessaging","PlayerMessaging","GroupMessaging","PlayerMessaging","GroupMessaging","AddLocalizedString","UpdateUserGroup","N/A (technically a GET)","AddProfileNote","FeatureUGC","HideUGC","HideUGC","UpdateAuctionBlocklist","UpdateAuctionBlocklist","BanPlayer","BanPlayer","DeleteBan","DeleteBan","N/A (technically a GET)","BanConsole","PlayerGifting","PlayerGifting","GroupGifting","PlayerLiveryGifting","GroupLiveryGifting","PlayerMessaging","GroupMessaging","PlayerMessaging","GroupMessaging","PlayerMessaging","GroupMessaging","UpdateUserGroup","N/A (technically a GET)","N/A (technically a GET)","CreateUserGroup","UpdateUserGroup","UpdateUserGroup","AdminFeature","CreateUserGroup","UpdateUserGroup","UpdateUserGroup","AdminFeature","CreateUserGroup","UpdateUserGroup","UpdateUserGroup","AdminFeature","CreateUserGroup","UpdateUserGroup","UpdateUserGroup","AdminFeature","NA","NA","NA","NA","N/A (technically a GET)","BanConsole","AddProfileNote","DeleteAuction","UpdateAuctionBlocklist","UpdateAuctionBlocklist","FeatureUGC","HideUGC","HideUGC","BanPlayer","BanPlayer","DeleteBan","DeleteBan","N/A (technically a GET)","PlayerGifting","PlayerGifting","GroupGifting","PlayerLiveryGifting","GroupLiveryGifting","PlayerMessaging","GroupMessaging","PlayerMessaging","GroupMessaging","PlayerMessaging","GroupMessaging","DeleteLeaderboardScores","UpdateUserGroup","PlayerMessaging","N/A (technically a GET)","N/A (technically a GET)"};
            var distinct = attributes.Distinct().ToList();
            distinct.Sort();
            Console.WriteLine(distinct);
        }
    }
}
