const http = require("node:http");
const hostname = "127.0.0.1";
const port = 4000;
const User = require("./app/model");

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/users") {
    // Set the response status and content type
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    const users = await User.findAll();
    // Convert the user object to JSON and send it as the response
    res.end(JSON.stringify(users));
  } else if (req.method === "POST" && req.url === "/users") {
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      console.log(body);
      const data = JSON.parse(body);
      try {
        const newUser = await User.create(data) 
        res.end(JSON.stringify(newUser));
      } catch (error) {
        console.error("Error creating user:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });
  } else if(req.method === "DELETE" && req.url.startsWith('/users/')){
    res.statusCode = 204;
    res.setHeader("Content-Type", "application/json");
    req.on("end", async()=>{
      const userId = req.url.split("/")[2]
      await User.destroy({
        where: {
          id: userId
        }
      });
    }
    )
    res.end();
  }
  else if(req.method === "PATCH" && req.url.startsWith('/users/')){
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      const userId = req.url.split("/")[2]
      try {
        const user = await User.findOne({ where: { id: userId } });
        if (user) {
          await user.update(data);
          res.end(JSON.stringify(user));
        } else {
          res.statusCode = 404; // Not Found
          res.end('User not found');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

  }
  else if(req.method === "GET" && req.url === "/"){
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.writeHead(307, { Location: "/users" });
    res.end();
  }
  else {
    // Handle other routes or methods
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
