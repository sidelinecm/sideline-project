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

  // ตรวจสอบว่าเป็นโดเมนเก่า หรือเป็น HTTP ธรรมดาที่ไม่ได้เข้ารหัส
  const isOldDomain = oldDomains.includes(host);
  const isHttp = url.protocol === "http:";

  if (isOldDomain || isHttp) {
    url.hostname = "firstmodelhub.com";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}