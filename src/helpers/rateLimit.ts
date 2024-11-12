type RateLimitEntry = {
    lastRequestTime: number;
    requestCount: number;
  };
  
  // Define a Map to store requests (replace with Redis or another store for production)
  const rateLimitMap = new Map<string, RateLimitEntry>();
  
  // Define your rate limit parameters
  const MAX_REQUESTS = 10; // Max number of requests allowed
  const TIME_WINDOW = 60 * 1000; // Time window in milliseconds (e.g., 1 minute)
  
  export function rateLimit(ip: string): boolean {
    const currentTime = Date.now();
    const entry = rateLimitMap.get(ip);
  
    if (!entry) {
      // First request from this IP
      rateLimitMap.set(ip, { lastRequestTime: currentTime, requestCount: 1 });
      return false; // Not rate-limited
    }
  
    const timeSinceLastRequest = currentTime - entry.lastRequestTime;
  
    if (timeSinceLastRequest < TIME_WINDOW) {
      // Within the time window
      if (entry.requestCount >= MAX_REQUESTS) {
        // Exceeds rate limit
        return true; // Rate-limited
      } else {
        // Increment request count
        entry.requestCount += 1;
        rateLimitMap.set(ip, entry);
        return false; // Not rate-limited
      }
    } else {
      // Reset the count after the time window has passed
      rateLimitMap.set(ip, { lastRequestTime: currentTime, requestCount: 1 });
      return false; // Not rate-limited
    }
  }