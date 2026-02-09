import { TestBed } from '@angular/core/testing';
import { SignalrService } from './signalr.service';
import * as signalR from '@microsoft/signalr';

// Mock @microsoft/signalr
jest.mock('@microsoft/signalr', () => {
  const mockConnection = {
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    invoke: jest.fn().mockResolvedValue(undefined),
  };

  return {
    HubConnectionBuilder: jest.fn().mockImplementation(() => ({
      withUrl: jest.fn().mockReturnThis(),
      withAutomaticReconnect: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue(mockConnection),
    })),
    __mockConnection: mockConnection,
  };
});

describe('SignalrService', () => {
  let service: SignalrService;
  let mockConnection: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnection = (signalR as any).__mockConnection;

    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildConnection', () => {
    it('should create a hub connection with the given URL', () => {
      service.buildConnection('/hub/test');

      expect(signalR.HubConnectionBuilder).toHaveBeenCalled();
    });
  });

  describe('startConnection', () => {
    it('should throw if connection not built', async () => {
      await expect(service.startConnection()).rejects.toThrow(
        'Hub connection not built'
      );
    });

    it('should start the connection', async () => {
      service.buildConnection('/hub/test');
      await service.startConnection();

      expect(mockConnection.start).toHaveBeenCalled();
    });
  });

  describe('onMessage', () => {
    it('should throw if connection not built', () => {
      expect(() => service.onMessage('Test')).toThrow(
        'Hub connection not built'
      );
    });

    it('should register a handler and emit messages', () => {
      service.buildConnection('/hub/test');
      service.onMessage('ReceiveMessage');

      expect(mockConnection.on).toHaveBeenCalledWith(
        'ReceiveMessage',
        expect.any(Function)
      );

      // Simulate receiving a message
      const handler = mockConnection.on.mock.calls[0][1];
      const received: string[] = [];
      service.messages$.subscribe((msg) => received.push(msg));

      handler('hello from hub');

      expect(received).toEqual(['hello from hub']);
    });
  });

  describe('sendMessage', () => {
    it('should throw if connection not built', async () => {
      await expect(service.sendMessage('Send', 'hi')).rejects.toThrow(
        'Hub connection not built'
      );
    });

    it('should invoke the method on the connection', async () => {
      service.buildConnection('/hub/test');
      await service.sendMessage('SendMessage', 'hello');

      expect(mockConnection.invoke).toHaveBeenCalledWith('SendMessage', 'hello');
    });
  });

  describe('stopConnection', () => {
    it('should stop the connection if built', async () => {
      service.buildConnection('/hub/test');
      await service.stopConnection();

      expect(mockConnection.stop).toHaveBeenCalled();
    });

    it('should do nothing if connection not built', async () => {
      await expect(service.stopConnection()).resolves.toBeUndefined();
    });
  });
});
