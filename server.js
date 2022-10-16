if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const ArticleRouter = require('./routes/Article');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middleware/errorHandler');
const { logMethod } = require('./middleware/logMethod');

const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(errorHandler);
app.use(logMethod);

app.get('/', (req, res) => {
  res.send('Home');
});

app.use('/articles', ArticleRouter);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/public')));
} else {
  app.get('/', (req, res) => {
    res.send('Please set to production');
  });
}

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (err) => console.log(err));
db.on('open', () => console.log('Connected to Mongoose'));

app.listen(3000, () => {
  console.log(`Listening on port ${PORT}`);
});
