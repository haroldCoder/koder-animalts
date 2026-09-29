import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthenticateUseCase, LoginUseCase, SignUpUseCase } from "@auth/application/use-cases";
import { AuthenticateParamsDto, LoginDto, SignUpDto } from "@auth/presentation/dtos";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";

@ApiTags('Auth')
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authenticateUseCase: AuthenticateUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly signUpUseCase: SignUpUseCase,
    ) { }

    @ApiOperation({ summary: 'Login con correo y contraseña' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Post("login")
    async login(@Body() body: LoginDto) {
        return this.loginUseCase.execute(body);
    }

    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['email', 'name', 'password'],
            properties: {
                email: { type: 'string', example: 'usuario@example.com' },
                name: { type: 'string', example: 'Juan Pérez' },
                password: { type: 'string', example: 'Password123!' },
                image: { type: 'string', format: 'binary', description: 'Imagen de perfil opcional' }
            }
        }
    })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o correo ya registrado.' })
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

    @ApiOperation({ summary: 'Login provider' })
    @ApiResponse({ status: 200, description: 'Operación exitosa.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
    @Post("provider")
    async loginProvider(@Body() params: AuthenticateParamsDto) {
        return this.authenticateUseCase.execute(params);
    }
}