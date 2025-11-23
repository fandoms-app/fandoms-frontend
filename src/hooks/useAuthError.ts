import type { FirebaseError } from "firebase/app";

export default function useAuthError() {
  const parseError = (error: unknown): string => {
    if (isFirebaseError(error)) {
      switch (error.code) {
        case "auth/user-not-found":
          return "No existe una cuenta con este correo.";

        case "auth/wrong-password":
          return "La contraseña es incorrecta.";

        case "auth/invalid-email":
          return "El correo ingresado no es válido.";

        case "auth/invalid-credential":
          return "Correo o contraseña incorrectos.";

        case "auth/email-already-in-use":
          return "Este correo ya está registrado.";

        case "auth/weak-password":
          return "La contraseña es demasiado débil (mínimo 6 caracteres).";

        case "auth/too-many-requests":
          return "Demasiados intentos fallidos. Inténtalo más tarde.";

        case "auth/popup-closed-by-user":
          return "Se cerró la ventana de Google antes de completar el inicio.";

        default:
          return "Ocurrió un error. Inténtalo nuevamente.";
      }
    }

    if (error instanceof Error) return error.message;

    return "Ocurrió un error inesperado.";
  };

  return { parseError };
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

