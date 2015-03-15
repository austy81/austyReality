using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AustyReality.Models
{
    public class RealityDbInitializer : CreateDatabaseIfNotExists<OsmRealityContext>
    {
        protected override void Seed(OsmRealityContext context)
        {
            IList<RealityUser> defaultUser = new List<RealityUser>();

            defaultUser.Add(new RealityUser() { RealityUserId = 1, Email = "admin", Password = "admin" , Rights = 1 });

            foreach (RealityUser user in defaultUser)
                context.Users.Add(user);

            base.Seed(context);
        }
    }
}