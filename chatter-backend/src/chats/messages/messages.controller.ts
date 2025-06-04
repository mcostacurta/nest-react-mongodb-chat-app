import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messageService: MessagesService){}

    @Get('count')
    @UseGuards(JwtAuthGuard)
    async countMessage(@Query('chatId') chatId: string){
        return this.messageService.countMessages(chatId);

    }
}

