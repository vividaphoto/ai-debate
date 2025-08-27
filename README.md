```markdown
# AI Debate - Converged AI Responses Through Iterative Discussion

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vividaphoto/ai-debate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com)

> Make ChatGPT and Claude debate each other until their responses converge! A powerful tool for getting more thoughtful, balanced AI responses through iterative refinement.

## Features

- **Automatic Debate Loop** - AI models critique and improve each other's responses
- **Smart Convergence** - Automatically stops when responses align (Jaccard similarity)
- **Real-time Streaming** - Watch tokens appear as they're generated
- **Secure Architecture** - API keys stored server-side, never exposed to browser
- **Cost Effective** - Free hosting on Cloudflare Workers (100k requests/day)
- **Modern UI** - Clean, responsive interface with dark mode

## Demo

![AI Debate Demo](demo.gif)

*Two AI models debating "What's the best programming language for beginners?" and converging on a balanced answer*

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free)
- [OpenAI API key](https://platform.openai.com/api-keys)
- [Anthropic API key](https://console.anthropic.com/settings/keys)

### 1. Clone the repository

```bash
git clone https://github.com/vividaphoto/ai-debate.git
cd ai-debate
```

### 2. Deploy the Worker (Backend)

```bash
cd worker
npm install

# Add your API keys (stored securely, never in code)
npx wrangler secret put OPENAI_API_KEY
# Paste your OpenAI key when prompted

npx wrangler secret put ANTHROPIC_API_KEY
# Paste your Anthropic key when prompted

# Deploy to Cloudflare's edge network
npx wrangler deploy
```

You'll get a URL like: `https://ai-debate-proxy.YOUR-SUBDOMAIN.workers.dev`

### 3. Configure Frontend

Edit `frontend/index.html` and update the Worker URL:

```javascript
// Line 234 - Update with your Worker URL
const WORKER_BASE = "https://ai-debate-proxy.YOUR-SUBDOMAIN.workers.dev";
```

### 4. Deploy Frontend

#### Option A: GitHub Pages
1. Push to GitHub
2. Settings -> Pages -> Deploy from main branch
3. Access at `https://vividaphoto.github.io/ai-debate`

#### Option B: Local Testing
```bash
cd frontend
python -m http.server 8000
# Open http://localhost:8000
```

#### Option C: Netlify/Vercel
Simply drag the `frontend` folder to [Netlify](https://app.netlify.com/drop) or [Vercel](https://vercel.com)

## Architecture

The system consists of three main components:

1. **Browser (Frontend)** - User interface for configuring and running debates
2. **Cloudflare Worker (Edge Proxy)** - Secure middleware handling API keys and requests
3. **AI APIs** - OpenAI and Anthropic endpoints for ChatGPT and Claude

API keys are stored securely in the Worker and never exposed to the browser.

## How It Works

1. **Initial Query**: Both models receive the same question
2. **Critique Phase**: Model B critiques and improves Model A's response
3. **Integration Phase**: Model A integrates B's feedback
4. **Convergence Check**: Jaccard similarity algorithm checks alignment
5. **Iteration**: Repeats until convergence or max turns reached

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| Temperature | 0.3 | Response creativity (0=focused, 1=creative) |
| Max Tokens | 800 | Maximum response length |
| Max Turns | 3 | Maximum debate iterations |
| Convergence | 0.6 | Similarity threshold (0-1) |

## Supported Models

- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Claude 3.5 Sonnet, Claude 3 Haiku

## Security & Privacy

- API keys stored server-side only (Cloudflare secrets)
- No logging of conversation content
- CORS configured for security
- No tracking or analytics
- Your data never touches our servers

## Cost Estimation

| Usage | Estimated Cost/Month |
|-------|---------------------|
| Personal (10 debates/day) | ~$5-10 |
| Team (100 debates/day) | ~$50-100 |
| Heavy (1000 debates/day) | ~$500-1000 |

*Costs vary based on model selection and response length*

## Advanced Configuration

### Custom Convergence Algorithm

Edit `worker/src/worker.ts` to implement custom convergence:

```typescript
// Example: Semantic similarity using embeddings
async function checkConvergence(textA: string, textB: string): Promise<number> {
  // Your custom implementation
}
```

### Rate Limiting

Add rate limiting using Cloudflare KV:

```typescript
const key = `rate:${request.headers.get('CF-Connecting-IP')}`;
const count = await env.KV.get(key) || 0;
if (count > 100) {
  return new Response("Rate limit exceeded", { status: 429 });
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Important Notes

- **API Keys Required**: You need your own OpenAI and Anthropic API keys
- **Costs**: You are responsible for API usage costs
- **Terms of Service**: Ensure compliance with OpenAI and Anthropic ToS
- **No Warranty**: This software is provided as-is without warranty

## Acknowledgments

- Inspired by the iterative refinement patterns in human discourse
- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- UI inspired by modern AI interfaces
- Community feedback from [HackerNews](https://news.ycombinator.com) and Reddit

## Created by a Visual Artist

This tool was created by Vivida Photo PC, an Italian photographer specializing in:
- **Fine Art Photography** - [Portfolio](https://vividaphoto.com)
- **Photographic Mosaics** - [OBJKT Collection](https://objkt.com/@vivida)
- **NFT Art** - Authentic Italian imagery with commercial rights

Interested in unique visual content for your brand? [Contact me](mailto:vividaphoto@vividaphoto.com)

## Contact

Vivida Photo PC - [@VividaPhotoPC](https://twitter.com/VividaPhotoPC)

Project Link: [https://github.com/vividaphoto/ai-debate](https://github.com/vividaphoto/ai-debate)

---

<p align="center">
  Made with love by the open source community
</p>

<p align="center">
  <a href="https://github.com/vividaphoto/ai-debate/stargazers">Star this repo</a> |
  <a href="https://github.com/vividaphoto/ai-debate/issues">Report Bug</a> |
  <a href="https://github.com/vividaphoto/ai-debate/issues">Request Feature</a>
</p>
```

