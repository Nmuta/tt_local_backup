using System.Net;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Provides methods for determining whether HTTP errors are transient.
    /// </summary>
    public static class TransientHttpErrorDetector
    {
        /// <summary>
        ///     Determines whether the status code corresponds to a transient error.
        /// </summary>
        public static bool IsTransientHttpStatusCode(HttpStatusCode? statusCode)
        {
            return statusCode != null && IsTransientHttpStatusCode((int)statusCode);
        }

        /// <summary>
        ///     Determines whether the status code corresponds to a transient error.
        /// </summary>
        public static bool IsTransientHttpStatusCode(int statusCode)
        {
            // ReSharper disable ArrangeRedundantParentheses
            if ((statusCode >= 300 && statusCode < 500 && statusCode != 408 && statusCode != 412 && statusCode != 429) ||
                statusCode == 501 || statusCode == 505)
            {
                return false;
            }

            return true;
        }
    }
}
