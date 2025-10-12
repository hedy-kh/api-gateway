const auth = async (req, res, next) => {
    if (!req.authorization) {
        res.status(403).send({ error: "forbidden" });
    }
    next();
}