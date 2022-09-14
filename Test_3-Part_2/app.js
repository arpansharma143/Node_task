import http from "http";

import Routes from "./routes.js";

const server = http.createServer(Routes);

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
