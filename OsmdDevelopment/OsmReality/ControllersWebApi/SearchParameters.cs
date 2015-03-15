using AustyReality.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AustyReality.ControllersWebApi
{
    public class SearchParameters
    {
        public EDisposition[] Dispositions { get; set; }
        public string City { get; set; }
        public string Locality { get; set; }
        public int PriceFrom { get; set; }
        public int PriceTo { get; set; }
    }
}