const Organisation = require("../models/Organisation");

const checkOrganisationExpiry = async (
    req,
    res,
    next
) => {
    try {

        const organisation =
            await Organisation.findById(
                req.user.organisation
            );

        if (!organisation) {
            return res.status(404).json({
                message: "Organisation not found"
            });
        }

        if (new Date() > organisation.expiryDate) {
            return res.status(403).json({
                type: "organisation_expired",
                message: "Organisation subscription expired"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports =
    checkOrganisationExpiry;