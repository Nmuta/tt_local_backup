using System;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Helpers for conversion of bytes and byte arrays.
    /// </summary>
    public static class ByteExtensions
    {
        /// <summary>
        ///     Converts a byte array into an base64-encoded Date Url image suitable for displaying in a browser.
        /// </summary>
        public static string ToImageDataUrl(this byte[] source)
        {
            return "data:image/jpeg;base64," + Convert.ToBase64String(source);
        }
    }
}
