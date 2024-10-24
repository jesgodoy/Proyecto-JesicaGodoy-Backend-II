import { Router } from "express";
import passport from "passport";
import UserController from '../controllers/user.controllers.js'




const router = Router();


router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", UserController.getAllUsers);
router.post("/logout", UserController.logout);
router.get("/current", passport.authenticate("current", { session: false }), UserController.current);

export default router;
