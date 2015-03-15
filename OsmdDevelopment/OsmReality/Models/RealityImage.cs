using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AustyReality.Models
{
    public class RealityImage
    {
        public RealityImage()
        {
            
        }

        public int RealityImageId { get; set; }

        [Required]
        public int RealityId { get; set; }

        [Required]
        [MaxLength(36)]
        public string Guid { get; set; }

        [ForeignKey("RealityId")]
        public virtual Reality Reality { get; set; }


    }
}