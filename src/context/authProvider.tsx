import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { auth, googleProvider } from "../firebase/firebase";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import api from "../api/api";
import type { Usuario } from "../types";
import { AuthContext } from "./authContext";

interface FirebaseAuthError extends Error {
  code: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const res = await api.get<Usuario>("/usuarios/me");
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoadingUser(true);

            if (!firebaseUser) {
                setUser(null);
                setLoadingUser(false);
                return;
            }

            await refreshUser();
        });

        return () => unsubscribe();
    }, [refreshUser]);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: unknown) {
            const error = err as FirebaseAuthError;

            if (error.code === "auth/cancelled-popup-request") {
                console.warn("Popup cancelado por el usuario.");
                return;
            }

            throw error;
        }
    };

    const register = async (payload: {
        nombreUsuario: string;
        email: string;
        password: string;
        fechaNacimiento?: string;
    }) => {
        const { email, password, nombreUsuario, fechaNacimiento } = payload;

        const fbCred = await createUserWithEmailAndPassword(auth, email, password);

        try {
            await updateProfile(fbCred.user, { displayName: nombreUsuario });
        } catch (err) {
            console.warn("register: no se pudo setear displayName en Firebase", err);
        }

        try {
            await refreshUser();
            await api.patch<Usuario>("/usuarios/me", {
                nombreUsuario,
                fechaNacimiento,
            });
            await refreshUser();
        } catch (err) {
            console.warn("register: patch usuarios/me falló", err);
        }
    };

    const logout = async () => {
        await firebaseSignOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loadingUser,
                login,
                loginWithGoogle,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
