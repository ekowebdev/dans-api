import {web} from "./application/web.js";
import {logger} from "./application/logging.js";

web.listen(process.env.APP_PORT, () => {
    logger.info(`App Start || Port: ${process.env.APP_PORT}`);
});
