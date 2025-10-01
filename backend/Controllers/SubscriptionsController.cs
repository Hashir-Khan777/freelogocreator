using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

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
        public IActionResult Add([FromBody] Models.Subscription subscription)
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
            List<Models.Subscription> all_subscriptions = db.Subscriptions.OrderByDescending(x => x.Id).ToList();

            return Ok(new { data = all_subscriptions });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Models.Subscription? subscription = db.Subscriptions.FirstOrDefault(x => x.Id == id);

            if (subscription != null)
            {
                return Ok(new { data = subscription });
            }
            else
            {
                return NotFound(new { message = "Subscription not found" });
            }
        }

        [HttpGet("user/{id}")]
        public IActionResult GetByUserId(int id)
        {
            Models.Subscription? subscription = db.Subscriptions.FirstOrDefault(x => x.user_id == id);


            if (subscription != null)
            {
                Packages? package = db.Packages.FirstOrDefault(x => x.Id == subscription.package_id);
                return Ok(new { data = new { subscription, package } });
            }
            else
            {
                return NotFound(new { message = "Subscription not found" });
            }
        }

        [HttpPut]
        public IActionResult Update([FromBody] Models.Subscription obj)
        {
            Models.Subscription? subscription = db.Subscriptions.FirstOrDefault(x => x.user_id == obj.user_id);
            subscription.created_at = DateTime.UtcNow;
            subscription.updated_at = DateTime.UtcNow;
            subscription.package_id = obj.package_id;
            db.SaveChanges();

            return Ok(new { message = "Subscription updated successfully", data = subscription });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Models.Subscription? subscription = db.Subscriptions.FirstOrDefault(x => x.Id == id);

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

        public class SubscriptionRequest
        {
            public int user_id { get; set; }
            public string name { get; set; } = string.Empty;
            public long amount { get; set; }
            public int package { get; set; }
        }

        [HttpPost("subscribe")]
        public IActionResult CreateCheckoutSession(SubscriptionRequest obj)
        {
            User? user = db.Users.FirstOrDefault(x => x.Id == obj.user_id);

            if (user == null)
            {
                return NotFound(new { message = "Login your account" });
            }

            if (user.sessionId != null)
            {
                var sessionService = new SessionService();
                var usersession = sessionService.Get(user.sessionId);


                var subscriptionId = usersession.SubscriptionId;

                if (subscriptionId != null)
                {
                    var subscriptionService = new SubscriptionService();
                    subscriptionService.Cancel(subscriptionId, null);
                }
            }

            var priceOptions = new PriceCreateOptions
            {
                UnitAmount = obj.amount,
                Currency = "usd",
                Recurring = new PriceRecurringOptions
                {
                    Interval = "month",
                },
                ProductData = new PriceProductDataOptions
                {
                    Name = obj.name,
                },
            };
            var priceService = new PriceService();
            Price price = priceService.Create(priceOptions);
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string>
            {
                "card",
            },
                LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = price.Id,
                    Quantity = 1,
                },
            },
                Mode = "subscription",
                SuccessUrl = $"https://www.smartqrcodeandlogo.com?payment=success&package={obj.package}",
                CancelUrl = "https://www.smartqrcodeandlogo.com?payment=error",
            };

            var service = new SessionService();
            Session session = service.Create(options);

            user.sessionId = session.Id;
            db.SaveChanges();

            return Ok(new { url = session.Url });
        }

        [HttpPost("subscribe/free")]
        public IActionResult SubscribeFree(SubscriptionRequest obj)
        {
            User? user = db.Users.FirstOrDefault(x => x.Id == obj.user_id);

            if (user == null)
            {
                return NotFound(new { message = "Login your account" });
            }

            if (user.sessionId != null)
            {
                var sessionService = new SessionService();
                var usersession = sessionService.Get(user.sessionId);

                var subscriptionId = usersession.SubscriptionId;

                if (subscriptionId != null)
                {
                    var subscriptionService = new SubscriptionService();
                    subscriptionService.Cancel(subscriptionId, null);
                }

                user.sessionId = null;
                db.SaveChanges();
            }

            return Ok(new { url = $"https://www.smartqrcodeandlogo.com?payment=success&package={1}" });
        }
    }
}
