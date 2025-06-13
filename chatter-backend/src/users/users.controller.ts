import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TokenPayload } from '../auth/token-payload.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly userSErvice: UsersService){}

    @UseGuards(JwtAuthGuard)
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePicture(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 100000 }),
                    new FileTypeValidator({ fileType: 'image/jpeg' }),
                ]
            })
        ) file: Express.Multer.File,
        @CurrentUser() user: TokenPayload
    ){
        return this.userSErvice.uploadImage(file.buffer, user._id);
    }
}
