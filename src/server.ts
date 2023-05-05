import app from "./app";
import { getPort } from "./port";

const port = getPort();
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
