import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  public texto = '';
  mensajeSubscription: Subscription;
  elemento: HTMLElement;
  mensajes: any[] = [];
  constructor(
    public wsService: WebsocketService,
    public chatService: ChatService) { }

  ngOnInit(): void {
    this.elemento = document.getElementById('chat-mensajes');
    this.mensajeSubscription = this.chatService.getMessages().subscribe( msg => {

      this.mensajes.push(msg);

      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 50);

    });
  }

  ngOnDestroy() {
    this.mensajeSubscription.unsubscribe();
  }

  enviar() {
    if ( this.texto.trim().length === 0 ){
      return;
    }
    this.chatService.sendMessage(this.texto);
    this.texto = '';
  }

}
