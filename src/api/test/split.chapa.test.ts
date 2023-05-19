import { CreateSubaccountOptions, SplitType } from "chapa-nodejs";
import ChapaController from "../chapa/chapa.controller";

const randomNumber = () => {
 const acc = `1000${Math.floor(Math.random() * 900000000) + 100000000}`;
 return acc;
};
describe("Split Chapa", () => {
 it("should create subaccount on chapa", async () => {
  const bank: CreateSubaccountOptions = {
   business_name: "Hobbyist",
   account_name: "John Doe",
   bank_code: "96e41186-29ba-4e30-b013-2ca36d7e7025",
   account_number: randomNumber(),
   split_value: 0.08,
   split_type: SplitType.PERCENTAGE,
  };

  const response = await ChapaController.createSubaccount(bank);
  expect(response).toBeTruthy();
 });
});
