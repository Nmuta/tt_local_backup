﻿using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for AC Log Reader.
    ///     Used to decode client crash logs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/acLogReader")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.AcLogReader, Target.Details)]
    public class AcLogReaderController : V2SteelheadControllerBase
    {
        private readonly string exeName = "AcLogReader.exe";

        /// <summary>
        ///     Initializes a new instance of the <see cref="AcLogReaderController"/> class.
        /// </summary>
        public AcLogReaderController()
        { }

        /// <summary>
        ///     Decode client crash logs and returns the human readable result.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> RunAcLogReaderAsync([FromBody] string fileContents)
        {
            var path = System.AppContext.BaseDirectory;

            // Temporary file directory.
            // Locally this will be in users/{alias}/AppData/Local/Temp
            // On App Service this will reference %TEMP% which resolves to d:\local and clears on app restart
            var safeFolderPath = Environment.GetEnvironmentVariable("TEMP");
            var uniqueFileName = $"{Guid.NewGuid()}.Crash_Info";
            var uniqueFullPath = safeFolderPath + "\\" + uniqueFileName;
            System.IO.File.WriteAllBytes(uniqueFullPath, Convert.FromBase64String(fileContents));

            try
            {
                using var p = new Process();
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.FileName = $"{path}\\{this.exeName}";
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

                var result = new AcLogReaderResponse
                {
                    DecodedLog = oOut,
                };

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                System.IO.File.Delete(uniqueFullPath);
                throw new ConversionFailedStewardException("Failed to decode Client Crash log", ex);
            }
        }
    }
}
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
