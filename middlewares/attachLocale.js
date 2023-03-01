module.exports = function attachLocale(req, res, next) {
    try {
        req.locale = req.cookies.locale || req.query.locale || 'en';
        return next();
    } catch (e) {
        return next(e);
    }
}
