﻿using Autofac;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi;
using static System.Net.WebRequestMethods;

namespace Turn10.LiveOps.StewardTest.Unit
{
    [TestClass]
    public sealed class AttributeAuthorizationTests
    {
        [TestMethod]
        [UnitTest]
        public void AllActionsHaveAttributes()
        {
            var builder = Program.CreateHostBuilder<ControllerTestStartup>(Array.Empty<string>());
            var host = builder.Build();
            var collection = host.Services.GetService(typeof(IActionDescriptorCollectionProvider)) as ActionDescriptorCollectionProvider;

            var errors = new List<string>();
            foreach (var descriptor in collection.ActionDescriptors.Items)
            {
                var cad = descriptor as ControllerActionDescriptor;
                var method = (cad.ActionConstraints.Where(c => c is HttpMethodActionConstraint).FirstOrDefault() as HttpMethodActionConstraint).HttpMethods.FirstOrDefault();
                if (method.Equals(Http.Post, StringComparison.OrdinalIgnoreCase) ||
                    method.Equals(Http.Put, StringComparison.OrdinalIgnoreCase) ||
                    method.Equals("DELETE", StringComparison.OrdinalIgnoreCase) ||
                    method.Equals("PATCH", StringComparison.OrdinalIgnoreCase))
                {
                    // Skip POST endpoints that start with Get
                    if (method.Equals(Http.Post, StringComparison.OrdinalIgnoreCase) && cad.ActionName.StartsWith("Get"))
                    {
                        continue;
                    }

                    // Skip POST endpoints in our external API
                    var path = descriptor.AttributeRouteInfo.Template;
                    var isExternalApiPath = path?.ToLowerInvariant().Contains("api/v{version:apiVersion}/external", StringComparison.InvariantCultureIgnoreCase) ?? false;
                    if (isExternalApiPath)
                    {
                        continue;
                    }

                    // Skip additional apis
                    if (skip("Gravity", "UpdatePlayerInventoryByT10IdUseBackgroundProcessing") ||
                       skip("Gravity", "UpdatePlayerInventoryByT10Id") ||
                       skip("Kusto", "RunQuery") ||
                       skip("Identities", "SearchIdentities") ||
                       skip("Util", "DeleteStatus") ||
                       skip("Util", "PatchStatus") ||
                       skip("Util", "PostStatus") ||
                       skip("Util", "PutStatus") ||
                       skip("Permissions", "SetUserPermissions") ||
                       skip("AcLogReader", "RunAcLogReader") ||
                       skip("MsTeams", "CreateMsTeamsBugReport") ||
                       skip("MsTeams", "CreateMsTeamsFeatureRequest") ||
                       skip("PlayFab", "GetPlayFabEntityIds") ||
                       skip("MsTeams", "CreateMsTeamsPermissionRequest") ||
                       skip("MsTeams", "CreateMsTeamsQuestion") ||
                       skip("AcLogReader", "RunAcLogReader") ||
                       skip("Sharecode", "GenerateSharecode"))
                    {
                        continue;
                    }

                    var policies = cad.MethodInfo.GetCustomAttributes(typeof(AuthorizeAttribute), true)
                           .Concat(cad.ControllerTypeInfo.GetCustomAttributes(typeof(AuthorizeAttribute), true))
                           .Select(attr => (attr as AuthorizeAttribute).Policy)
                           .Where(policy => policy != null);

                    if (!policies.Any())
                    {
                        errors.Add($"{method}: {cad.ControllerName}.{cad.ActionName} does not have a policy defined.");
                    }
                }

                bool skip(string controller, string action)
                {
                    return cad.ControllerName.Equals(controller, StringComparison.OrdinalIgnoreCase) &&
                        cad.ActionName.Equals(action, StringComparison.OrdinalIgnoreCase);
                }
            }

            Assert.IsTrue(!errors.Any(), string.Join("\n", errors));
        }
    }
}
