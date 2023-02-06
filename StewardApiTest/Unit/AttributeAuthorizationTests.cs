using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Autofac;
using Microsoft.Extensions.Configuration;

using static System.Net.WebRequestMethods;
using Microsoft.Extensions.Hosting;
using Autofac.Extensions.DependencyInjection;
using System.IO;

namespace Turn10.LiveOps.StewardTest.Unit
{
    [TestClass]
    public sealed class AttributeAuthorizationTests
    {
        [TestMethod]
        [TestCategory("Unit")]
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
                    // Skip posts that start with Get
                    if (method.Equals(Http.Post, StringComparison.OrdinalIgnoreCase) && cad.ActionName.StartsWith("Get"))
                    {
                        continue;
                    }

                    // Skip additional apis
                    if (skip("Gravity", "UpdatePlayerInventoryByT10IdUseBackgroundProcessing") ||
                       skip("Gravity", "UpdatePlayerInventoryByT10Id") ||
                       skip("Kusto", "RunQuery") ||
                       skip("Players", "SearchIdentities") ||
                       skip("Util", "DeleteStatus") ||
                       skip("Util", "PatchStatus") ||
                       skip("Util", "PostStatus") ||
                       skip("Util", "PutStatus") ||
                       skip("Permissions", "SetUserPermissions"))
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
