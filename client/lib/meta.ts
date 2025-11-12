export function setMetaTags(config: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  document.title = config.title;
  
  const tags = [
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:image', content: config.image },
    { property: 'og:url', content: config.url },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    { name: 'twitter:image', content: config.image },
  ];

  tags.forEach(({ property, name, content }) => {
    let meta = document.querySelector(
      `meta[${property ? 'property' : 'name'}="${property || name}"]`
    );
    if (!meta) {
      meta = document.createElement('meta');
      if (property) meta.setAttribute('property', property);
      if (name) meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });
}