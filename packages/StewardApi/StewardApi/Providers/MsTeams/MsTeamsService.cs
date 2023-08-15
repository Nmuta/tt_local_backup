using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.MsGraph;

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
