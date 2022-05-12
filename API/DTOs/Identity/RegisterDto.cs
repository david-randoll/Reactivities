using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.Identity
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}", ErrorMessage = "Password must have at least 6 characters, one uppercase, one lowercase letter and one number")]
        public string Password { get; set; }

        [Required]
        public string Username { get; set; }
    }
}