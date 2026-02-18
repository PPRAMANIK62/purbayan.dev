# System Design Interview Prep

## Fundamentals

Distributed systems break down when you ignore the basics. Before jumping into specific architectures, get comfortable with `CAP theorem`, `consistent hashing`, and `replication strategies`. Everything else builds on top of these.

Scalability comes in two flavors. **Vertical scaling** means throwing more power at a single machine. **Horizontal scaling** means adding more machines. Most real-world systems lean horizontal because there's a ceiling on how beefy one box can get.

| Property       | SQL (PostgreSQL, MySQL)        | NoSQL (MongoDB, Cassandra)     |
| -------------- | ------------------------------ | ------------------------------ |
| Schema         | Fixed, predefined              | Flexible, dynamic              |
| Scaling        | Vertical (mostly)              | Horizontal (built-in)          |
| Transactions   | Full ACID support              | Varies by engine               |
| Query Language | Standardized SQL               | Database-specific              |
| Best For       | Complex relations, consistency | High throughput, flexible data |

Pick your database based on access patterns, not hype. If you need joins and strong consistency, go relational. If you need to scale writes across regions, consider a wide-column store like `Cassandra`.

---

## Common Patterns

These show up in almost every system design interview:

- **Database sharding** splits data across multiple databases by a shard key
- **Event-driven architecture** decouples services through message queues like `Kafka` or `RabbitMQ`
- **CQRS** separates read and write models for independent scaling
- **Circuit breaker** prevents cascading failures when downstream services go down
- **Write-ahead logging** ensures durability by logging changes before applying them

### Load Balancing

A load balancer distributes incoming traffic across a pool of servers. Without one, a single server becomes your bottleneck _and_ your single point of failure.

Common algorithms:

1. Round Robin
2. Least Connections
3. Weighted Round Robin
4. IP Hash
5. Consistent Hashing

#### Round Robin

The simplest approach. Requests go to each server in order, cycling back to the first when you reach the end. Works well when all servers have similar capacity. Falls apart when they don't.

#### Consistent Hashing

Maps both servers and keys onto a hash ring. When a node joins or leaves, only `K/n` keys need to remap (where `K` is total keys and `n` is total nodes). This is how `DynamoDB` and `Cassandra` distribute data.

### Rate Limiting

Protect your APIs from abuse. Here's a simple token bucket implementation:

```python
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate
        self.last_refill = time.monotonic()

    def allow_request(self) -> bool:
        self._refill()
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False

    def _refill(self):
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now
```

Other approaches include `sliding window log`, `sliding window counter`, and `leaky bucket`. Each trades off memory usage against precision.

---

## Study Checklist

- [x] Understand CAP theorem and its real-world tradeoffs
- [x] Practice back-of-the-envelope estimation
- [x] Design a URL shortener (the "hello world" of system design)
- [ ] Design a distributed message queue
- [ ] Design a real-time chat system with presence indicators
- [ ] Design a news feed ranking algorithm
- [ ] Review how **DNS resolution** works end to end
- [ ] Study the architecture of a CDN like _Cloudflare_ or _Akamai_

---

## Key Metrics to Remember

When estimating, these numbers save you:

- A single server handles roughly **1,000 concurrent connections**
- SSD random reads: ~100 microseconds
- Network round trip within a datacenter: ~500 microseconds
- `Redis` can handle ~100k operations per second on a single node
- A well-tuned `PostgreSQL` instance handles ~10k transactions per second

> "Design is not just what it looks like and feels like. Design is how it works."
> _Steve Jobs_

That applies to system design too. A clean architecture diagram means nothing if you can't explain the failure modes.

## Resources

1. _Designing Data-Intensive Applications_ by Martin Kleppmann
2. [System Design Primer](https://github.com/donnemartin/system-design-primer) on GitHub
3. _Building Microservices_ by Sam Newman
4. [High Scalability Blog](http://highscalability.com/) for real-world case studies
5. _Database Internals_ by Alex Petrov

Start with Kleppmann's book. It covers the theory behind every pattern listed above, with enough depth to survive follow-up questions in an interview.
