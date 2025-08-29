import arcjet, { shield, detectBot, tokenBucket,validateEmail } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";


const aj = arcjet({
  
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    
    shield({ mode: "LIVE" }),
    
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
      ],
    }),
    validateEmail({
      mode: "LIVE", 
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
    
    tokenBucket({
      type:"RATE_LIMIT",
      mode: "LIVE",
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;