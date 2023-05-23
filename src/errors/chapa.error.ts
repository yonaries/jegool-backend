export default class ChapaError {
 public provider: string;
 public status: string;
 public message: string;
 constructor(message: string, status: string) {
  this.provider = "chapa";
  this.message = message;
  this.status = status;

  Object.setPrototypeOf(this, ChapaError.prototype);
 }
}
