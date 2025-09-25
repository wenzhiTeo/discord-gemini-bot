// admin.js
import express from "express";
import AdminJS from "adminjs";
import { buildRouter } from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";

import { Template } from "./database/models/index.js";
import initDb from "./database/initDb.js";

AdminJS.registerAdapter(AdminJSSequelize);

const app = express();

// 初始化数据库
await initDb();

const admin = new AdminJS({
    resources: [
        {
            resource: Template,
            options: {
                listProperties: ['name', 'description', 'is_active', 'created_at'],
                editProperties: ['name', 'prompt', 'description', 'is_active'],
                showProperties: ['name', 'prompt', 'description', 'is_active', 'created_at', 'updated_at'],
            }
        }
    ],
    rootPath: "/admin",
});

const router = buildRouter(admin);
app.use(admin.options.rootPath, router);

app.listen(3000, () => {
    console.log("✅ AdminJS running at http://localhost:3000/admin");
});
