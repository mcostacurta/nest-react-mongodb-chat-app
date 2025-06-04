import { Test, TestingModule } from '@nestjs/testing';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ObjectId } from 'mongodb';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { TokenPayload } from 'src/auth/token-payload.interface';

// Mock the Chat entity to avoid import issues
class MockChat {
  _id: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: any[];
}

describe('ChatsResolver', () => {
  let resolver: ChatsResolver;
  let chatsService: jest.Mocked<ChatsService>;

  // Mock data
  const mockChat: MockChat = {
    _id: new ObjectId('507f1f77bcf86cd799439011'),
    name: 'Test Chat',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    messages: [],
  };

  const mockUser: TokenPayload = {
    _id: '507f1f77bcf86cd799439012',
    email: 'test@example.com',
    username:'test user',
    imageUrl: 'https://awss3'

  };

  const mockCreateChatInput: CreateChatInput = {
    name: 'New Chat',
  } as CreateChatInput;

  const mockUpdateChatInput: UpdateChatInput = {
    id: 1,
    name: 'Updated Chat',
  } as UpdateChatInput;

  const mockPaginationArgs: PaginationArgs = {
    skip: 0,
    limit: 10,
  };

  // Mock ChatsService
  const mockChatsService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsResolver,
        {
          provide: ChatsService,
          useValue: mockChatsService,
        },
      ],
    }).compile();

    resolver = module.get<ChatsResolver>(ChatsResolver);
    chatsService = module.get(ChatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createChat', () => {
    it('should create a chat successfully', async () => {
      // Arrange
      mockChatsService.create.mockResolvedValue(mockChat as any);

      // Act
      const result = await resolver.createChat(mockCreateChatInput, mockUser as any);

      // Assert
      expect(result).toEqual(mockChat);
      expect(chatsService.create).toHaveBeenCalledWith(
        mockCreateChatInput,
        mockUser._id
      );
      expect(chatsService.create).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Service error');
      mockChatsService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(
        resolver.createChat(mockCreateChatInput, mockUser as any)
      ).rejects.toThrow('Service error');
      expect(chatsService.create).toHaveBeenCalledWith(
        mockCreateChatInput,
        mockUser._id
      );
    });

    it('should pass correct user ID to service', async () => {
      // Arrange
      mockChatsService.create.mockResolvedValue(mockChat as any);

      // Act
      await resolver.createChat(mockCreateChatInput, mockUser as any);

      // Assert
      expect(chatsService.create).toHaveBeenCalledWith(
        mockCreateChatInput,
        mockUser._id
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of chats', async () => {
      // Arrange
      const mockChats = [mockChat];
      mockChatsService.findMany.mockResolvedValue(mockChats as any);

      // Act
      const result = await resolver.findAll(mockPaginationArgs as any);

      // Assert
      expect(result).toEqual(mockChats);
      expect(chatsService.findMany).toHaveBeenCalledWith(
        [],
        mockPaginationArgs
      );
      expect(chatsService.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no chats found', async () => {
      // Arrange
      mockChatsService.findMany.mockResolvedValue([]);

      // Act
      const result = await resolver.findAll(mockPaginationArgs as any);

      // Assert
      expect(result).toEqual([]);
      expect(chatsService.findMany).toHaveBeenCalledWith(
        [],
        mockPaginationArgs
      );
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockChatsService.findMany.mockRejectedValue(error);

      // Act & Assert
      await expect(resolver.findAll(mockPaginationArgs as any)).rejects.toThrow(
        'Database error'
      );
    });

    it('should pass correct parameters to service', async () => {
      // Arrange
      mockChatsService.findMany.mockResolvedValue([]);

      // Act
      await resolver.findAll(mockPaginationArgs as any);

      // Assert
      expect(chatsService.findMany).toHaveBeenCalledWith(
        [],
        mockPaginationArgs
      );
    });
  });

  describe('findOne', () => {
    it('should return a single chat', async () => {
      // Arrange
      const chatId = '507f1f77bcf86cd799439011';
      mockChatsService.findOne.mockResolvedValue(mockChat as any);

      // Act
      const result = await resolver.findOne(chatId);

      // Assert
      expect(result).toEqual(mockChat);
      expect(chatsService.findOne).toHaveBeenCalledWith(chatId);
      expect(chatsService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle when chat is not found', async () => {
      // Arrange
      const chatId = 'nonexistent';
      mockChatsService.findOne.mockResolvedValue(null);

      // Act
      const result = await resolver.findOne(chatId);

      // Assert
      expect(result).toBeNull();
      expect(chatsService.findOne).toHaveBeenCalledWith(chatId);
    });

    it('should handle service errors', async () => {
      // Arrange
      const chatId = '507f1f77bcf86cd799439011';
      const error = new Error('Service error');
      mockChatsService.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(resolver.findOne(chatId)).rejects.toThrow('Service error');
      expect(chatsService.findOne).toHaveBeenCalledWith(chatId);
    });

    it('should handle invalid ObjectId format', async () => {
      // Arrange
      const invalidId = 'invalid-id';
      const error = new Error('Invalid ObjectId');
      mockChatsService.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(resolver.findOne(invalidId)).rejects.toThrow('Invalid ObjectId');
      expect(chatsService.findOne).toHaveBeenCalledWith(invalidId);
    });
  });

  describe('updateChat', () => {
    it('should update a chat successfully', async () => {
      // Arrange
      const updatedChat = { ...mockChat, name: 'Updated Chat' };
      mockChatsService.update.mockResolvedValue(updatedChat as any);

      // Act
      const result = await resolver.updateChat(mockUpdateChatInput);

      // Assert
      expect(result).toEqual(updatedChat);
      expect(chatsService.update).toHaveBeenCalledWith(
        mockUpdateChatInput.id,
        mockUpdateChatInput
      );
      expect(chatsService.update).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors during update', async () => {
      // Arrange
      const error = new Error('Update failed');
      mockChatsService.update.mockRejectedValue(error);

      // Act & Assert
      await expect(resolver.updateChat(mockUpdateChatInput)).rejects.toThrow(
        'Update failed'
      );
      expect(chatsService.update).toHaveBeenCalledWith(
        mockUpdateChatInput.id,
        mockUpdateChatInput
      );
    });

    it('should handle updating non-existent chat', async () => {
      // Arrange
      const nonExistentUpdate = { ...mockUpdateChatInput, id: 999 };
      mockChatsService.update.mockResolvedValue(null);

      // Act
      const result = await resolver.updateChat(nonExistentUpdate);

      // Assert
      expect(result).toBeNull();
      expect(chatsService.update).toHaveBeenCalledWith(
        nonExistentUpdate.id,
        nonExistentUpdate
      );
    });
  });

  describe('removeChat', () => {
    it('should remove a chat successfully', async () => {
      // Arrange
      const chatId = 1;
      mockChatsService.remove.mockResolvedValue(mockChat as any);

      // Act
      const result = await resolver.removeChat(chatId);

      // Assert
      expect(result).toEqual(mockChat);
      expect(chatsService.remove).toHaveBeenCalledWith(chatId);
      expect(chatsService.remove).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors during removal', async () => {
      // Arrange
      const chatId = 1;
      const error = new Error('Removal failed');
      mockChatsService.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(resolver.removeChat(chatId)).rejects.toThrow(
        'Removal failed'
      );
      expect(chatsService.remove).toHaveBeenCalledWith(chatId);
    });

    it('should handle removing non-existent chat', async () => {
      // Arrange
      const chatId = 999;
      mockChatsService.remove.mockResolvedValue(null);

      // Act
      const result = await resolver.removeChat(chatId);

      // Assert
      expect(result).toBeNull();
      expect(chatsService.remove).toHaveBeenCalledWith(chatId);
    });

    it('should handle negative chat ID', async () => {
      // Arrange
      const chatId = -1;
      const error = new Error('Invalid chat ID');
      mockChatsService.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(resolver.removeChat(chatId)).rejects.toThrow('Invalid chat ID');
      expect(chatsService.remove).toHaveBeenCalledWith(chatId);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete chat lifecycle', async () => {
      // Arrange
      const newChat = { ...mockChat, name: 'New Chat' };
      const updatedChat = { ...mockChat, name: 'Updated Chat' };
      
      mockChatsService.create.mockResolvedValue(newChat as any);
      mockChatsService.findOne.mockResolvedValue(newChat as any);
      mockChatsService.update.mockResolvedValue(updatedChat as any);
      mockChatsService.remove.mockResolvedValue(updatedChat as any);

      // Act & Assert - Create
      const created = await resolver.createChat(mockCreateChatInput, mockUser as any);
      expect(created).toEqual(newChat);

      // Act & Assert - Find
      const found = await resolver.findOne(newChat._id.toString());
      expect(found).toEqual(newChat);

      // Act & Assert - Update
      const updated = await resolver.updateChat(mockUpdateChatInput);
      expect(updated).toEqual(updatedChat);

      // Act & Assert - Remove
      const removed = await resolver.removeChat(1);
      expect(removed).toEqual(updatedChat);
    });
  });

  describe('Service dependency injection', () => {
    it('should inject ChatsService correctly', () => {
      expect(chatsService).toBeDefined();
      expect(chatsService.create).toBeDefined();
      expect(chatsService.findMany).toBeDefined();
      expect(chatsService.findOne).toBeDefined();
      expect(chatsService.update).toBeDefined();
      expect(chatsService.remove).toBeDefined();
    });
  });
});