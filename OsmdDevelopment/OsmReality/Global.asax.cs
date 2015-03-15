using AustyReality.ControllersWebApi;
using System.Web.Http;

namespace AustyReality
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            AzureBlob.InitContainers();
        }
    }
}
