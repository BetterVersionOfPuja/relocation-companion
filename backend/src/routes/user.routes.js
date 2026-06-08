import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword, 
    getCurrentUser, 
    updateCurrentUser,
    deleteCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/current-user").patch(verifyJWT, updateCurrentUser)
router.route("/current-user").delete(verifyJWT, deleteCurrentUser)

export default router;
