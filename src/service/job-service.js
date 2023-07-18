import { validate } from "../validation/validation.js";
import {
    getJobValidation,
    getByIdJobValidation,
} from "../validation/job-validation.js";
import axios from "axios";
import {ResponseError} from "../error/response-error.js";

const get = async (request) => {
    request = validate(getJobValidation, request);

    const description = request.description || request.search;
    const location = request.location;
    const fullTime = request.full_time === true ? true : undefined;
    const page = request.page;
    const perPage = request.per_page;

    const url = 'http://dev3.dansmultipro.co.id/api/recruitment/positions.json';

    const response = await axios.get(url, {
        params: {
            description,
            location,
            fullTime,
            page,
            perPage
        },
    });

    const jobs = response.data.filter((job) => job !== null && typeof job === 'object');
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const paginatedData = jobs.slice(startIndex, endIndex);
    const totalPage = Math.ceil(jobs.length / perPage);

    if (response.data.length === 0 || Object.keys(response.data).length === 0 || paginatedData.length === 0) {
        throw new ResponseError(404, 'Data not found');
    }

    return {
        paginatedData,
        paging: {
            page: page,
            per_page: perPage,
            total_page: totalPage,
            total_data: jobs.length,
        },
    };
}

const getById = async (jobId) => {
    jobId = validate(getByIdJobValidation, jobId);

    const url = `http://dev3.dansmultipro.co.id/api/recruitment/positions/${jobId}`;

    const response = await axios.get(url);
    const jobs = response.data;

    if (jobs === null || jobs === undefined || Object.keys(jobs).length === 0) {
        throw new ResponseError(404, 'Data not found');
    }

    return jobs;
}

export default {
    get,
    getById,
}
