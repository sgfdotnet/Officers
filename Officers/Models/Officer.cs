﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Officers.Models
{
	public class Officer
	{
		public int Id { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Office { get; set; }
	}
}