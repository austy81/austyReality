using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AustyReality.Models
{
    public enum EDealType
    {
        flat,
        nonResidental
    }

    public enum EDisposition
    {
        d1,
        d2,
        d3,
        d4,
        d5,
        d6
    }
    
    public class Reality 
    {
        public Reality()
        {
            //RealityUser = new RealityUser();
            Images = new List<RealityImage>();
        }

        

        [Key]
        public int RealityId { get; set; }

        [Required]
        public int RealityUserId { get; set; }

        [ForeignKey("RealityUserId")]
        public virtual RealityUser RealityUser { get; set; }

        [Column(TypeName = "DateTime2")]
        [Required]
        public DateTime InsertDate { get; set; }

        [Required]
        public EDealType DealType { get; set; }

        [NotMapped]
        public string DealTypeText
        {
            get { return DealType.ToString(); }
        }

        [Required]
        public EDisposition Disposition { get; set; }

        [NotMapped]
        public string DispositionText
        {
            get { return Disposition.ToString(); }
        }

        [Required]
        [MaxLength(100)]
        public string Region { get; set; }

        [Required]
        [MaxLength(100)]
        public string City { get; set; }

        [Required]
        [MaxLength(100)]
        public string Locality { get; set; }

        [Required]
        [MaxLength(100)]
        public string Street { get; set; }

        public int StreetNumber { get; set; }

        public int Price { get; set; }

        //[Required]
        [MaxLength(100)]
        public string DealDescription { get; set; }

        public virtual ICollection<RealityImage> Images { get; set; }
    }
}