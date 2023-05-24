﻿using System;
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
    [Route("api/v{version:apiVersion}/title/steelhead/acLogReader")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Executables, Target.Details)]
    public class AcLogReaderController : V2SteelheadControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="AcLogReaderController"/> class.
        /// </summary>
        public AcLogReaderController()
        { }

        /// <summary>
        ///     Set console ban status for Steelhead.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Console, ActionAreaLogTags.Banning)]
        [Authorize(Policy = UserAttribute.BanConsole)]
        //[AutoActionLogging(TitleCodeName.Steelhead, Contracts.Data.StewardAction.Add, Contracts.Data.StewardSubject.)] TODO: We want to log this? It's sort of a glorified GET.
        public async Task<IActionResult> RunAcLogReader([FromBody] string fileContents)
        {
            var path = System.AppContext.BaseDirectory;
            var exeDirectory = "TestEXE\\";
            var exeName = "AcLogReader.exe";

            var uniqueFileName = $"{Guid.NewGuid()}.Crash_Info";
            var uniqueFullPath = path + uniqueFileName;
            System.IO.File.WriteAllBytes(uniqueFullPath, Convert.FromBase64String( fileContents )); // Maybe we can coerce the binary string into bytes?
            // System.IO.File.WriteAllText(uniqueFullPath, fileContents);

            try
            {
                var p = new Process();
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.FileName = $"{path}\\{exeName}";
                p.StartInfo.Arguments = $"-f {uniqueFullPath}";

                string oOut = null;
                p.StartInfo.RedirectStandardOutput = true;
                p.OutputDataReceived += new DataReceivedEventHandler((sender, o) => { oOut += $"{o.Data}\r\n"; });

                string eOut = null;
                p.StartInfo.RedirectStandardError = true;
                p.ErrorDataReceived += new DataReceivedEventHandler((sender, e) => { eOut += $"{e.Data}\r\n"; });

                p.Start();

                // To avoid deadlocks, use an asynchronous read operation on at least one of the streams.
                p.BeginOutputReadLine();
                p.BeginErrorReadLine();
                p.WaitForExit();

                System.IO.File.Delete(uniqueFullPath);

                var result = new Info()
                {
                    result = oOut,
                    path = path,
                    error = new Exception(eOut),
                };

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                System.IO.File.Delete(uniqueFullPath);

                var result = new Info()
                {
                    error = ex,
                    path = path,
                };

                return this.Ok(result);
            }
        }
    }
}
