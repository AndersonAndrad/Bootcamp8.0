//dependencies 
import { format, parseISO } from 'date-fns';

// files
import Mail from '../../lib/Mail';


class CancellationMail {
  get Key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;

    console.log('ok');

    await Mail.sendMail({
      to : `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Schedule canceled',
      template: 'cancellation',
      context:{
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'for' MMMM dd', at' H:mm'h'"
        )
      }
    });
  }
}

export default new CancellationMail();