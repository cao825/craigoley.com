using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CraigOleycom.Controllers
{
    public class ServicesController : ApiController
    {
        const int ZOOM_CONV = 12;
        const int MAX_ITERATIONS = 125;
        const string COLOR_FILE = "~/Content/Files/ColorFile.txt";
        const int PIC_WIDTH = 750;
        const int PIC_HEIGHT = 500;

        [HttpGet]
        [ActionName("GetFractal")]
        [Route("api/Services/GetFractal/{min_x}/{max_x}/{min_y}/{max_y}")]
        public HttpResponseMessage GetFractal(double min_x, double max_x, double min_y, double max_y)
        {
            DateTime start_time = DateTime.Now;
            double zoom = calcZoom(min_x, max_x, min_y, max_y);
            double iterations_max_dbl = zoom / ZOOM_CONV;
            int iterations_max = Convert.ToInt32(Math.Round(iterations_max_dbl, 0));
            if(iterations_max > MAX_ITERATIONS)
                iterations_max = MAX_ITERATIONS;



            double image_x = (max_x - min_x) * zoom;
            if (image_x > PIC_WIDTH)
                image_x = PIC_WIDTH;
            double image_y = (max_y - min_y) * zoom;
            if (image_y > PIC_HEIGHT)
                image_y = PIC_HEIGHT;


            // Holds all of the possible colors
            Color[] cs = new Color[256];
            // Fills cs with the colors from the current ColorMap file
            cs = GetColors();
            // Creates the Bitmap we draw to
            Bitmap b = new Bitmap(PIC_WIDTH, PIC_HEIGHT);

            for(int x = 0; x < image_x; x++) {
                for(int y = 0; y < image_y; y++) {
                    double c_r = x / zoom + min_x;
                    double c_i = y / zoom + min_y;
                    double z_r = 0.0;
                    double z_i = 0.0;
                    int i = 0;
                    do {
                        double tmp = z_r;
                        z_r = z_r * z_r - z_i * z_i + c_r;
                        z_i = 2 * tmp * z_i + c_i;
                        i++;
                    } while(z_r * z_r + z_i * z_i < 4 && i < iterations_max);
                    if(i == iterations_max) {
                        b.SetPixel(x, y, Color.Black);
                    } else {
                        double color_index_dbl = (i / MAX_ITERATIONS) * (cs.Length - 1);
                        int color_index = Convert.ToInt32(Math.Round(color_index_dbl, 0));
                        b.SetPixel(x, y, cs[i]);
                    }
                }
            }

            var ms = new MemoryStream();
            b.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            ms.Position = 0;
            HttpResponseMessage r = Request.CreateResponse();
            r.Content = new StreamContent(ms);
            r.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/png");
            r.Content.Headers.ContentLength = ms.Length;

            return r;
        }

        private double calcZoom(double min_x, double max_x, double min_y, double max_y)
        {
            double x_zoom = (PIC_WIDTH / (max_x - min_x));
            double y_zoom = (PIC_HEIGHT / (max_y - min_y));
            if (x_zoom < 0)
                throw new Exception("ERROR: Min X > Max X");
            if (y_zoom < 0)
                throw new Exception("ERROR: Min Y > Max Y");
            double zoom = (x_zoom + y_zoom) / 2;
            return zoom;
        }

        private Color[] GetColors() {
            Color[] c = new Color[256];
            String[] lines = File.ReadAllLines(HttpContext.Current.Server.MapPath(@COLOR_FILE));

            int i = 0;
            for(i = 0; i < Math.Min(256, lines.Length); i++) {
                string[] line_split = ((string)lines[i]).Split(' ');
                c[i] = Color.FromArgb(
                    int.Parse(line_split[0]), 
                    int.Parse(line_split[1]), 
                    int.Parse(line_split[2]));
            }
            for(int j = i; j < 256; j++) {
                c[j] = Color.White;
            }
            return c;
        }
    }
}
