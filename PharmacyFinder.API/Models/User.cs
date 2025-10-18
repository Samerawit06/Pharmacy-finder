using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PharmacyFinder.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Please enter username")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Please enter your email address ")]
        [EmailAddress(ErrorMessage = "invalid email format")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Please enter username")]
        public string Role { get; set; }= "Customer";
        //public string? Role { get; set; }
        [Required(ErrorMessage = "Please enter password")]
        public string PasswordHash { get; set; } = string.Empty;

       [JsonIgnore]
public ICollection<Pharmacy>? Pharmacies { get; set; }

    }
}




    