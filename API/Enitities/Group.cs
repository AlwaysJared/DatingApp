using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Enitities
{
    public class Group
    {
        public Group()
        {

        }
        public Group(string name)
        {
            Name = name;
        }

        [Key]
        public string Name { get; set; }
        public ICollection<Connection> Connecitons { get; set; } = new List<Connection>();
    }
}
