import { Resend } from 'resend';

export type TourRequestEmailParams = {
  apiKey: string;
  fromEmail: string;
  to: string;
  locale: 'en' | 'es';
  request: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    preferredDate?: string | null;
    preferredTime?: string | null;
    numberOfGuests?: number | null;
  };
};

const templates = {
  en: {
    subject: 'New Tour Request - Guía Oficial de la Alhambra',
    greeting: 'You have received a new tour inquiry:',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    preferredDate: 'Preferred Date',
    preferredTime: 'Preferred Time',
    numberOfGuests: 'Number of Guests',
  },
  es: {
    subject: 'Nueva Solicitud de Tour - Guía Oficial de la Alhambra',
    greeting: 'Has recibido una nueva consulta de tour:',
    name: 'Nombre',
    email: 'Email',
    phone: 'Teléfono',
    message: 'Mensaje',
    preferredDate: 'Fecha Preferida',
    preferredTime: 'Hora Preferida',
    numberOfGuests: 'Número de Personas',
  },
};

export async function sendTourRequestEmail({ apiKey, fromEmail, to, locale, request }: TourRequestEmailParams) {
  const resend = new Resend(apiKey);
  const t = templates[locale];
  const html = `
    <h2>${t.greeting}</h2>
    <p><strong>${t.name}:</strong> ${request.name}</p>
    <p><strong>${t.email}:</strong> ${request.email}</p>
    ${request.phone ? `<p><strong>${t.phone}:</strong> ${request.phone}</p>` : ''}
    ${request.preferredDate ? `<p><strong>${t.preferredDate}:</strong> ${request.preferredDate}</p>` : ''}
    ${request.preferredTime ? `<p><strong>${t.preferredTime}:</strong> ${request.preferredTime}</p>` : ''}
    ${request.numberOfGuests ? `<p><strong>${t.numberOfGuests}:</strong> ${request.numberOfGuests}</p>` : ''}
    <p><strong>${t.message}:</strong></p>
    <p>${request.message}</p>
  `;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject: t.subject,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
