﻿using AustyReality.Models;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Runtime.Caching;
using System.Web.Http;
using System.Web.Http.Description;

namespace AustyReality.ControllersWebApi
{
    public class UserController : ApiController
    {
        private RealityDbContext _realityDb = new RealityDbContext();

        readonly CacheItemPolicy cacheItemPolicy = new CacheItemPolicy
        {
            SlidingExpiration = TimeSpan.FromMinutes(20)
        };

        [ClientAuthorization]
        public IQueryable<RealityUser> Get()
        {
            return _realityDb.Users;
        }


        [HttpGet]
        public object Login(string username, string password)
        {
            RealityUser user = _realityDb.Users.SingleOrDefault(u => u.Email == username && u.Password == password);
            if (user == null)
            {
                return NotFound();
            }

            var sessionId = Guid.NewGuid().ToString();
            MemoryCache.Default.Add(sessionId, user, cacheItemPolicy);

            var auth = new
            {
                Id = user.RealityUserId,
                UserName = user.Email,
                Token = sessionId
            };

            return Ok(auth);
        }

        [HttpGet]
        public IHttpActionResult Logout(string SessionId)
        {
            if (MemoryCache.Default.Contains(SessionId))
            {
                MemoryCache.Default.Remove(SessionId);
                return Ok(true);
            }
            return NotFound();
        }

        [ClientAuthorization]
        public IHttpActionResult Put(int id, RealityUser user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.RealityUserId)
            {
                return BadRequest();
            }

            _realityDb.Entry(user).State = EntityState.Modified;

            try
            {
                _realityDb.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        [ClientAuthorization]
        [ResponseType(typeof(RealityUser))]
        public IHttpActionResult Post(RealityUser user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _realityDb.Users.Add(user);
            _realityDb.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = user.RealityUserId }, user);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(RealityUser))]
        public IHttpActionResult Delete(int id)
        {
            RealityUser user = _realityDb.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            _realityDb.Users.Remove(user);
            _realityDb.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _realityDb.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return _realityDb.Users.Count(e => e.RealityUserId == id) > 0;
        }
    }
}