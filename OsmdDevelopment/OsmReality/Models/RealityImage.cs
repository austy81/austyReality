using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AustyReality.Models
{
    public class RealityImage
    {
        public int RealityImageId { get; set; }

        [Required]
        public int RealityId { get; set; }

        [Required]
        [MaxLength(36)]
        public string Guid { get; set; }

        [ForeignKey("RealityId")]
        public Reality Reality { get; set; }


    }
}