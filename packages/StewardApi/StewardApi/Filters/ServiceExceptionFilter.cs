using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Filters
{
    /// <summary>
    ///     Represents a service exception filter.
    /// </summary>
    public class ServiceExceptionFilter : IAsyncExceptionFilter
    {
        /// <summary>
        ///     The on exception async.
        /// </summary>
        public Task OnExceptionAsync(ExceptionContext context)
        {
            // TODO: IF external API, strip out stack trace

            if (!(context.Exception is StewardBaseException))
            {
                HttpStatusCode status;
                StewardErrorCode errorCode;

                if (context.Exception is ArgumentNullException ||
                    context.Exception is ArgumentException ||
                    context.Exception is ArgumentOutOfRangeException)
                {
                    status = HttpStatusCode.BadRequest;
                    errorCode = StewardErrorCode.RequiredParameterMissing;
                }
                else
                {
                    status = HttpStatusCode.InternalServerError;
                    errorCode = StewardErrorCode.UnknownFailure;
                }

                context.ExceptionHandled = true;
                context.HttpContext.Response.StatusCode = (int)status;
                context.HttpContext.Response.ContentType = "application/json";

                context.Result = new ObjectResult(
                    new StewardErrorResult { Error = new StewardError(errorCode, context.Exception.Message, context.Exception) });

                return Task.CompletedTask;
            }

            var baseException = context.Exception as StewardBaseException;
            context.ExceptionHandled = true;
            context.HttpContext.Response.StatusCode = (int)baseException.StatusCode;
            context.HttpContext.Response.ContentType = "application/json";

            // Generate error from exception, strip out inner exception if request came from one of our external API endpoints.
            var error = new StewardError(baseException.ErrorCode, context.Exception.Message, context.Exception);
            var isExternalApiPath = context.HttpContext.Request?.Path.Value?.ToLowerInvariant().Contains("api/v2/external", StringComparison.InvariantCultureIgnoreCase) ?? false;
            if (isExternalApiPath)
            {
                error.InnerException = null;
            }

            context.Result = new ObjectResult(new StewardErrorResult { Error = error });

            return Task.CompletedTask;
        }
    }
}
