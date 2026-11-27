export default async function handler(request, context) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");

  if (host === "localhost" || host === "127.0.0.1") {
    return context.next();
  }

  const oldDomains = [
    "sidelinechiangmai.netlify.app",
    "www.sidelinechiangmai.netlify.app",
    "firstmodelhub.netlify.app",
    "www.firstmodelhub.com",
    "st.firstmodelhub.com"
  ];

  if (oldDomains.includes(host) || proto !== "https") {
    url.hostname = "firstmodelhub.com";
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}