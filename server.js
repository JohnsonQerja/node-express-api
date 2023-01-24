require('dotenv').config();

// const http = require('http');
const PORT = process.env.PORT || 3030
const app = require('./app');

// const server = http.createServer(app);

// server.listen(PORT, () => console.log('Server is running'));

app.listen(PORT, () => console.log(`Server is runing at port: ${PORT}`));