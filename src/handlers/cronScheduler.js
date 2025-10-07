// src/handlers/cronScheduler.js
import cron from 'node-cron';

/**
 * Register all cron jobs here
 * @param {Client} client - The Discord.js client
 * @param {Object} services - Object containing all services
 */
function setupCronJobs(client, services) {
    console.log('⏱️ Starting all cron jobs...');

    // 🕐 1️⃣ Reminder check (every minute)
    cron.schedule('* * * * *', () => {
        services.reminderService.checkReminders();
    });

    console.log('✅ All cron jobs scheduled.');
}

export { setupCronJobs }