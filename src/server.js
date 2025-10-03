import express from "express";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSSequelize from "@adminjs/sequelize";
import createGeminiServicesRoute from "./routes/geminiServices.js";
import interactionsRoute from "./routes/discordInteractions.js";


export default function expressStart(dbInstance, geminiService) {
    AdminJS.registerAdapter(AdminJSSequelize);
    const admin = new AdminJS({
        databases: [dbInstance],
        rootPath: "/admin",
    });

    const app = express();
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    app.use("/", createGeminiServicesRoute(geminiService));
    app.use("/", interactionsRoute);

    app.listen(3000, () => {
        console.log("✅ Express server running at http://localhost:3000/admin");
    });
}
