const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: "Validation Error",
            message: err.message
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            error: "Duplicate Entry",
            message: "Resource already exists"
        });
    }

    res.status(500).json({
        error: "Internal Server Error",
        message: "Something went wrong"
    });
};

const logErrors = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.error("Error:", err.message);
    next(err);
};

module.exports = { logErrors, errorHandler };