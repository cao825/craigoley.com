using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CraigOleycom.Controllers
{
    public class BgpicsController : ApiController
    {
        String[] bgpictures = new String[]
        {
            "https://drscdn.500px.org/photo/98393111/m=900/a72e2b60a8e363e43945a76cb8ff7096",
            "https://drscdn.500px.org/photo/98393125/m=900/5535c06e50e7b045b0d0269e2c743013",
            "https://drscdn.500px.org/photo/98393135/m=900/b507261fe70abf3b997eead2bc163080",
            "https://drscdn.500px.org/photo/98393137/m=900/de2c2e0e7511b869d512b32dda1e5495",
            "https://drscdn.500px.org/photo/98393139/m=900/acfbf97c0d8c63eb2ea72180da1f1572",
            "https://drscdn.500px.org/photo/98434319/m=900/e9d4ff3c1afc3763e97959af92c91ac5",
            "https://drscdn.500px.org/photo/98434343/m=900/cebcaf988838055092036df59043cbfc",
            "https://drscdn.500px.org/photo/98646079/m=900/3679e904b47a3ca586daf071af2ca402",
            "https://drscdn.500px.org/photo/98646085/m=900/3a7419091633ccb082fc4be59d268d5f",
            "https://drscdn.500px.org/photo/98646575/m=900/3dcc58113043313e30d6d0406864ef82",
            "https://drscdn.500px.org/photo/98650163/m=900/668d9ebeca8b9c1c98d3ab66e6739870",
            "https://drscdn.500px.org/photo/98660005/m=900/333103f54b0249c137e7246031c55f34",
            "https://drscdn.500px.org/photo/98664405/m=900/60b6d111694d0a67fffd9709733b24d1",
            "https://drscdn.500px.org/photo/98659999/m=900/ca0172e4012692b61399a39088d2f808",
            "https://drscdn.500px.org/photo/104343063/m=2048/0af69abdbb33815edb5eb8c433c8a43a"
        };

        [HttpGet]
        [ActionName("Get")]
        public IEnumerable<string> Get()
        {
            return bgpictures;
        }
    }
}
