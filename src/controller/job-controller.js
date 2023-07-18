import jobService from "../service/job-service.js";

const get = async (req, res, next) => {
    try {
        const request = {
            description: req.query.description,
            location: req.query.location,
            full_time: req.query.full_time,
            page: req.query.page,
            per_page: req.query.per_page
        };
        const result = await jobService.get(request);
        res.status(200).json({
            data: result.paginatedData,
            paging: result.paging
        });
    } catch (e) {
        next(e);
    }
}

const getById = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const result = await jobService.getById(jobId);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

export default {
    get,
    getById,
}
