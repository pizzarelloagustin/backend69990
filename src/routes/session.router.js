import 'dotenv/config';
import { Router } from "express";
const router = Router();
import UserModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../util/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const userExist = await UserModel.findOne({ email });

        if (userExist) {
            return res.status(400).send("User alredy exist");
        }

        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        })

        await newUser.save();

        const token = jwt.sign({ first_name: newUser.first_name, email: newUser.email }, `${process.env.SECRET_KEY_PASSPORT}`, { expiresIn: "1h" });

        res.cookie("CookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current");

    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({
            error: "Error adding user"
        });
    }
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFind = await UserModel.findOne({ email });

        if (!userFind) {
            return res.status(401).send("Not valid user");
        }

        if (!isValidPassword(password, userFind)) {
            return res.status(401).send("Not valid password");
        }

        const token = jwt.sign({ first_name: userFind.first_name, email: userFind.email }, `${process.env.SECRET_KEY_PASSPORT}`, { expiresIn: "1h" });

        res.cookie("CookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        })

        res.redirect("/api/sessions/current");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: "Login error"
        });
    }
})

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        res.render("home", { email: req.user.email });
    } else {
        res.status(401).send("Unauthorized");
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("CookieToken");
    res.redirect("/login"); 
})

export default router; 