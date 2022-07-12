const express = require("express");
const router = express.Router();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

router.get('/authenticate-step1-generate-authenticator', (req, res) => {
    const secret = speakeasy.generateSecret();
    qrcode.toDataURL(secret.otpauth_url, function (err, qrImage) {
        if (!err) {
            res.status(200).send({
                qr: qrImage,
                secret: secret
            });
        } else {
            res.internalServerError(err);
        }
    });
});

router.post('/authenticate-step2-verify-authenticator', (req, res) => {
    const base32secret = req.body.base32;
    const userToken = req.body.token;
    const verified = speakeasy.totp.verify({
        secret: base32secret,
        encoding: 'base32',
        token: userToken
    });
    if (verified) {
        // db.enableTwoFactorAuthentication(email, base32secret);
        res.status(200).send({
            validated: true
        });
    } else {
        res.status(400).send({
            validated: false
        });
    }
});

router.post('/validate-secret', (req, res) => {
    const validated = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token: req.body.token,
    });
    res.code(200).send({ validated });
})


module.exports = router;