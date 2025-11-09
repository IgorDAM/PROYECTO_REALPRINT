import { useState } from "react";

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Intentando login:", { username, password });
    // Aquí luego conectas tu API
  }

  return { username, password, setUsername, setPassword, handleSubmit };
}
