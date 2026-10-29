export default function Splash({ error, onRetry }) {
  return (
    <div className="grid min-h-screen place-items-center bg-cream px-6 text-center">
      {error ? (
        <div className="max-w-md">
          <h1 className="mb-2 font-serif text-2xl font-bold text-gray-900">Server tidak bisa dihubungi</h1>
          <p className="mb-6 text-sm text-gray-600">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Memuat…</p>
      )}
    </div>
  );
}