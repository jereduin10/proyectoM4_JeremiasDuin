import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth, googleProvider } from './firebase'

export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

export const logout = () => signOut(auth)

// Traduce los códigos técnicos de Firebase a mensajes claros para el usuario
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email o contraseña incorrectos.'
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con ese email.'
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.'
      case 'auth/invalid-email':
        return 'El email no es válido.'
      case 'auth/popup-closed-by-user':
        return 'Cerraste la ventana de Google antes de terminar.'
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Probá de nuevo más tarde.'
    }
  }
  return 'Ocurrió un error. Intentá de nuevo.'
}