import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../class/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario: Usuario = null;
  constructor(
    private socket: Socket,
    private router: Router
  ) {
    this.cargarStorage();
    this.checkStatus();
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
      this.cargarStorage();
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado al servidor');
      this.socketStatus = false;
    });
  }

  emit( evento: string, payload?: any, callback?: Function ) {
    console.log('Emitiendo', evento);
    // emit('EVENTO', payload, callback)
    this.socket.emit(evento, payload, callback);
  }

  listen( evento: string){
    console.log('escuchando', evento);
    return this.socket.fromEvent( evento );
  }

  loginWs(nombre: string) {
    // console.log('Configurando', nombre);
    return new Promise( (resolve, reject) => {
      this.emit('configurar-usuario', { nombre }, (res) => {
        // console.log(res);
        this.usuario = new Usuario( nombre );
        this.guardarStorage();
        resolve();
      });
    });
  }

  logoutWS(){
    this.usuario = null;
    localStorage.removeItem('usuario');
    const payload = { nombre: 'sin-nombre' };
    this.emit('configurar-usuario', payload, _ => {});
    this.router.navigateByUrl('');
  }

  getUsuario() {
    return this.usuario;
  }

  guardarStorage() {
    localStorage.setItem( 'usuario',  JSON.stringify(this.usuario));
  }

  cargarStorage() {
    if ( localStorage.getItem('usuario') ) {
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.loginWs(this.usuario.nombre);
    }
  }

}
