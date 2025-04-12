require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

console.log('FACEBOOK_APP_ID:', process.env.FACEBOOK_APP_ID);
console.log('FACEBOOK_APP_SECRET:', process.env.FACEBOOK_APP_SECRET);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

// Configure Facebook OAuth
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'https://eight-zoos-flow.loca.lt/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  console.log('Facebook profile:', profile);
  done(null, profile);
}));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Facebook OAuth App!');
});

// Facebook OAuth route with scope
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email', 'pages_manage_posts', 'pages_read_engagement', 'pages_show_list', 'public_profile']
}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    if (!req.user) {
      res.status(401).send('Authentication failed!');
    } else {
      res.send('Facebook authentication successful!');
    }
  }
);

// Example endpoint for posting
app.post('/api/posts', (req, res) => {
  const { content, platforms, scheduledDate } = req.body;
  console.log('Received post:', { content, platforms, scheduledDate });
  res.status(200).send({ message: 'Post received!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
