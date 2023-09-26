﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ProfileNotesControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ProfileNotesControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<ProfileNote>> GetProfileNotesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profileNotes");

            return await ServiceClient.SendRequestAsync<IList<ProfileNote>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task AddProfileNoteAsync(ulong xuid, string profileNote)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profileNotes");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, requestBody: profileNote, headers: this.headers).ConfigureAwait(false);
        }
    }
}
