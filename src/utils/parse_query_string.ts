export default function parseQueryFromUrl(url: string): any {
 let queryString = url.split("?")[1];
 queryString = decodeURIComponent(queryString.replace(/\+/g, " "));
 queryString = queryString.replace(/&amp;/g, "&");

 const params = queryString.split("&");
 const parsed: any = {};
 params.forEach((param) => {
  const [key, value] = param.split("=");
  parsed[key] = value;
 });
 return parsed;
}
