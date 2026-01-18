export default function Logo({ dark = true }) {
  return (
    <div className="flex items-center justify-center mx-auto mb-4">
      <div className={`w-16 h-16 rounded-2xl mr-3 flex items-center justify-center shadow-lg ${dark ? 'bg-gradient-to-br from-primary-600 to-primary-700' : 'bg-gradient-to-br from-gold-400 to-gold-500'}`}>
        <span className="text-white text-2xl font-bold">RP</span>
      </div>
      <h1 className={`text-3xl font-extrabold tracking-tight ${dark ? 'text-surface-900' : 'text-white'}`}>
        <span className="text-primary-600">REAL</span>
        <span className="text-gold-500">PRINT</span>
      </h1>
    </div>
  );
}
