using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    public class Info
    {
        public string result { get; set; }

        public string path { get; set; }

        public Exception error { get; set; }
    }

    /// <summary>
    ///     Controller texting executable stuff.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/executable")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Executables, Target.Details)]
    public class ExecutablesController : V2SteelheadControllerBase
    {
        private readonly IBlobStorageProvider blobStorageProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ExecutablesController"/> class.
        /// </summary>
        public ExecutablesController(IBlobStorageProvider blobStorageProvider)
        {
            blobStorageProvider.ShouldNotBeNull(nameof(blobStorageProvider));

            this.blobStorageProvider = blobStorageProvider;
        }

        /// <summary>
        ///     Set console ban status for Steelhead.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Console, ActionAreaLogTags.Banning)]
        [Authorize(Policy = UserAttribute.BanConsole)]
        public async Task<IActionResult> RunExe(string arguments1)
        {
            var path = System.AppContext.BaseDirectory;
            var exeDirectory = "TestEXE\\";
            var exeName = "HelloWorld.exe";

            try
            {
                // var executable = await this.blobStorageProvider.GetHelloWorldAsync(path + exeDirectory, exeName).ConfigureAwait(true);
                // System.IO.Directory.CreateDirectory(path);

                var p = new Process();
                p.StartInfo.UseShellExecute = false;
                string oOut = null;
                p.StartInfo.RedirectStandardOutput = true;
                p.OutputDataReceived += new DataReceivedEventHandler((sender, o) => { oOut += o.Data; });
                string eOut = null;
                p.StartInfo.RedirectStandardError = true;
                p.ErrorDataReceived += new DataReceivedEventHandler((sender, e) => { eOut += e.Data; });
                //p.StartInfo.FileName = $"C:\\TestEXE\\{exeName}";
                p.StartInfo.FileName = $"{path}\\{exeName}";
                p.StartInfo.Arguments = arguments1;
                var used = p.Start();

                // To avoid deadlocks, use an asynchronous read operation on at least one of the streams.
                p.BeginOutputReadLine();
                //string output = p.StandardOutput.ReadToEnd();
                p.BeginErrorReadLine();
                p.WaitForExit();

                //System.IO.File.Delete(executable);
                //System.IO.Directory.Delete(path + exeDirectory);

                var result = new Info()
                {
                    result = oOut,
                    path = path,
                };

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                var result = new Info()
                {
                    result = eOut,
                    error = ex,
                    path = path,
                };

                return this.Ok(result)

                //throw new UnknownFailureStewardException($"Running EXE failed", ex);
            }
        }
    }
}
