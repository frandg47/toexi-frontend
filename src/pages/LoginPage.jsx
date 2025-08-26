import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const handleLogin = async (data) => {
    console.log("Credenciales:", data);

    // Aquí iría la llamada al backend (ejemplo con fetch)
    /*
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result.success) {
      // guardar token en localStorage o Zustand
      localStorage.setItem("token", result.token);
      navigate("/dashboard"); // o la página principal
    } else {
      alert(result.message);
    }
    */
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
