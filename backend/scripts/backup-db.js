const fs = require('fs');
const path = require('path');

const sourceDb = path.join(__dirname, '..', '..', 'database', 'kca_events.db');
const backupDir = path.join(__dirname, '..', '..', 'database', 'backups');

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `kca_events_backup_${timestamp}.db`);

fs.copyFile(sourceDb, backupFile, (err) => {
    if (err) {
        console.error('❌ Backup failed:', err);
    } else {
        console.log('✅ Database backed up successfully!');
        console.log(`📁 Location: ${backupFile}`);
    }
});
