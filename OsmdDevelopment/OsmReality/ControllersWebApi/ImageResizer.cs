using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Linq;

namespace AustyReality.ControllersWebApi
{
    public static class ImageResizer
    {
        /// <summary>
        /// Method to resize, convert and save the image in unchanged aspect ratio. 
        /// </summary>      
        public static Image Resize(Image image, Size maxSize, int quality)
        {
            int maxWidth = maxSize.Width;
            int maxHeight = maxSize.Height;

            // Get the image's original width and height
            int originalWidth = image.Width;
            int originalHeight = image.Height;

            // To preserve the aspect ratio
            float ratioX = maxWidth / (float)originalWidth;
            float ratioY = maxHeight / (float)originalHeight;
            float ratio = Math.Min(ratioX, ratioY);

            // New width and height based on aspect ratio
            var newWidth = (int)(originalWidth * ratio);
            var newHeight = (int)(originalHeight * ratio);

            // Convert other formats (including CMYK) to RGB.
            var newImage = new Bitmap(newWidth, newHeight, PixelFormat.Format24bppRgb);

            // Draws the image in the specified size with quality mode set to HighQuality
            using (Graphics graphics = Graphics.FromImage(newImage))
            {
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.DrawImage(image, 0, 0, newWidth, newHeight);
            }

            // Get an ImageCodecInfo object that represents the JPEG codec.
            //ImageCodecInfo imageCodecInfo = GetEncoderInfo(ImageFormat.Jpeg);

            // Create an Encoder object for the Quality parameter.
            Encoder encoder = Encoder.Quality;

            // Create an EncoderParameters object. 
            var encoderParameters = new EncoderParameters(1);

            // Save the image as a JPEG file with quality level.
            var encoderParameter = new EncoderParameter(encoder, quality);
            encoderParameters.Param[0] = encoderParameter;

            //var outStream = new MemoryStream();
            //newImage.Save(outStream, imageCodecInfo, encoderParameters);

            return newImage;
        }

        /// <summary>
        /// Method to get encoder infor for given image format.
        /// </summary>
        /// <param name="format">Image format</param>
        /// <returns>image codec info.</returns>
        //private static ImageCodecInfo GetEncoderInfo(ImageFormat format)
        //{
        //    return ImageCodecInfo.GetImageDecoders().SingleOrDefault(c => c.FormatID == format.Guid);
        //}
    }
}