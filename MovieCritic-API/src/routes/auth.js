const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173')
);

router.get('/logout', (req, res) => {
	req.logout(() => res.redirect('/'));
});

module.exports = router;
