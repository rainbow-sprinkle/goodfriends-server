import express, { Router, Request, Response } from 'express';
import * as middlewares from '../middlewares/casino.middlewares';
import * as controllers from "../controllers/casino.controllers";

const router: Router = express.Router();

// balance (Callback URL)
router.get("/honor-link/balance", middlewares.queryUserCheck, controllers.responseBalance);
// changeBalance (Callback URL)
router.post("/honor-link/changeBalance", middlewares.postUserCheck, controllers.changeBalance)


// deposit notice (Callback URL)
router.post("/gf/")

// withdrawal notice (Callback URL)
router.post("/")



export default router;