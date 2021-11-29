using System;
using System.Text;
using System.Threading.Tasks;
using Azure.Storage.Blobs.Models;
using Newtonsoft.Json;

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
#pragma warning disable SA1618 // Generic type parameters should be documented
        public static async Task<T> Deserialize<T>(this BlobDownloadInfo download)
        {
            var result = new byte[download.ContentLength];
            await download.Content.ReadAsync(result.AsMemory(0, (int)download.ContentLength)).ConfigureAwait(false);

            return JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(result));
        }
    }
}
