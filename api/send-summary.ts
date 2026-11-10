import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { createRemoteJWKSet, jwtVerify } from 'jose'

// Claves públicas de Google para validar los tokens de Firebase
const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
)

const PRIORITY_LABELS = { low: 'Baja', medium: 'Media', high: 'Alta' }

interface SummaryTask {
  title: string
  completed: boolean
  priority: keyof typeof PRIORITY_LABELS
  dueDate: string | null
}

const json = (body: unknown, status: number) => Response.json(body, { status })

function isValidTasks(value: unknown): value is SummaryTask[] {
  return (
    Array.isArray(value) &&
    value.length <= 200 &&
    value.every(
      (t) =>
        typeof t === 'object' &&
        t !== null &&
        typeof t.title === 'string' &&
        t.title.length <= 200 &&
        typeof t.completed === 'boolean' &&
        typeof t.priority === 'string' &&
        t.priority in PRIORITY_LABELS &&
        (t.dueDate === null || typeof t.dueDate === 'string'),
    )
  )
}

function buildText(tasks: SummaryTask[]): string {
  const pending = tasks.filter((t) => !t.completed)
  const done = tasks.filter((t) => t.completed)
  const line = (t: SummaryTask) =>
    `- ${t.title} (Prioridad: ${PRIORITY_LABELS[t.priority]}${
      t.dueDate ? `, vence: ${t.dueDate.split('-').reverse().join('/')}` : ''
    })`

  return [
    'Resumen de tus tareas',
    '',
    `Total: ${tasks.length} | Pendientes: ${pending.length} | Completadas: ${done.length}`,
    '',
    'PENDIENTES',
    ...(pending.length ? pending.map(line) : ['(ninguna)']),
    '',
    'COMPLETADAS',
    ...(done.length ? done.map(line) : ['(ninguna)']),
  ].join('\n')
}

export async function POST(request: Request) {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const accessKeyId = process.env.SES_ACCESS_KEY_ID
  const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY
  const region = process.env.SES_REGION
  const from = process.env.SES_FROM_EMAIL

  if (!projectId || !accessKeyId || !secretAccessKey || !region || !from) {
    console.error('Faltan variables de entorno')
    return json({ error: 'Servidor mal configurado.' }, 500)
  }

  // 1. ¿Quién pide el envío?
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return json({ error: 'No autenticado.' }, 401)

  let email: string
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    })
    if (typeof payload.email !== 'string') throw new Error('El token no tiene email')
    email = payload.email
  } catch {
    return json({ error: 'Token inválido.' }, 401)
  }

  // 2. Datos recibidos
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Cuerpo inválido.' }, 400)
  }
  const tasks = (body as { tasks?: unknown } | null)?.tasks
  if (!isValidTasks(tasks)) return json({ error: 'Datos inválidos.' }, 400)

  // 3. Envío con SES
  const ses = new SESv2Client({ region, credentials: { accessKeyId, secretAccessKey } })
  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: from,
        Destination: { ToAddresses: [email] },
        Content: {
          Simple: {
            Subject: { Data: 'Resumen de tus tareas', Charset: 'UTF-8' },
            Body: { Text: { Data: buildText(tasks), Charset: 'UTF-8' } },
          },
        },
      }),
    )
  } catch (error) {
    console.error('Error de SES:', error)
    return json({ error: 'No se pudo enviar el email.' }, 502)
  }

  return json({ ok: true }, 200)
}