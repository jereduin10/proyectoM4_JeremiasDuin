import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task, TaskFormData } from '../types/task'

const tasksRef = collection(db, 'tasks')

// Se suscribe a las tareas de UN usuario y avisa cada vez que cambian
export function subscribeToTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(tasksRef, where('userId', '==', userId))

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Task,
      )
      // Ordenamos acá y no en Firestore para evitar crear un índice compuesto
      onData(tasks.sort((a, b) => b.createdAt - a.createdAt))
    },
    onError,
  )
}

export const createTask = (userId: string, data: TaskFormData) =>
  addDoc(tasksRef, {
    ...data,
    userId,
    completed: false,
    createdAt: Date.now(),
  })

export const updateTask = (id: string, data: Partial<TaskFormData>) =>
  updateDoc(doc(db, 'tasks', id), data)

export const toggleTaskCompleted = (id: string, completed: boolean) =>
  updateDoc(doc(db, 'tasks', id), { completed })

export const deleteTask = (id: string) => deleteDoc(doc(db, 'tasks', id))