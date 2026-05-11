import { useState, useEffect } from 'react';
import { Box, History, Users, Activity, FolderTree } from 'lucide-react';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ proyectos: [], totalUsuarios: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/logs')
        ]);
        setStats(statsRes.data);
        setRecentLogs(logsRes.data);
      } catch (error) {
        console.error("Error cargando estadísticas reales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sección Izquierda: Estadísticas y Proyectos */}
      <div className="lg:col-span-2 space-y-8">
        {/* Cabecera y Usuarios Totales */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Resumen General</h2>
            <p className="text-slate-500 text-sm">Estadísticas globales de la plataforma Gamasis VMS.</p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Equipo de Desarrollo</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? <span className="animate-pulse bg-slate-200 text-transparent rounded">00</span> : stats.totalUsuarios}
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Proyectos */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FolderTree size={20} className="text-blue-600" />
            Proyectos Activos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-slate-400">Cargando proyectos...</div>
            ) : stats.proyectos.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400">No hay proyectos registrados.</div>
            ) : (
              stats.proyectos.map((proyecto) => (
                <div key={proyecto.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-bold text-slate-900 mb-4 truncate" title={proyecto.nombre}>{proyecto.nombre}</h4>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Box size={18} className="text-blue-500" />
                      <span className="font-semibold text-slate-700">{proyecto.modulos} <span className="text-xs font-normal text-slate-500">Mód.</span></span>
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <div className="flex items-center gap-2">
                      <History size={18} className="text-purple-500" />
                      <span className="font-semibold text-slate-700">{proyecto.versiones} <span className="text-xs font-normal text-slate-500">Vers.</span></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Estado del Sistema */}
        <div className="bg-slate-900 rounded-xl p-8 text-white mt-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity size={120} />
          </div>
          <h3 className="text-xl font-bold mb-4">Sistema Operativo</h3>
          <div className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium border border-emerald-500/50">
            ● Conexión Estable
          </div>
        </div>
      </div>

      {/* Sección Derecha: Feed de Actividad */}
      <div className="lg:col-span-1">
        {loading ? (
          <div className="h-full bg-slate-100 animate-pulse rounded-2xl"></div>
        ) : (
          <ActivityFeed logs={recentLogs} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
