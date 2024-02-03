using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    // generic
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                // How many pages do we need? returns integer of count / pageSize as double
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            // aplplies to (this) (so PagedList)
            AddRange(items);
        }

        public MetaData MetaData { get; set; }

        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            // getting from ProductParams
            var count = await query.CountAsync();
            // if on page number 2, subtract 1 = 1 * pagesize of 10 = 10 then take the next pagesize of 10 and add to list
            var items = await query.Skip((pageNumber -1)*pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
