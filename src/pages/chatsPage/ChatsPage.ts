import { RESOURCES_URL } from '../../constants/api';
import { Component } from '../../services/Component';
import Router from '../../services/Router';
import AuthStore from '../../services/AuthStore';
import ChatAPI from '../../services/ChatAPI';
import type { Chat, ChatUser } from '../../services/ChatAPI';
import UserAPI from '../../services/UserAPI';
import type { UserSearchResult } from '../../services/UserAPI';
import WebSocketService from '../../services/WebSocketService';
import type { Message } from '../../services/WebSocketService';
import template from './chatsPage.hbs';
import './chatsPage.scss';

interface ChatsPageProps {
  class: string;
  chats: Chat[];
  chatUsers: ChatUser[];
  resourcesBaseUrl: string;
  selectedChatTitle: string;
  selectedChatId: number | null;
  '.chats__profile-link': {
    click: (e: Event) => void;
  };
  '.chat__form': {
    submit: (e: SubmitEvent) => void;
  };
  '.chat': {
    click: (e: Event) => void;
  };
  '.chat__menu-button': {
    click: (e: Event) => void;
  };
  '#add-user-form': {
    submit: (e: SubmitEvent) => void;
  };
  '#delete-user-form': {
    submit: (e: SubmitEvent) => void;
  };
  '#change-chat-avatar-form': {
    submit: (e: SubmitEvent) => void;
  };
  '#close-add-user-modal': {
    click: () => void;
  };
  '#close-delete-user-modal': {
    click: () => void;
  };
  '#close-change-chat-avatar-modal': {
    click: () => void;
  };
  '#add-user-menu-item': {
    click: (e: Event) => void;
  };
  '#delete-user-menu-item': {
    click: (e: Event) => void;
  };
  '#change-chat-avatar-menu-item': {
    click: (e: Event) => void;
  };
  '#delete-chat-menu-item': {
    click: (e: Event) => void;
  };
  '#add-chat-button': {
    click: (e: Event) => void;
  };
  '#create-chat-form': {
    submit: (e: SubmitEvent) => void;
  };
  '#close-create-chat-modal': {
    click: () => void;
  };
  [key: string]: unknown;
}

type CreateChatResponse = { id: number };

export class ChatsPage extends Component<ChatsPageProps> {
  private chats: Chat[] = [];
  private chatUsers: ChatUser[] = [];
  private messages: Message[] = [];
  private chatsLoaded = false;
  private selectedChatId: number | null = null;
  private selectedChatTitle = '';

  private readonly onSocketMessage = (payload: Message | Message[]) => {
    this.handleMessage(payload);
  };

  private readonly onSocketOpen = () => {
    WebSocketService.getOldMessages(0);
  };

  constructor() {
    super('main', {
      class: 'main',
      chats: [],
      chatUsers: [],
      resourcesBaseUrl: RESOURCES_URL,
      selectedChatTitle: '',
      selectedChatId: null,
      '.chats__profile-link': {
        click: (e: Event) => this.onProfileClick(e),
      },
      '.chat__form': {
        submit: (e: SubmitEvent) => this.onSendMessage(e),
      },
      '.chat': {
        click: (e: Event) => this.onChatClick(e),
      },
      '.chat__menu-button': {
        click: (e: Event) => this.onMenuButtonClick(e),
      },
      '#add-user-form': {
        submit: (e: SubmitEvent) => this.onAddUserSubmit(e),
      },
      '#delete-user-form': {
        submit: (e: SubmitEvent) => this.onDeleteUserSubmit(e),
      },
      '#change-chat-avatar-form': {
        submit: (e: SubmitEvent) => this.onChangeChatAvatarSubmit(e),
      },
      '#close-add-user-modal': {
        click: () => this.closeAddUserModal(),
      },
      '#close-delete-user-modal': {
        click: () => this.closeDeleteUserModal(),
      },
      '#close-change-chat-avatar-modal': {
        click: () => this.closeChangeChatAvatarModal(),
      },
      '#add-user-menu-item': {
        click: (e: Event) => this.onAddUserMenuClick(e),
      },
      '#delete-user-menu-item': {
        click: (e: Event) => this.onDeleteUserMenuClick(e),
      },
      '#change-chat-avatar-menu-item': {
        click: (e: Event) => this.onChangeChatAvatarMenuClick(e),
      },
      '#delete-chat-menu-item': {
        click: (e: Event) => this.onDeleteChatMenuClick(e),
      },
      '#add-chat-button': {
        click: (e: Event) => this.onAddChatClick(e),
      },
      '#create-chat-form': {
        submit: (e: SubmitEvent) => this.onCreateChatSubmit(e),
      },
      '#close-create-chat-modal': {
        click: () => this.closeCreateChatModal(),
      },
    });
  }

  render() {
    return template({
      ...this.props,
      chats: this.chats,
      chatUsers: this.chatUsers,
      resourcesBaseUrl: RESOURCES_URL,
      selectedChatTitle: this.selectedChatTitle,
      selectedChatId: this.selectedChatId,
    });
  }

  async componentDidMount() {
    if (!this.chatsLoaded) {
      this.chatsLoaded = true;
      await this.loadChats();
    }

    WebSocketService.offMessage(this.onSocketMessage);
    WebSocketService.offOpen(this.onSocketOpen);
    WebSocketService.onMessage(this.onSocketMessage);
    WebSocketService.onOpen(this.onSocketOpen);

    await this.restoreSelectedChat();
    this.renderMessages();
  }

  componentDidUpdate(oldProps: ChatsPageProps, newProps: ChatsPageProps): boolean {
    return (
      oldProps.chats !== newProps.chats ||
      oldProps.chatUsers !== newProps.chatUsers ||
      oldProps.selectedChatTitle !== newProps.selectedChatTitle ||
      oldProps.selectedChatId !== newProps.selectedChatId
    );
  }

  componentWillUnmount() {
    WebSocketService.offMessage(this.onSocketMessage);
    WebSocketService.offOpen(this.onSocketOpen);
    WebSocketService.close();
    this.chatsLoaded = false;
  }

  private async loadChats() {
    try {
      const response = await ChatAPI.getChats();
      if (response.status === 200) {
        this.chats = JSON.parse(response.responseText) as Chat[];
        this.setProps({ chats: this.chats });
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  }

  private async loadChatUsers(chatId: number) {
    try {
      const response = await ChatAPI.getChatUsers(chatId);
      if (response.status === 200) {
        const users = JSON.parse(response.responseText) as ChatUser[];
        const currentUserId = AuthStore.getUser()?.id;
        this.chatUsers = users.filter((user) => user.id !== currentUserId);
        this.setProps({ chatUsers: this.chatUsers });
      }
    } catch (error) {
      console.error('Error loading chat users:', error);
    }
  }

  private handleMessage(payload: Message | Message[]) {
    if (Array.isArray(payload)) {
      this.messages = [...payload].reverse();
    } else {
      this.messages = [...this.messages, payload];
    }

    this.renderMessages();
  }

  private renderMessages() {
    const messagesWrapper = this.getContent().querySelector<HTMLDivElement>('#messages-wrapper');
    if (!messagesWrapper) {
      return;
    }

    messagesWrapper.innerHTML = '';
    const currentUserId = AuthStore.getUser()?.id;

    this.messages.forEach((message) => {
      const isCurrentUser = String(message.user_id) === String(currentUserId);
      const messageContainer = document.createElement('div');
      messageContainer.className = `mainchat__message-container ${
        isCurrentUser ? 'mainchat__message-container_answer' : 'mainchat__message-container_incoming'
      }`;

      const messageBubble = document.createElement('div');
      messageBubble.className = `mainchat__message mainchat__message_text ${
        isCurrentUser ? 'mainchat__message_answer' : ''
      }`;

      if ((message.type === 'file' || message.type === 'sticker') && message.file?.path) {
        const fileUrl = `${RESOURCES_URL}/${message.file.path}`;

        if (message.type === 'sticker' && message.file.content_type.startsWith('image/')) {
          const sticker = document.createElement('img');
          sticker.className = 'mainchat__message mainchat__message_image';
          sticker.src = fileUrl;
          sticker.alt = message.file.filename || 'sticker';
          messageContainer.appendChild(sticker);
        } else {
          const fileLink = document.createElement('a');
          fileLink.href = fileUrl;
          fileLink.target = '_blank';
          fileLink.rel = 'noreferrer';
          fileLink.textContent = message.file.filename || 'Открыть файл';
          messageBubble.appendChild(fileLink);
          messageContainer.appendChild(messageBubble);
        }
      } else {
        messageBubble.textContent = message.content || '';
        messageContainer.appendChild(messageBubble);
      }

      messagesWrapper.appendChild(messageContainer);
    });

    const chatContent = this.getContent().querySelector<HTMLElement>('.mainchat__content');
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }

  private async onChatClick(e: Event) {
    e.preventDefault();
    const chatElement = (e.target as HTMLElement).closest('.chat');
    if (!chatElement) {
      return;
    }

    const chatId = Number(chatElement.getAttribute('data-chat-id'));
    if (!chatId) {
      return;
    }

    await this.selectChat(chatId);
  }

  private async selectChat(chatId: number) {
    const chat = this.chats.find((item) => item.id === chatId);
    if (!chat) {
      return;
    }

    this.selectedChatId = chatId;
    this.selectedChatTitle = chat.title;
    this.messages = [];
    this.chatUsers = [];
    this.persistSelectedChat(chatId);
    this.setProps({
      chatUsers: this.chatUsers,
      selectedChatTitle: chat.title,
      selectedChatId: chatId,
    });

    await Promise.all([this.connectToChat(chatId), this.loadChatUsers(chatId)]);
  }

  private async connectToChat(chatId: number) {
    const currentUser = AuthStore.getUser();
    if (!currentUser) {
      return;
    }

    try {
      const tokenResponse = await ChatAPI.getChatToken(chatId);
      if (tokenResponse.status === 200) {
        const { token } = JSON.parse(tokenResponse.responseText) as { token: string };
        WebSocketService.connect(chatId, currentUser.id, token);
        return;
      }

      WebSocketService.connect(chatId);
    } catch (error) {
      console.error('Error getting chat token:', error);
      WebSocketService.connect(chatId);
    }
  }

  private async restoreSelectedChat() {
    const selectedChatId = this.getStoredChatId();
    if (!selectedChatId) {
      return;
    }

    const chatExists = this.chats.some((chat) => chat.id === selectedChatId);
    if (!chatExists) {
      this.clearStoredChatId();
      return;
    }

    await this.selectChat(selectedChatId);
  }

  private getStoredChatId(): number | null {
    const fromQuery = new URLSearchParams(window.location.search).get('chat');
    const queryChatId = Number(fromQuery);
    if (queryChatId > 0) {
      return queryChatId;
    }

    const fromStorage = localStorage.getItem('selectedChatId');
    const storageChatId = Number(fromStorage);
    if (storageChatId > 0) {
      return storageChatId;
    }

    return null;
  }

  private persistSelectedChat(chatId: number) {
    localStorage.setItem('selectedChatId', String(chatId));
    const url = new URL(window.location.href);
    url.searchParams.set('chat', String(chatId));
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`);
  }

  private clearStoredChatId() {
    localStorage.removeItem('selectedChatId');
    const url = new URL(window.location.href);
    url.searchParams.delete('chat');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`);
  }

  private onProfileClick(e: Event) {
    e.preventDefault();
    const router = new Router();
    router.go('/settings');
  }

  private onMenuButtonClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const dropdown = this.getContent().querySelector<HTMLElement>('#chat-menu-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('chat__menu-dropdown--visible');
    }
  }

  private onAddUserMenuClick(e: Event) {
    e.preventDefault();
    this.closeMenu();
    this.openAddUserModal();
  }

  private async onDeleteUserMenuClick(e: Event) {
    e.preventDefault();
    this.closeMenu();

    if (!this.selectedChatId) {
      alert('Сначала выберите чат');
      return;
    }

    await this.loadChatUsers(this.selectedChatId);
    this.openDeleteUserModal();
  }

  private onChangeChatAvatarMenuClick(e: Event) {
    e.preventDefault();
    this.closeMenu();
    this.openChangeChatAvatarModal();
  }

  private async onDeleteChatMenuClick(e: Event) {
    e.preventDefault();
    this.closeMenu();

    if (!this.selectedChatId) {
      alert('Сначала выберите чат');
      return;
    }

    const shouldDelete = window.confirm('Удалить чат без возможности восстановления?');
    if (!shouldDelete) {
      return;
    }

    try {
      const response = await ChatAPI.deleteChat(this.selectedChatId);
      if (response.status !== 200) {
        alert('Не удалось удалить чат');
        return;
      }

      this.messages = [];
      this.chatUsers = [];
      this.selectedChatId = null;
      this.selectedChatTitle = '';
      this.clearStoredChatId();
      WebSocketService.close();
      this.setProps({
        chatUsers: this.chatUsers,
        selectedChatId: null,
        selectedChatTitle: '',
      });
      await this.loadChats();
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Не удалось удалить чат');
    }
  }

  private closeMenu() {
    const dropdown = this.getContent().querySelector<HTMLElement>('#chat-menu-dropdown');
    if (dropdown) {
      dropdown.classList.remove('chat__menu-dropdown--visible');
    }
  }

  private openAddUserModal() {
    const modal = this.getContent().querySelector<HTMLElement>('#add-user-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  private closeAddUserModal() {
    const modal = this.getContent().querySelector<HTMLElement>('#add-user-modal');
    if (modal) {
      modal.style.display = 'none';
    }

    const form = this.getContent().querySelector<HTMLFormElement>('#add-user-form');
    if (form) {
      form.reset();
    }
  }

  private openDeleteUserModal() {
    const modal = this.getContent().querySelector<HTMLElement>('#delete-user-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  private closeDeleteUserModal() {
    const modal = this.getContent().querySelector<HTMLElement>('#delete-user-modal');
    if (modal) {
      modal.style.display = 'none';
    }

    const form = this.getContent().querySelector<HTMLFormElement>('#delete-user-form');
    if (form) {
      form.reset();
    }
  }

  private openChangeChatAvatarModal() {
    const modal = this.getContent().querySelector<HTMLElement>('#change-chat-avatar-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  private closeChangeChatAvatarModal() {
    const modal = this.getContent().querySelector<HTMLElement>('#change-chat-avatar-modal');
    if (modal) {
      modal.style.display = 'none';
    }

    const form = this.getContent().querySelector<HTMLFormElement>('#change-chat-avatar-form');
    if (form) {
      form.reset();
    }
  }

  private async findUserByLogin(login: string): Promise<UserSearchResult | null> {
    const response = await UserAPI.searchUsers(login);
    if (response.status !== 200) {
      return null;
    }

    const users = JSON.parse(response.responseText) as UserSearchResult[];
    if (!users.length) {
      return null;
    }

    return users[0];
  }

  private async onAddUserSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!this.selectedChatId) {
      alert('Сначала выберите чат');
      return;
    }

    const input = this.getContent().querySelector<HTMLInputElement>('#user-login-input');
    const login = input?.value.trim() || '';
    if (!login) {
      return;
    }

    try {
      const user = await this.findUserByLogin(login);
      if (!user) {
        alert('Пользователь не найден');
        return;
      }

      const response = await ChatAPI.addUserToChat({
        users: [user.id],
        chatId: this.selectedChatId,
      });

      if (response.status === 200) {
        await this.loadChatUsers(this.selectedChatId);
        this.closeAddUserModal();
      } else {
        alert('Ошибка при добавлении пользователя');
      }
    } catch (error) {
      console.error('Error adding user to chat:', error);
      alert('Ошибка при добавлении пользователя');
    }
  }

  private async onDeleteUserSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!this.selectedChatId) {
      alert('Сначала выберите чат');
      return;
    }

    const select = this.getContent().querySelector<HTMLSelectElement>('#delete-user-select');
    const selectedUserId = Number(select?.value);
    if (!selectedUserId) {
      alert('Выберите пользователя');
      return;
    }

    try {
      const response = await ChatAPI.deleteUserFromChat({
        users: [selectedUserId],
        chatId: this.selectedChatId,
      });

      if (response.status === 200) {
        await this.loadChatUsers(this.selectedChatId);
        this.closeDeleteUserModal();
      } else {
        alert('Ошибка при удалении пользователя');
      }
    } catch (error) {
      console.error('Error deleting user from chat:', error);
      alert('Ошибка при удалении пользователя');
    }
  }

  private async onChangeChatAvatarSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!this.selectedChatId) {
      alert('Сначала выберите чат');
      return;
    }

    const input = this.getContent().querySelector<HTMLInputElement>('#chat-avatar-input');
    const file = input?.files?.[0];
    if (!file) {
      alert('Выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('chatId', String(this.selectedChatId));
    formData.append('avatar', file);

    try {
      const response = await ChatAPI.changeChatAvatar(formData);
      if (response.status === 200) {
        await this.loadChats();
        this.closeChangeChatAvatarModal();
      } else {
        alert('Не удалось обновить аватар чата');
      }
    } catch (error) {
      console.error('Error changing chat avatar:', error);
      alert('Не удалось обновить аватар чата');
    }
  }

  private onSendMessage(e: SubmitEvent) {
    e.preventDefault();
    if (!this.selectedChatId) {
      return;
    }

    const input = this.getContent().querySelector<HTMLInputElement>('.chat__send-message-input');
    if (!input) {
      return;
    }

    const message = input.value.trim();
    if (!message) {
      return;
    }

    WebSocketService.sendMessage(message);
    input.value = '';
  }

  private onAddChatClick(e: Event) {
    e.preventDefault();
    this.openCreateChatModal();
  }

  private openCreateChatModal() {
    const modal = this.getContent().querySelector<HTMLElement>('#create-chat-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  private closeCreateChatModal() {
    const modal = this.getContent().querySelector<HTMLElement>('#create-chat-modal');
    if (modal) {
      modal.style.display = 'none';
    }

    const form = this.getContent().querySelector<HTMLFormElement>('#create-chat-form');
    if (form) {
      form.reset();
    }
  }

  private async onCreateChatSubmit(e: SubmitEvent) {
    e.preventDefault();

    const input = this.getContent().querySelector<HTMLInputElement>('#create-chat-title-input');
    const title = input?.value.trim() || '';
    if (!title) {
      return;
    }

    try {
      const createResponse = await ChatAPI.createChat({ title });
      if (createResponse.status !== 200) {
        alert('Ошибка при создании чата');
        return;
      }

      const newChat = JSON.parse(createResponse.responseText) as CreateChatResponse;
      await this.loadChats();
      await this.selectChat(newChat.id);
      this.closeCreateChatModal();
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Ошибка при создании чата');
    }
  }
}
