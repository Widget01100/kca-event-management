const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Database path
const dbPath = path.join(__dirname, '..', '..', 'database', 'kca_events.db');

// Admin page - View database in browser
router.get('/admin/database', (req, res) => {
    const db = new sqlite3.Database(dbPath);
    
    // Get all tables
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>KCA University - Database Admin</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: linear-gradient(135deg, #f9fafb, #ffffff);
                    padding: 2rem;
                    color: #1f2937;
                }
                .container { max-width: 1400px; margin: 0 auto; }
                .header {
                    background: linear-gradient(135deg, #1e3c72, #7e22ce);
                    color: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }
                h1 { font-size: 2rem; margin-bottom: 0.5rem; }
                .motto { color: #eab308; font-style: italic; }
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    border: 1px solid #e5e7eb;
                }
                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1e3c72;
                }
                .stat-label { color: #6b7280; margin-top: 0.25rem; }
                .table-container {
                    background: white;
                    border-radius: 1rem;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    border: 1px solid #e5e7eb;
                }
                h2 { 
                    color: #1e3c72; 
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th {
                    background: linear-gradient(135deg, #1e3c72, #7e22ce);
                    color: white;
                    padding: 0.75rem;
                    text-align: left;
                }
                td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                tr:hover { background: #f9fafb; }
                .badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .badge-blue { background: #1e3c72; color: white; }
                .badge-purple { background: #7e22ce; color: white; }
                .badge-gold { background: #eab308; color: #1e3c72; }
                .badge-green { background: #10b981; color: white; }
                .credentials-box {
                    background: linear-gradient(135deg, #1e3c72, #7e22ce);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    margin-bottom: 2rem;
                }
                .credential-item {
                    display: inline-block;
                    background: rgba(255,255,255,0.1);
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    margin: 0.25rem;
                }
                .footer {
                    text-align: center;
                    margin-top: 2rem;
                    padding: 1rem;
                    color: #6b7280;
                    border-top: 1px solid #e5e7eb;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🗄️ KCA University Database Admin</h1>
                    <p class="motto">"Advancing Knowledge, Driving Change"</p>
                    <p style="margin-top: 1rem; opacity: 0.9;">SQLite Database Viewer</p>
                </div>
                
                <div class="credentials-box">
                    <h3 style="color: #eab308; margin-bottom: 1rem;">🔑 System Login Credentials</h3>
                    <div>
                        <span class="credential-item">📧 student@students.kca.ac.ke / password123</span>
                        <span class="credential-item">📧 staff@staff.kca.ac.ke / password123</span>
                        <span class="credential-item">📧 admin@kca.ac.ke / password123</span>
                    </div>
                    <p style="margin-top: 1rem; opacity: 0.9;">Use these credentials to login to the system</p>
                </div>
                
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">${tables ? tables.length - 1 : 3}</div>
                        <div class="stat-label">Database Tables</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">kca_events.db</div>
                        <div class="stat-label">Database File</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${new Date().toLocaleString()}</div>
                        <div class="stat-label">Last Updated</div>
                    </div>
                </div>
        `;

        let tableIndex = 0;
        const filteredTables = tables.filter(t => t.name !== 'sqlite_sequence');
        
        filteredTables.forEach(table => {
            const tableName = table.name;
            db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
                if (!err && rows && rows.length > 0) {
                    html += `
                        <div class="table-container">
                            <h2>📋 ${tableName.charAt(0).toUpperCase() + tableName.slice(1)} (${rows.length} records)</h2>
                            <div style="overflow-x: auto;">
                                <table>
                                    <thead>
                                        <tr>
                                            ${Object.keys(rows[0]).map(key => `<th>${key}</th>`).join('')}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${rows.map(row => {
                                            return '<tr>' + Object.keys(row).map(key => {
                                                const val = row[key];
                                                if (val === null) return '<td><em>NULL</em></td>';
                                                if (key === 'email' && typeof val === 'string') {
                                                    return `<td><span class="badge badge-purple">${val}</span></td>`;
                                                }
                                                if (key === 'role' && typeof val === 'string') {
                                                    return `<td><span class="badge badge-blue">${val}</span></td>`;
                                                }
                                                if (key === 'category' && typeof val === 'string') {
                                                    return `<td><span class="badge badge-gold">${val}</span></td>`;
                                                }
                                                if (key === 'status' && val === 'active') {
                                                    return `<td><span class="badge badge-green">${val}</span></td>`;
                                                }
                                                if (typeof val === 'number' && val > 100) {
                                                    return `<td><strong style="color: #1e3c72;">${val}</strong></td>`;
                                                }
                                                return `<td>${val}</td>`;
                                            }).join('') + '</tr>';
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;
                }
                
                tableIndex++;
                if (tableIndex === filteredTables.length) {
                    html += `
                        <div style="background: white; border-radius: 1rem; padding: 1.5rem; margin-top: 1rem; border: 2px solid #eab308;">
                            <h3 style="color: #1e3c72; margin-bottom: 1rem;">🔍 Quick API Queries</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                                <div style="padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">
                                    <strong style="color: #7e22ce;">GET /api/events</strong>
                                    <p style="color: #6b7280; margin-top: 0.5rem;">View all events in JSON</p>
                                </div>
                                <div style="padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">
                                    <strong style="color: #7e22ce;">GET /api/stats</strong>
                                    <p style="color: #6b7280; margin-top: 0.5rem;">View event statistics</p>
                                </div>
                                <div style="padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">
                                    <strong style="color: #7e22ce;">GET /api/test-db</strong>
                                    <p style="color: #6b7280; margin-top: 0.5rem;">Test database connection</p>
                                </div>
                                <div style="padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">
                                    <strong style="color: #7e22ce;">GET /api/users</strong>
                                    <p style="color: #6b7280; margin-top: 0.5rem;">View all users (admin)</p>
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>KCA University Event Management System v2.0</p>
                            <p style="margin-top: 0.5rem;">SQLite Database • Real-time data • ${rows.length}+ records</p>
                            <p style="margin-top: 1rem; color: #7e22ce;">"Advancing Knowledge, Driving Change"</p>
                        </div>
                    </div>
                    </body>
                    </html>
                    `;
                    res.send(html);
                }
            });
        });
    });
});

module.exports = router;
