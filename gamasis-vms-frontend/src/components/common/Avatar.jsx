const Avatar = ({ fotoUrl, nombre, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl'
  };

  if (fotoUrl) {
    return (
      <img 
        src={fotoUrl} 
        alt={`Foto de ${nombre}`} 
        className={`${sizes[size]} rounded-full object-cover border border-slate-200`} 
      />
    );
  }

  // Fallback si no hay foto (inicial)
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : '?';
  
  return (
    <div className={`${sizes[size]} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase border border-blue-200`}>
      {inicial}
    </div>
  );
};

export default Avatar;
