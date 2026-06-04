import { Router } from "express";
import { getCityList, compareCities } from "../controllers/city.controller.js";

const router = Router();

router.get("/", getCityList);
router.get("/compare", compareCities);

export default router;