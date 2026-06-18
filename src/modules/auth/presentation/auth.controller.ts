import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthenticateUseCase, LoginUseCase, SignUpUseCase } from "@auth/application/use-cases";
import { AuthenticateParamsDto, LoginDto, SignUpDto } from "@auth/presentation/dtos";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authenticateUseCase: AuthenticateUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly signUpUseCase: SignUpUseCase,
    ) { }

    @Post("login")
    async login(@Body() body: LoginDto) {
        return this.loginUseCase.execute(body);
    }

    @Post("signup")
    @UseInterceptors(FileInterceptor('image'))
    async signup(
        @Body() body: SignUpDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        let imageUrl = body.image;

        if (file) {
            const { fileUrl } = await new UploadFileCommand(
                file,
                UploadPlatformEnum.CLOUDINARY,
                FolderUploadTypes.USERS
            ).execute();
            imageUrl = fileUrl;
        }

        return this.signUpUseCase.execute({
            email: body.email,
            name: body.name,
            password: body.password,
            image: imageUrl,
        });
    }

    @Post("provider")
    async loginProvider(@Body() params: AuthenticateParamsDto) {
        return this.authenticateUseCase.execute(params);
    }
}