# NETRIX Cloudflare Worker Deployment Guide

**Target Domain:** `https://netrix.prakashkushwaha77.com.np`  
**Publisher:** PB Tech Zone  
**Author:** Pankaj Kushwaha  

---

## How to Deploy to your Cloudflare Worker:

### Option 1: Copy & Paste via Cloudflare Dashboard (Fastest, 1 minute)
1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Click **Compute (Workers) > Workers & Pages**.
3. Click your worker for `netrix.prakashkushwaha77.com.np`.
4. Click **Edit code** (in the top right corner).
5. Open `cloudflare-worker/worker.js` from this folder, copy all code, and paste it into Cloudflare's online code editor.
6. Click **Deploy**.
7. Test in your browser: `https://netrix.prakashkushwaha77.com.np/health` should return:
   ```json
   {
     "status": "online",
     "service": "NETRIX Cloudflare Edge Gateway",
     "publisher": "PB Tech Zone",
     "owner": "Pankaj Kushwaha"
   }
   ```

---

### Option 2: Deploy using Wrangler CLI
In your terminal, run:
```bash
cd cloudflare-worker
npx wrangler deploy
```

