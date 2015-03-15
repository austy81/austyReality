using Newtonsoft.Json.Linq;
using AustyReality.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Data.Entity;
using AustyReality.ControllersWebApi;

namespace AustyReality.Controllers
{

    public class RealityController : ApiController
    {
        [HttpGet]
        public IEnumerable<Reality> GetSearch([FromUri]SearchParameters searchParameters)
        {
            if (searchParameters == null) return null;

            using (var db = new OsmRealityContext())
            {
                var realities = db.Realities
                    .Where(r => (
                            (r.City.Contains(searchParameters.City) || string.IsNullOrEmpty(searchParameters.City))
                                && (r.Locality.Contains(searchParameters.Locality) || string.IsNullOrEmpty(searchParameters.Locality))
                                && (r.Price >= searchParameters.PriceFrom || searchParameters.PriceFrom <= 0)
                                && (r.Price <= searchParameters.PriceTo || searchParameters.PriceTo <= 0)
                                && (searchParameters.Dispositions.Contains(r.Disposition))
                            ))
                    .Include(x => x.Images);

                return realities.ToList();
            }
        }

        [ClientAuthorization]
        [HttpGet]
        public object Get(int id)
        {
            using (var db = new OsmRealityContext())
            {
                return db.Realities.FirstOrDefault(x=>x.RealityId == id);
            }
        }

        [ClientAuthorization]
        [HttpPost]
        public int Post([FromBody]Reality reality)
        {
            reality.InsertDate = DateTime.Now;

            using (var db = new AustyReality.Models.OsmRealityContext())
            {
                db.Realities.Add(reality);
                db.SaveChanges();
                return reality.RealityId;
            }
        }

        [ClientAuthorization]
        [HttpDelete]
        public void Delete(int id)
        {
            using (var db = new OsmRealityContext())
            {
                db.Realities.Remove(new Reality() { RealityId = id });
            }
 
        }
    }
}
