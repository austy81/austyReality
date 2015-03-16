using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Runtime.Caching;

namespace AustyReality
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public sealed class ClientAuthorizationAttribute : AuthorizationFilterAttribute
    {
        private const string sessionHeaderName = "x-session-token";

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (!ParseAuthorizationHeader(actionContext))
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                return;
            }
            base.OnAuthorization(actionContext);
        }

        private bool ParseAuthorizationHeader(HttpActionContext actionContext)
        {
            IEnumerable<string> tokens;
            if (actionContext.Request.Headers.TryGetValues(sessionHeaderName,out tokens))
            {
                return (from token in tokens 
                        where !string.IsNullOrEmpty(token) 
                        select MemoryCache.Default.Contains(token)).FirstOrDefault();
            }
            return false;
        }

    }
}
            
        