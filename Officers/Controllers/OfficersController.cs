using Officers.Models;
using Raven.Client.Document;
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
		private readonly DocumentStore documentStore;

		public OfficersController()
		{
			documentStore = new DocumentStore { Url = "http://localhost:8080/", DefaultDatabase = "DNUG" };
			documentStore.Initialize();
		}

		public IEnumerable<Officer> Get()
		{
			using (var session = documentStore.OpenSession())
			{
				return session.Query<Officer>().ToList();
			}
		}

		public Officer Get(int id)
		{
			using (var session = documentStore.OpenSession())
			{
				return session.Load<Officer>(id);
			}
		}

		public HttpResponseMessage Post([FromBody]Officer officer)
		{
			using (var session = documentStore.OpenSession())
			{
				session.Store(officer);
				session.SaveChanges();
			}
			var response = Request.CreateResponse<Officer>(HttpStatusCode.Created, officer);
			string uri = Url.Link("DefaultApi", new { id = officer.Id });
			response.Headers.Location = new Uri(uri);
			return response;
		}

		public Officer Put(int id, [FromBody]Officer officer)
		{
			officer.Id = id;
			using (var session = documentStore.OpenSession())
			{
				session.Store(officer);
				session.SaveChanges();
			}
			return officer;
		}

		public void Delete(int id)
		{
			using (var session = documentStore.OpenSession())
			{
				var officer = session.Load<Officer>(id);
				if (officer != null)
				{
					session.Delete<Officer>(officer);
					session.SaveChanges();
				}
			}
		}
	}
}