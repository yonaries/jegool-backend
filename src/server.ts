import app from "./app";
import { getPort } from "./port";

const port = getPort();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
