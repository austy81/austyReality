using AustyReality.Models;

namespace AustyReality.ControllersWebApi
{
    public class SearchParameters
    {
        public EDisposition[] Dispositions { get; set; }
        public EKitchen[] Kitchen { get; set; }
        public string City { get; set; }
        public string Locality { get; set; }
        public int PriceFrom { get; set; }
        public int PriceTo { get; set; }
    }

    
}