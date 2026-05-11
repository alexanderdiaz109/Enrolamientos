import { Clock, User, Activity } from 'lucide-react';

const ActivityFeed = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Activity size={18} className="text-blue-600" />
          Actividad Reciente
        </h3>
      </div>
      
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
        {logs.length === 0 ? (
          <p className="p-8 text-center text-slate-400 text-sm">No hay actividad registrada aún.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                  <User size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-bold text-slate-900">{log.nombre_usuario}</span>
                    {" "}{log.accion}
                  </p>
                  {log.nombre_proyecto && (
                    <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                      PROYECTO: {log.nombre_proyecto}
                    </span>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                    <Clock size={10} />
                    {new Date(log.fecha).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
