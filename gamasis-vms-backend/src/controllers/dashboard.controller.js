const dashboardService = require('../services/dashboard.service');
const logsService = require('../services/logs.service');

const getDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardService.getStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar estadísticas' });
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await logsService.getRecentLogs(15);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar logs recientes' });
    }
};

module.exports = { getDashboardStats, getLogs };
