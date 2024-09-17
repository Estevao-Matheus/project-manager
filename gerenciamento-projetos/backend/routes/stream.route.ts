import { Router } from "express";

import { streamCsv } from "../middlewares/Stream";

const router: Router = Router();

router.get('/load-csv', streamCsv);

export default router;