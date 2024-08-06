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
const stripeLogin = require('./stripe.json');
const stripe = require('stripe')(stripeLogin.key);

redisClient.auth(redisLogin.password);

const datamodels = require('./datamodels.js');

app.use('/webhook', express.raw({ type: 'application/json' }));
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

const getConversation = require("./controllers/getConversation.js");
const evaluate = require("./controllers/evaluate.js");
const restartConversation = require("./controllers/restartConversation.js");
const sendMessage = require("./controllers/sendMessage.js");

const login = require("./controllers/login.js");
const logout = require("./controllers/logout.js");
const getSession = require('./controllers/getSession.js');
const startConversation = require('./controllers/startConversation.js');
const loginEmail = require('./controllers/loginEmail.js');
const createUser = require('./controllers/createUser.js');
const createCheckoutSession = require('./controllers/createCheckoutSession.js');
const handleWebhook = require('./controllers/handleWebhook.js');

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/getConversation', async (req, res) => {
    getConversation(req, res, llm);
});

app.post('/getSession', async (req, res) => {
    getSession(req, res, datamodels);
});

app.post('/startConversation', async (req, res) => {
    startConversation(req, res, llm);
});

app.post('/sendMessage', async (req, res) => {
    sendMessage(req, res, llm, datamodels);
});

app.post('/evaluate', async (req, res) => {
    evaluate(req, res, llm, datamodels, redisClient);
});

app.post('/restartConversation', async (req, res) => {
    restartConversation(req, res, llm);
});

app.post('/loginEmail', async (req, res) => {
    loginEmail(req, res, datamodels);
});

app.post('/createAccount', async (req, res) => {
    createUser(req, res, datamodels);
});

app.post('/login', async (req, res) => {
    login(req, res, datamodels);
});

app.post('/logout', async (req, res) => {
    logout(req, res);
});

app.post('/createCheckoutSession', async (req, res) => {
  createCheckoutSession(req, res, stripe);
});

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  handleWebhook(req, res, stripe, stripeLogin);
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});