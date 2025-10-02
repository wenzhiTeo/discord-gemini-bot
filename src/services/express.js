import express from "express";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSSequelize from "@adminjs/sequelize";

export default function expressStart(dbInstance, geminiService) {
    AdminJS.registerAdapter(AdminJSSequelize);
    const admin = new AdminJS({
        databases: [dbInstance],
        rootPath: "/admin",
    });

    const app = express();
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    // API route: reload Gemini prompt
    app.post("/reloadPrompt", async (req, res) => {
        try {
            await geminiService.reloadPrompt();
            res.json({ success: true, message: "Prompt reloaded" });
        } catch (err) {
            console.error("❌ Failed to reload prompt:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });

    app.listen(3000, () => {
        console.log("✅ Express server running at http://localhost:3000/admin");
    });
}
