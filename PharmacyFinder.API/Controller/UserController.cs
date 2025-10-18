using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmacyFinder.API.Data;
using PharmacyFinder.API.Models;
namespace PharmacyFinder.API.Controller

{
    public class UserController: ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        //[HttpPost]
        //[Authorize(Roles ="Customer")]
        //    public IActionResult UploadImage(string image)
        //{

        //}

    }
}
