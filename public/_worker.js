export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot/i.test(userAgent);

    // Fetch the original response
    const response = await env.ASSETS.fetch(request);
    
    // Only modify HTML responses for bots
    if (isBot && response.headers.get('content-type')?.includes('text/html')) {
      const html = await response.text();
      
      // Ensure meta tags are present (they should be from your index.html)
      const modifiedHtml = html;
      
      return new Response(modifiedHtml, {
        headers: response.headers,
      });
    }

    return response;
  },
};