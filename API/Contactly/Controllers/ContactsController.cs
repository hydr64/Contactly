﻿using Contactly.Data;
using Contactly.Models;
using Contactly.Models.Domain;
using Microsoft.AspNetCore.Mvc;

namespace Contactly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContaclyDbContext dbContext;

        public ContactsController(ContaclyDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllContats()
        {
            var contacts = dbContext.Contacts.ToList();
            return Ok(contacts);
        }

        [HttpPost]
        public IActionResult AddContact(AddContactRequestDTO request)
        {
            var domainModelContact = new Contact
            {
                id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Favorite = request.Favorite,
            };

            dbContext.Contacts.Add(domainModelContact);
            dbContext.SaveChanges();

            return Ok(domainModelContact);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteContact(Guid id)
        {
            var contact = dbContext.Contacts.Find(id);

            if (contact is not null)
            {
                dbContext.Contacts.Remove(contact);
                dbContext.SaveChanges();
                return Ok();
            }

            return NotFound(); 
        }
    }
}
