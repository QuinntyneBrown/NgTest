import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignalrService } from './services/signalr.service';
import { DataService, Item } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'playground';
  items: Item[] = [];
  messages: string[] = [];
  error: string | null = null;

  private subscription = new Subscription();

  constructor(
    private readonly dataService: DataService,
    private readonly signalrService: SignalrService
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.initSignalR();
  }

  loadItems(): void {
    this.subscription.add(
      this.dataService.getItems().subscribe({
        next: (items) => this.items = items,
        error: (err) => this.error = err.message,
      })
    );
  }

  private initSignalR(): void {
    this.signalrService.buildConnection('/hub/notifications');
    this.signalrService.onMessage('ReceiveMessage');
    this.subscription.add(
      this.signalrService.messages$.subscribe((msg) => this.messages.push(msg))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
