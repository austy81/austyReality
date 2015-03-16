using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Configuration;
using System.IO;

namespace AustyReality.ControllersWebApi
{
    public static class AzureBlob
    {
        public enum RealityBlobType
        {
            SmallImage,
            NormalImage
        }

        public static void InitContainers()
        {
            foreach(RealityBlobType blobType in Enum.GetValues(typeof(RealityBlobType)))
            {
                CloudBlobContainer container = GetBlobContainer(blobType);
                container.SetPermissions(
                    new BlobContainerPermissions
                    {
                        PublicAccess = BlobContainerPublicAccessType.Blob
                    });
                container.CreateIfNotExists();
            }
        }

        public static void UploadBlob(Stream img, string fileName, RealityBlobType blobType)
        {
            var container = GetBlobContainer(blobType);
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);
            //blockBlob.UploadFromStream(img);

            using (var fileStream = File.OpenRead(@"D:\Fotos\prodej\IMG-20141122-00740.jpg"))
            {
                blockBlob.UploadFromStream(fileStream);
            } 
         }

        private static CloudBlobContainer GetBlobContainer(RealityBlobType blobType)
        {
            var storageConnectionString = ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString;
            var blobStorageName = GetBlobStorageName(blobType);

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(blobStorageName);
            return container;
        }

        private static string GetBlobStorageName(RealityBlobType blobType)
        {
            return ConfigurationManager.AppSettings["BlobStorageNames"].Split("|".ToCharArray())[(int)blobType];
        }
    }
}