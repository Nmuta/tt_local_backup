using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage.Blobs.Models;
using Newtonsoft.Json;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for <see cref="BlobDownloadInfo"/>.
    /// </summary>
    public static class BlobDownloadInfoExtensions
    {
        /// <summary>
        ///     Deserializes blob into provided type.
        /// </summary>
        public static async Task<T> Deserialize<T>(this BlobDownloadInfo download)
        {
            var result = new byte[download.ContentLength];
            await download.Content.ReadAsync(result.AsMemory(0, (int)download.ContentLength)).ConfigureAwait(false);

            return JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(result));
        }
    }
}
