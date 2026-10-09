export default async function handler(request, context) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  const oldDomains = [
    "sidelinechiangmai.netlify.app",
    "www.sidelinechiangmai.netlify.app",
    "firstmodelhub.netlify.app",
    "www.firstmodelhub.com",
    "st.firstmodelhub.com"
  ];

  if (oldDomains.includes(host)) {
    url.hostname = "firstmodelhub.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}