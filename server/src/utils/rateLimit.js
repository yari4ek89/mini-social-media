import {Redis} from "@upstash/redis";
import dotenv from "dotenv";
import {Ratelimit} from "@upstash/ratelimit";

dotenv.config();

const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});

export const postLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "rl:post"
});

export const commentLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(15, "1 m"),
    prefix: "rl:comment"
});

export const likeLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "rl:like"
});

export async function cooldown(key, ms) {
    const ok = await redis.set(key, "1", {nx: true, px: ms});
    return Boolean(ok);
}

export const delay = (ms) => new Promise(r => setTimeout(r, ms));

export async function guard(limiter, key, res) {
    const {success, limit, remaining, reset} = await limiter.limit(key);
    if (!success) {
        res.setHeader("Retry-After", Math.max(1, Math.ceil((reset - Date.now()) / 1000)));
        res.setHeader("RateLimit-Limit", limit);
        res.setHeader("RateLimit-Remaining", Math.max(0, remaining));
        res.setHeader("RateLimit-Reset", Math.floor(reset / 1000));
    }
    return success;
}