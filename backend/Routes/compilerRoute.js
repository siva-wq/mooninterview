const express = require('express');

const axios = require('axios');

const router = express.Router();

router.post('/run', async (req, res) => {

    try {

        const { code, language, input } = req.body;

        const response = await axios.post(

            'https://emkc.org/api/v2/piston/execute',

            {
                language: language,

                version: '*',

                files: [
                    {
                        content: code
                    }
                ],

                stdin: input
            }
        );

        res.json(response.data);

    }

    catch (error) {

        console.log(error.response?.data || error.message);

        res.status(500).json({

            error: 'Error running code'
        });
    }
});

module.exports = router;