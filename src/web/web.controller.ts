import { Controller, Get, Post, Body, Query, Redirect, Render } from '@nestjs/common';
import axios from 'axios';
import { WebService } from './web.service';

@Controller()
export class WebController {
  constructor(private readonly webService: WebService) { }

  @Get()
  @Render('index')
  getIndex() {
    return { reservas: this.webService.getReservas() };
  }

  @Get('/horas-libres')
  @Render('horas-libres')
  async horasLibres(@Query('fecha') fecha: string) {
    // Obtener la fecha actual
    const fechaActual = new Date();
    const fechaMinima = fechaActual.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"

    // Si no se recibe una fecha, se usa la fecha de hoy por defecto
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Si se recibe una fecha en la URL, validarla para asegurarse de que no sea anterior a la fecha actual
    const fechaFinal = fecha && fecha >= fechaMinima ? fecha : todayFormatted;

    // Obtener la respuesta del servicio de disponibilidad usando la fecha seleccionada
    const response = await axios.get(`https://reservas-google-calendar-production.up.railway.app/calendar/availability?date=${fechaFinal}`);
    const ocupaciones = response.data;

    // Definir horarios para ambas canchas
    const horariosCancha1 = [
      { hora: '9:00 AM - 10:00 AM', ocupada: false },
      { hora: '10:00 AM - 11:00 AM', ocupada: false },
      { hora: '11:00 AM - 12:00 PM', ocupada: false },
      { hora: '12:00 PM - 13:00 PM', ocupada: false },
      { hora: '13:00 PM - 14:00 PM', ocupada: false },
      { hora: '14:00 PM - 15:00 PM', ocupada: false },
      { hora: '15:00 PM - 16:00 PM', ocupada: false },
      { hora: '16:00 PM - 17:00 PM', ocupada: false },
      { hora: '17:00 PM - 18:00 PM', ocupada: false },
      { hora: '18:00 PM - 19:00 PM', ocupada: false },
      { hora: '19:00 PM - 20:00 PM', ocupada: false },
      { hora: '20:00 PM - 21:00 PM', ocupada: false },
      { hora: '21:00 PM - 22:00 PM', ocupada: false },
      { hora: '22:00 PM - 23:00 PM', ocupada: false },
      { hora: '23:00 PM - 24:00 AM', ocupada: false }
    ];

    const horariosCancha2 = [
      { hora: '9:00 AM - 10:00 AM', ocupada: false },
      { hora: '10:00 AM - 11:00 AM', ocupada: false },
      { hora: '11:00 AM - 12:00 PM', ocupada: false },
      { hora: '12:00 PM - 13:00 PM', ocupada: false },
      { hora: '13:00 PM - 14:00 PM', ocupada: false },
      { hora: '14:00 PM - 15:00 PM', ocupada: false },
      { hora: '15:00 PM - 16:00 PM', ocupada: false },
      { hora: '16:00 PM - 17:00 PM', ocupada: false },
      { hora: '17:00 PM - 18:00 PM', ocupada: false },
      { hora: '18:00 PM - 19:00 PM', ocupada: false },
      { hora: '19:00 PM - 20:00 PM', ocupada: false },
      { hora: '20:00 PM - 21:00 PM', ocupada: false },
      { hora: '21:00 PM - 22:00 PM', ocupada: false },
      { hora: '22:00 PM - 23:00 PM', ocupada: false },
      { hora: '23:00 PM - 24:00 AM', ocupada: false }
    ];

    // Función para marcar las franjas horarias ocupadas
    const marcarOcupadas = (horarios: any[], ocupaciones: any[], cancha: string) => {
      horarios.forEach(horario => {
        ocupaciones.forEach(ocupacion => {
          // Extraemos la hora de inicio y fin de cada reserva
          const startHour = new Date(ocupacion.start);
          const endHour = new Date(ocupacion.end);

          // Convertimos las horas de inicio y fin en horas enteras
          const startTime = startHour.getHours();
          const endTime = endHour.getHours();

          // Convertimos las horas de los horarios en enteras también
          const [horaInicio, horaFin] = horario.hora.split(' - ');
          const [horaInicioNum, minutoInicio] = horaInicio.split(':');
          const [horaFinNum, minutoFin] = horaFin.split(':');

          // Comparamos las horas de la reserva con las franjas horarias disponibles
          if (
            parseInt(horaInicioNum) >= startTime &&
            parseInt(horaFinNum) <= endTime
          ) {
            horario.ocupada = true;
          }
        });
      });
    };

    // Marcar las horas ocupadas para cancha 1
    marcarOcupadas(horariosCancha1, ocupaciones.filter(o => o.summary.toLowerCase().replace(/\s+/g, '').includes("cancha1")), "cancha 1");
    // Marcar las horas ocupadas para cancha 2
    marcarOcupadas(horariosCancha2, ocupaciones.filter(o => o.summary.toLowerCase().replace(/\s+/g, '').includes("cancha2")), "cancha 2");

    return {
      horariosCancha1,
      horariosCancha2,
      fecha: fechaFinal, // Usamos la fecha validada
      fechaMinima, // Pasamos la fecha mínima calculada
    };
  }

  @Post('reservas/crear')
  @Redirect('/')  // Redirige al inicio después de crear la reserva
  crearReserva(@Body() body: { nombre: string, fecha: string }) {
    this.webService.crearReserva(body.nombre, body.fecha);
  }
}
