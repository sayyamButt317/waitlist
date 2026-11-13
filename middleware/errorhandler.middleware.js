
const errorHandler = (err, req, res, next) => {
    // Request body over the size limit (e.g. a huge picture on /api/wishes)
    if (err?.type === 'entity.too.large') {
        return res.status(413).send({
            status: 413,
            success: false,
            message: 'That upload is too big — please use a smaller picture.',
        });
    }
    console.log(err.stack);
    res.status(500).send({
        status: 500,
        message: 'Internal Server Error',
        error: err.stack,
    });
};

export default errorHandler;
