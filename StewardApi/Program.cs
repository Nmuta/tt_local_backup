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

namespace Turn10.LiveOps.StewardApi
{
    /// <summary>
    ///     Primary entry point for application.
    /// </summary>
    public sealed class Program
    {
        /// <summary>
        ///     The required main method.
        /// </summary>
        public static void Main(string[] arguments)
        {
            var host = CreateHostBuilder(arguments).Build();

            /*
            var collection = host.Services.GetService(typeof(IActionDescriptorCollectionProvider)) as ActionDescriptorCollectionProvider;
            List<string> lines = new List<string>();
            foreach (var descriptor in collection.ActionDescriptors.Items)
            {
                var cad = descriptor as ControllerActionDescriptor;
                var api = cad.AttributeRouteInfo.Template;
                var controllerName = cad.ControllerName;

                var rolesOnAction = cad.MethodInfo.GetCustomAttributes(typeof(AuthorizeRolesAttribute), true).Select(attr => (attr as AuthorizeRolesAttribute).Roles);
                var rolesOnController = cad.ControllerTypeInfo.GetCustomAttributes(typeof(AuthorizeRolesAttribute), true).Select(attr => (attr as AuthorizeRolesAttribute).Roles);

                var method = cad.ActionConstraints.Where(c => c is HttpMethodActionConstraint).FirstOrDefault() as HttpMethodActionConstraint;
                lines.Add($"{controllerName}:{cad.ActionName}:{string.Join(",", method.HttpMethods)}:{api}:{string.Join(",", rolesOnAction.Concat(rolesOnController))}");
            }
            
            File.WriteAllLinesAsync("C:\\Users\\elporter\\Desktop\\Steward.txt", lines);
            */

            host.Run();
        }

        /// <summary>
        ///     Creates an instance of <see cref="IHostBuilder"/>.
        /// </summary>
        public static IHostBuilder CreateHostBuilder(string[] arguments) =>
            Host.CreateDefaultBuilder(arguments)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
