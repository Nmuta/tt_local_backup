using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
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
            HttpStatusCode status;
            StewardErrorCode errorCode;

            if (!(context.Exception is StewardBaseException))
            {
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

            if (context.Exception is NotFoundStewardException)
            {
                status = HttpStatusCode.NotFound;
                errorCode = StewardErrorCode.DocumentNotFound;
            }
            else if (context.Exception is InvalidArgumentsStewardException)
            {
                status = HttpStatusCode.BadRequest;
                errorCode = StewardErrorCode.RequiredParameterMissing;
            }
            else if (context.Exception is UnknownFailureStewardException)
            {
                status = HttpStatusCode.InternalServerError;
                errorCode = StewardErrorCode.UnknownFailure;
            }
            else if (context.Exception is FailedToSendStewardException)
            {
                status = HttpStatusCode.InternalServerError;
                errorCode = StewardErrorCode.FailedToSend;
            }
            else if (context.Exception is QueryFailedStewardException)
            {
                status = HttpStatusCode.InternalServerError;
                errorCode = StewardErrorCode.QueryFailed;
            }
            else if (context.Exception is ConversionFailedStewardException)
            {
                status = HttpStatusCode.InternalServerError;
                errorCode = StewardErrorCode.ConversionFailed;
            }
            else
            {
                status = HttpStatusCode.InternalServerError;
                errorCode = StewardErrorCode.UnknownFailure;
            }

            context.ExceptionHandled = true;
            context.HttpContext.Response.StatusCode = (int)status;
            context.HttpContext.Response.ContentType = "application/json";
            var error = new StewardError(errorCode, context.Exception.Message, context.Exception);
            context.Result = new ObjectResult(new StewardErrorResult { Error = error });

            return Task.CompletedTask;
        }
    }
}
