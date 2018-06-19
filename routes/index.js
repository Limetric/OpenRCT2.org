const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const template = require('../views/index.marko');
    res.marko(template, {
        page: {
            description: 'OpenRCT2 is the open-source adaption of the classic hit RollerCoaster Tycoon 2. Numerous bugs have been fixed and new features are added as online multiplayer.'
        }
    });
});

router.get('/faq', (req, res, next) => {
    const template = require('../views/faq.marko');
    res.marko(template, {
        page: {
            description: 'Frequently Asked Questions about OpenRCT2 answered.'
        }
    });
});

module.exports = router;