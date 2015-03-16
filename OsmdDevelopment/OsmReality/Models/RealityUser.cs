using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AustyReality.Models
{
    public class RealityUser
    {
        //[Key]
        public int RealityUserId { get; set; }
        
        public int Rights { get; set; }
        
        //[Required]
        [MaxLength(100)]
        public string Email { get; set; }
        
        //[Required]
        [MaxLength(100)]
        public string Password { get; set; }

        public ICollection<Reality> Realities { get; set; }
    }
}