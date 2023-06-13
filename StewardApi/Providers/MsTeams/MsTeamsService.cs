using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Obligation.UpstreamModels;
using Turn10.LiveOps.StewardApi.Providers.MsGraph;
using static Kusto.Data.Common.CslCommandGenerator;
using static Microsoft.VisualStudio.Services.Graph.GraphResourceIds;
using static System.Net.WebRequestMethods;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.MsTeams;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using Kusto.Data.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using PlayFab.EconomyModels;
using AdaptiveCards;
using AdaptiveCards.Templating;

namespace Turn10.LiveOps.StewardApi.Providers.MsTeams
{
    /// <inheritdoc />
    public sealed class MsTeamsService : IMsTeamsService
    {
        private readonly string helpChannelWebhook;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MsTeamsService"/> class.
        /// </summary>
        public MsTeamsService(string helpChannelWebhook)
        {
            helpChannelWebhook.ShouldNotBeNull(nameof(helpChannelWebhook));

            this.helpChannelWebhook = helpChannelWebhook;
        }

        /// <inheritdoc />
        public async Task SendHelpChannelMessageAsync(string jsonCardMessage)
        {
            HttpResponseMessage response;

            using (var client = new HttpClient())
            using (var content = new StringContent(jsonCardMessage, System.Text.Encoding.UTF8, "application/json"))
            {
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await client.PostAsync(this.helpChannelWebhook, content).ConfigureAwait(false);
            }

            if (!response.IsSuccessStatusCode)
            {
                throw new UnknownFailureStewardException(response.Content.ToString());
            }
        }
    }
}
