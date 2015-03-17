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
        readonly Size imgSizeSmall = new Size(120, 100);
        readonly Size imgSizeNormal = new Size(430, 300);
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
                    var realityImage = new RealityImage
                    {
                            RealityId = realityId,
                            Guid = Guid.NewGuid().ToString()
                        };

                    try
                    {
                        //Original sized image
                        //var buffer = await file.ReadAsStreamAsync();
                        //AzureBlob.UploadBlob(buffer, string.Format("{0}-{1}.jpg", image.RealityId, image.Guid), AzureBlob.RealityBlobType.SmallImage);

                        var stream = await file.ReadAsStreamAsync();
                        var originalImage = Image.FromStream(stream);

                        UploadImage(originalImage, realityImage, imgSizeSmall, AzureBlob.RealityBlobType.SmallImage);
                        UploadImage(originalImage, realityImage, imgSizeNormal, AzureBlob.RealityBlobType.NormalImage);

                        db.RealityImages.Add(realityImage);
                        db.SaveChanges();
                    }
                    catch(Exception e) {
                        BadRequest(e.Message);
                    }
                
                }
            }
            
            return Ok();
        }

        private void UploadImage(Image imageData, RealityImage image, Size imgSize, AzureBlob.RealityBlobType blobType)
        {
            var imgResized = ImageResizer.Resize(imageData, imgSize, imageQuality);
            imgResized.Save(string.Format(@"c:\temp\{0}-{1}.jpg", image.RealityId, image.Guid));
            return;

            Stream resizedImageStrem = new MemoryStream();
            imgResized.Save(resizedImageStrem, ImageFormat.Jpeg);
            AzureBlob.UploadBlob(
                resizedImageStrem, 
                string.Format("{0}-{1}.jpg", image.RealityId, image.Guid), 
                blobType);
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