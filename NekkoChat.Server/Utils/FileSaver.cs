using NekkoChat.Server.Models;

namespace NekkoChat.Server.Utils
{
    public class FileSaver
    {
        public static async Task<ResponseDTO<string>> SaveProfilePictureAsync(IFormFile file, string fileOwner, string profilePicsLocation, string hostUrl)
        {
            //string url = "https://localhost:7198/";
            string basedFileRoute = $"Assets/ProfilePictures/{fileOwner}/";

            string fileName = $"{Path.GetRandomFileName()}{Path.GetExtension(file.FileName)}";

            string locationRoute = Path.Combine(profilePicsLocation, basedFileRoute);

            if (!Directory.Exists(locationRoute))
            {
                Directory.CreateDirectory(locationRoute);
            }else
            {
                Directory.Delete(locationRoute);
                Directory.CreateDirectory(locationRoute);
            }

            string finalFileRoute = Path.Combine(locationRoute, fileName);

            try
            {
                using (FileStream fs = File.Create(finalFileRoute))
                {
                    await file.OpenReadStream().CopyToAsync(fs);
                }
                string payload = $"{hostUrl}{basedFileRoute}{fileName}";    
                return new ResponseDTO<string> { SingleUser = payload };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<string> { Success = false, Error = ex.Message, InternalMessage = ex.Message };
            }
        }
    }
}
