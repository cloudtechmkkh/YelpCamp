if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
// const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');//helmet@4
const { defaults } = require('joi');
const crypto = require('crypto');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

const {MongoStore} = require('connect-mongo');

mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('MongoDBコネクションOK!!');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー!!');
        console.log(err);
    });

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'mysecret';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: { secret }
});

store.on('error', e => {
  console.log('セッションストアエラー', e);
});

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(mongoSanitize());

app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
   'https://cdn.jsdelivr.net',
   'https://cdn.maptiler.com'
];
const imageSrcUrls = [
   `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
   'https://api.maptiler.com',
   'https://images.unsplash.com'
];
const connectSrcUrls = [
   'https://cdn.jsdelivr.net',
   'https://cdn.maptiler.com',
   'https://api.maptiler.com'
];
const styleSrcUrls = [
   'https://cdn.jsdelivr.net',
   'https://cdn.maptiler.com'
];

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64'); // ランダム文字列生成
  next();
});

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, ...scriptSrcUrls],
        imgSrc: ["'self'", "data:", ...imageSrcUrls],
        styleSrc: ["'self'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"]
    }
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.use((req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = '問題が起きました'
    }
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`ポート${port}でリクエスト待ち受け中`);
});