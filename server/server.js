import jsonServer from "json-server";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("server/db.json");
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Custom login route
server.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = router.db.get("users").value();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    // Respond with only the username
    res.jsonp({
      username: user.username,
    });
  } else {
    res.status(401).jsonp({ error: "Invalid username or password" });
  }
});

// Fallback to default JSON Server router
server.use(router);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
