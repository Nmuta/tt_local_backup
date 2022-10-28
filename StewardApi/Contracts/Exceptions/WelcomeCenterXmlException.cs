using System;
using System.Runtime.Serialization;

namespace Turn10.LiveOps.StewardApi.Contracts.Exceptions
{
    /// <summary>
    ///     For errors that occur during Welcome Center's XML operations.
    /// </summary>
    [Serializable]
    public class WelcomeCenterXmlException : Exception
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="WelcomeCenterXmlException"/> class.
        /// </summary>
        public WelcomeCenterXmlException()
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="WelcomeCenterXmlException"/> class.
        /// </summary>
        public WelcomeCenterXmlException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="WelcomeCenterXmlException"/> class.
        /// </summary>
        public WelcomeCenterXmlException(string message, Exception inner)
            : base(message, inner)
        {
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="WelcomeCenterXmlException"/> class.
        /// </summary>
        protected WelcomeCenterXmlException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
