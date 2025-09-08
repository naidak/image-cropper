using ImageCropper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageCropper.Data.ConfigRepository
{
    public interface IConfigRepository
    {
        Task<Config?> GetLastAsync();
        Task<Config?> GetByIdAsync(int id);
        Task AddAsync(Config cfg);
        Task UpdateAsync(Config cfg);
    }
}
