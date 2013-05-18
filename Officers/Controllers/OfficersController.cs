using Officers.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Officers.Controllers
{
	public class OfficersController : ApiController
	{
		public IEnumerable<Officer> Get()
		{
			return new Officer[] { new Officer() { Id = 1, FirstName = "David", LastName = "Schlum" }, new Officer() { Id = 2, FirstName = "Tim", LastName = "Franklin"} };
		}

		public Officer Get(int id)
		{
			return new Officer() { Id = 1, FirstName = "David", LastName = "Schlum" };
		}

		public Officer Post([FromBody]Officer officer)
		{
			officer.Id = new Random().Next();
			return officer;
		}

		public void Put(int id, [FromBody]Officer value)
		{
		}

		public void Delete(int id)
		{
		}
	}
}