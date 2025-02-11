import { Injectable } from '@nestjs/common';

@Injectable()
export class WebService {
  private reservas = [
    { nombre: 'Carlos', fecha: '2025-02-12 15:00' },
    { nombre: 'Ana', fecha: '2025-02-12 16:00' },
  ];

  // Método para obtener las reservas
  getReservas() {
    return this.reservas;
  }

  // Método para crear una reserva
  crearReserva(nombre: string, fecha: string) {
    this.reservas.push({ nombre, fecha });
  }
}
