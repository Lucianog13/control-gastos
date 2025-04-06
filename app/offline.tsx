export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Sin conexión</h1>
      <p className="mb-6">No tienes conexión a internet. Algunas funciones pueden no estar disponibles.</p>
      <p>Tus datos guardados siguen siendo accesibles y podrás seguir utilizando la aplicación.</p>
    </div>
  )
}

