// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function cleanObject(obj: any) {
 for (const propName in obj) {
  if (obj[propName] === null || obj[propName] === undefined) {
   delete obj[propName];
  }
 }
 return obj;
}
