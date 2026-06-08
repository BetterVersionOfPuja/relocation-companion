import { Router } from "express";
import {
  createSavedComparison,
  deleteSavedComparison,
  getSavedComparisons,
} from "../controllers/savedComparison.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getSavedComparisons).post(createSavedComparison);
router.route("/:id").delete(deleteSavedComparison);

export default router;
