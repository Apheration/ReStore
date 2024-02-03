using API.Entities;
using API.RequestHelpers;
using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        // tells we're extending class by using this in parameter - this HttpResponse response
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
            // careful of spelling for Access-Control-Expose-Headers
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");

        }
    }
}
