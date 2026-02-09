import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalrService implements OnDestroy {
  private hubConnection: signalR.HubConnection | null = null;
  private messagesSubject = new Subject<string>();

  readonly messages$: Observable<string> = this.messagesSubject.asObservable();

  buildConnection(hubUrl: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();
  }

  async startConnection(): Promise<void> {
    if (!this.hubConnection) {
      throw new Error('Hub connection not built. Call buildConnection() first.');
    }
    await this.hubConnection.start();
  }

  onMessage(methodName: string): void {
    if (!this.hubConnection) {
      throw new Error('Hub connection not built. Call buildConnection() first.');
    }
    this.hubConnection.on(methodName, (message: string) => {
      this.messagesSubject.next(message);
    });
  }

  async sendMessage(methodName: string, message: string): Promise<void> {
    if (!this.hubConnection) {
      throw new Error('Hub connection not built. Call buildConnection() first.');
    }
    await this.hubConnection.invoke(methodName, message);
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }
}
