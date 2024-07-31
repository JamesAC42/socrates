const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const http = require('http');

const app = express();
const httpServer = http.createServer(app);
const redisClient = redis.createClient({ legacyMode: true });
const port = 5000;

const config = require('./config.json');
const redisLogin = require('./redis_login.json');

redisClient.auth(redisLogin.password);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'domoarigato',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.secureSession, // Set to true if using HTTPS
    },
  })
);
// Middleware
app.use(express.json());

const LLM = require("./LLM");
const llm = new LLM(redisClient);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/test', (req, res) => {
    res.json({hello:"world"});
});

app.post('/sendMessage', async (req, res) => {

    const {message} = req.body;
    let response = await llm.conversationAddMessage(1,1,message);
    res.json({success:true, message: response});

});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});