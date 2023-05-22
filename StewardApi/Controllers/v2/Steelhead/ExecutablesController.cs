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
            var SB = new StringBuilder();
            SB.AppendLine("Build version 0001.0008.0003  [Feb 14 2023, 12:37:08] ** NOTICE -- This tool is for internal use only.  Not for distribution ** [ 0008 : 4000 ] SysInfo  | Anti-Cheat Startup : 1");
            SB.AppendLine("[ 0008 : 0008 ] SysInfo  | Launcher : explorer.exe H+97ba47296941a6fd5dc83cbf621a562179676c958f12ca916f32868c6e7d04ac");
            SB.AppendLine("[ 0100 : 0800 ] SysInfo  | Process Created : explorer.exe H+97ba47296941a6fd5dc83cbf621a562179676c958f12ca916f32868c6e7d04ac");
            SB.AppendLine("[ 0001 : 0004 ] INFO     | AntiCheat Version : 1.6.5");
            SB.AppendLine("[ 0001 : 0020 ] INFO     | Session UID : SID H+4DC751E6AAA52F6A73078703B7C8FED642EA5366296DEA636FEF5FF1F529B2F0");
            SB.AppendLine("[ 0004 : 0004 ] FngPrnt  | [CMB] 8a8f1c12adf3659c484c005b874a0aacc7f83a753dc4b53cff1e8a94708ced82");
            SB.AppendLine("[ 0004 : 0001 ] FngPrnt  | [SYS] 37f3c1c1b76df0f1245520e3f9b92826a7c985a0f41cbbb99ca78402f94e6ee2");
            SB.AppendLine("[ 0004 : 0002 ] FngPrnt  | [USR] d0fe3b0874bc4dc397e307a7b371107cb9fc9b423d05aa45db451bcc55ad3892");
            SB.AppendLine("[ 0004 : 0010 ] FngPrnt  | [RTR] 56258058d227f39661ee76344c02719ada1099648a520ed569a8d2f1b8426a0b");
            SB.AppendLine("[ 0004 : 0020 ] FngPrnt  | [UID] c728f7bcf17efcc59a0a5d4cb020c9176cd233c63708967b162965a2c23e8236");
            SB.AppendLine("[ 0004 : 0080 ] FngPrnt  | [SyU] f9ed15f10d760ff1ecf4c4912928b9b3ae4cc45d1b199b381d7b5fcf654543f4");
            SB.AppendLine("[ 0008 : 0010 ] SysInfo  | [SIH] b10eb0da1f46a9a4de75d6ffff38df35d2580758ed0fa3544e714625e0385611");
            SB.AppendLine("[ 0004 : 0008 ] FngPrnt  | [EML] e572390e3eef8ad37fe3c9dc9e949f74ddd919b6ca4318093c6e715e132a3cdd");
            SB.AppendLine("[ 0004 : 0008 ] FngPrnt  | [EML] f774d47802002534327682eae8b8bc2f91ae0463b619d08e0dac6f2a99ee3c57");
            SB.AppendLine("[ 0001 : 0040 ] INFO     | OS Version : 11.0");
            SB.AppendLine("[ 0001 : 0020 ] INFO     | Session UID : SID H+26ED877070D844D1DDFC2E06E0F35BA9A48FD43A83490171DAAC124BD5DFBEB2");
            SB.AppendLine("[ 0001 : 0020 ] INFO     | Session UID : SID H+A7965C420973DB1FB0BE7BA492AAFA4DF169210CA1A7BC6DD4A6766F29995093");
            SB.AppendLine("[ 0001 : 0020 ] INFO     | Session UID : SID H+D5E4EDAC9287B2EE47500506921CA9FE29AA80B4F81575D76E406F270525732B");
            SB.AppendLine("[ 0001 : 0020 ] INFO     | Session UID : SID H+464CE2EB1F19D7ABFF12A2907439AAB7382927C54F51808373F403E78185D204");
            SB.AppendLine("[ 0008 : 0001 ] SysInfo  | Prohibited Driver Detected : \\\\.\\interception");
            SB.AppendLine("[ 0008 : 0020 ] SysInfo  | Threat Level Exceeded : 100");
            SB.AppendLine("[ 0020 : 0301 ] Event    | Counter Measure Scheduled : Prohibited Driver Detected");
            SB.AppendLine("[ 0008 : 8000 ] SysInfo  | Anti-Cheat Finish : 99");
            SB.AppendLine("[ 0100 : 0008 ] SysInfo  | Counter Measure Execute : Prohibited Driver Detected");
            SB.AppendLine("[ 0020 : 8101 ] Event    | Hard Exit : Counter Measure Execute ");
            SB.AppendLine("Log procesing completed");

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

                return this.Ok(SB.ToString());
            }
            catch (Exception ex)
            {
                var result = new Info()
                {
                    error = ex,
                    path = path,
                };

                return this.Ok(result);

                //throw new UnknownFailureStewardException($"Running EXE failed", ex);
            }
        }
    }
}
