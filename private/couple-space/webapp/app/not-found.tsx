export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">💕</div>
      <h2 className="text-3xl font-bold text-stone-800 mb-2">Page Not Found</h2>
      <p className="text-stone-500 mb-6">Looks like we got a little lost together...</p>
      <a href="/" className="btn-primary">
        Take Me Home
      </a>
    </div>
  )
}
