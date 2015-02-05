using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CraigOleycom.Startup))]
namespace CraigOleycom
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
