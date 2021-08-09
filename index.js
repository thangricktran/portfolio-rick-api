const express = require('express');
const server = express();
const bodyParser = require('body-parser');

async function runServer() {
  await require('./db').connect();
  
  const PORT = Number.parseInt(process.env.PORT, 10) || 3001;
  server.use(express.json());
  // server.use(bodyParser.json());
  
  const portfolioRoutes = require('./routes/portfolios');
  const blogRoutes = require('./routes/blogs');

  server.use(portfolioRoutes);
  server.use(blogRoutes);
  
  server.listen(PORT, (err) => {
    if (err) console.error(err);
  
    console.log(`API Server is running on ${PORT}.`);
  });  
}

runServer();
