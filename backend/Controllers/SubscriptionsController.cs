using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/subscriptions")]
    [ApiController]
    public class SubscriptionsController : ControllerBase
    {
        private readonly AppDbContext db;

        public SubscriptionsController(AppDbContext context)
        {
            db = context;
        }

        [HttpPost]
        public IActionResult Add([FromBody] Subscription subscription)
        {
            if (db.Subscriptions.Count() > 0)
            {
                subscription.Id = db.Subscriptions.Max(x => x.Id) + 1;
            }
            else
            {
                subscription.Id = 1;
            }
            subscription.created_at = DateTime.UtcNow;
            subscription.updated_at = DateTime.UtcNow;

            db.Subscriptions.Add(subscription);
            db.SaveChanges();

            return Ok(new { message = "Subscription added successfully", data = subscription });
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<Subscription> all_subscriptions = db.Subscriptions.OrderByDescending(x => x.Id).ToList();

            return Ok(new { data = all_subscriptions });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Subscription? subscription = db.Subscriptions.FirstOrDefault(x => x.Id == id);

            if (subscription != null)
            {
                return Ok(new { data = subscription });
            }
            else
            {
                return NotFound(new { message = "Subscription not found" });
            }
        }

        [HttpPut]
        public IActionResult Update([FromBody] Subscription subscription)
        {
            subscription.created_at = DateTime.UtcNow;
            subscription.updated_at = DateTime.UtcNow;
            db.Subscriptions.Update(subscription);
            db.SaveChanges();

            return Ok(new { message = "Subscription updated successfully", data = subscription });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Subscription? subscription = db.Subscriptions.FirstOrDefault(x => x.Id == id);

            if (subscription != null)
            {
                db.Subscriptions.Remove(subscription);
                db.SaveChanges();
                return Ok(new { message = "Subscription deleted successfully", data = subscription });
            }
            else
            {
                return NotFound(new { message = "Subscription not found" });
            }
        }
    }
}
