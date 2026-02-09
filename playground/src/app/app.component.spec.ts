import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { SignalrService } from './services/signalr.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockDataService: Partial<DataService>;
  let mockSignalrService: Partial<SignalrService>;

  beforeEach(async () => {
    mockDataService = {
      getItems: jest.fn().mockReturnValue(of([
        { id: 1, name: 'Test', description: 'Test item' }
      ])),
    };

    mockSignalrService = {
      buildConnection: jest.fn(),
      onMessage: jest.fn(),
      messages$: of(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: SignalrService, useValue: mockSignalrService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the playground title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('playground');
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, playground');
  });

  it('should load items on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(mockDataService.getItems).toHaveBeenCalled();
    expect(app.items.length).toBe(1);
    expect(app.items[0].name).toBe('Test');
  });

  it('should initialize SignalR on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(mockSignalrService.buildConnection).toHaveBeenCalledWith('/hub/notifications');
    expect(mockSignalrService.onMessage).toHaveBeenCalledWith('ReceiveMessage');
  });
});
