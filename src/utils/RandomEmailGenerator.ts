export default function fakeEmail() {
 const strValues = "abcdefg12345";
 let strEmail = "";
 let strTmp;
 for (let i = 0; i < 10; i++) {
  strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
  strEmail = strEmail + strTmp;
 }
 strTmp = "";
 strEmail = `${strEmail}@`;
 for (let j = 0; j < 8; j++) {
  strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
  strEmail = strEmail + strTmp;
 }
 strEmail = `${strEmail}.com`;
 return strEmail;
}
