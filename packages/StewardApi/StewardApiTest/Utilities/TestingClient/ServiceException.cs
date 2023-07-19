using System;
using System.Net;
using System.Runtime.Serialization;

namespace Turn10.LiveOps.StewardTest.Utilities.TestingClient
{
    public class ServiceException : Exception
    {
        public ServiceException(HttpStatusCode statusCode, string responseBody)
        {
            this.StatusCode = statusCode;
            this.ResponseBody = responseBody;
        }

        protected ServiceException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }

        public HttpStatusCode StatusCode { get; private set; }

        public string ResponseBody { get; private set; }
    }
}