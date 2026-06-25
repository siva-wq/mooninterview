const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    try {

        const authHeader =
            req.header('Authorization');
 console.log("URL:", req.originalUrl);
console.trace("AUTH MIDDLEWARE CALLED");
        

console.log("AUTH HEADER:", authHeader);

        if (!authHeader) {
            console.log("No authorization header");

            return res.status(401).json({
                type: "session",
                message: "Session expired",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                type: "session",
                message: "Session expired"
            });
        }

        const token =
            authHeader.split(' ')[1];

        const verified = jwt.verify(
            token,
            'mooninterviewsecret'
        );

        req.user = verified;

        next();

    } catch (error) {

        console.log(error);

        res.status(401).json({
            type: "session",
            message: "Invalid token"
        });
    }
};

module.exports = authMiddleware;
