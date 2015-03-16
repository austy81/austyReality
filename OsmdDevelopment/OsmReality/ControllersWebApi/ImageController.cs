using AustyReality.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Linq;
using System.Net.Http.Headers;
using System.Drawing;
using System.Drawing.Imaging;

namespace AustyReality.ControllersWebApi
{
    public class ImageController : ApiController
    {
        readonly Size smallImgSize = new Size(120, 100);
        readonly Size normalImgSize = new Size(430, 300);
        private const int imageQuality = 80;

        [HttpGet, Route("api/Image")]
        public IEnumerable<RealityImage> Get(int realityId)
        {
            using (var db = new RealityDbContext())
            {
                return db.RealityImages.Where(x => x.RealityId == realityId);
            }
        }

        [HttpPost, Route("api/Image")]
        public async Task<IHttpActionResult> Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new Exception(); // divided by zero

            int realityId = GetRealityId(Request.Headers);

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);
            
            using (var db = new RealityDbContext())
            {
                
                foreach (var file in provider.Contents)
                {
                    var image = new RealityImage
                    {
                            RealityId = realityId,
                            Guid = Guid.NewGuid().ToString()
                        };

                    try
                    {

                        //var buffer = await file.ReadAsStreamAsync();
                        //AzureBlob.UploadBlob(buffer, string.Format("{0}-{1}.jpg", image.RealityId, image.Guid), AzureBlob.RealityBlobType.SmallImage);


                        var stream = await file.ReadAsStreamAsync();
                        var myImage = Image.FromStream(stream);
                        myImage = ImageResizer.Resize(myImage, smallImgSize, imageQuality);
                        
                        var smallImg = ImageResizer.Resize(myImage, smallImgSize, imageQuality);
                        Stream smallImgStream = new MemoryStream();
                        smallImg.Save(smallImgStream,ImageFormat.Jpeg);
                        AzureBlob.UploadBlob(smallImgStream, string.Format("{0}-{1}.jpg", image.RealityId, image.Guid), AzureBlob.RealityBlobType.SmallImage);

                        //var normalImg = ImageResizer.Resize(myImage, normalImgSize.Width, normalImgSize.Height, imageQuality);
                        //AzureBlob.UploadBlob(normalImg, string.Format("{0}-{1}.jpg", image.RealityId, image.Guid), AzureBlob.RealityBlobType.NormalImage);

                        db.RealityImages.Add(image);
                        db.SaveChanges();
                    }
                    catch(Exception e) {
                        BadRequest(e.Message);
                    }
                
                }
            }
            
            return Ok();
        }

        private int GetRealityId(HttpRequestHeaders headers)
        {
            IEnumerable<string> realityIdArr;
            if (!headers.TryGetValues("realityId", out realityIdArr))
                throw new Exception();

            string realityIdString = realityIdArr.SingleOrDefault();

            int realityId;
            if (!int.TryParse(realityIdString, out realityId))
                throw new Exception();
            return realityId;
        }
    }
}