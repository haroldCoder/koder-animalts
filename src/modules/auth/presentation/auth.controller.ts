import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { Body, Controller, Get, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    AuthenticateUseCase,
    GetProfileUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    SignUpUseCase,
    CompleteRegistrationUseCase,
} from "@auth/application/use-cases";
import { AuthenticateParamsDto, LoginDto, RefreshTokenDto, SignUpDto, CompleteRegistrationDto, AuthResponseDataDto, UserAuthProfileDto } from "@auth/presentation/dtos";
import { UploadFileCommand } from "@/common/upload/application/use-cases";
import { FolderUploadTypes, UploadPlatformEnum } from "@/common/upload/domain/enums";
import { Public, CurrentUser } from "@/common/presentation/decorators";
import type { Request } from "express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authenticateUseCase: AuthenticateUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly signUpUseCase: SignUpUseCase,
        private readonly completeRegistrationUseCase: CompleteRegistrationUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly getProfileUseCase: GetProfileUseCase,
    ) { }

    @Public()
    @ApiOperation({ summary: "Login con correo y contraseña (Retorna accessToken y refreshToken)" })
    @ApiResponse({ status: 200, description: "Operación exitosa.", type: AuthResponseDataDto })
    @ApiResponse({ status: 401, description: "Credenciales inválidas." })
    @Post("login")
    async login(@Body() body: LoginDto, @Req() req?: Request) {
        const ipAddress = req?.ip;
        const userAgent = req?.headers?.["user-agent"];
        return this.loginUseCase.execute({
            email: body.email,
            password: body.password,
            ipAddress,
            userAgent,
        });
    }

    @Public()
    @ApiOperation({ summary: "Registrar un nuevo usuario (VETERINARIAN u OWNER, retorna accessToken y refreshToken)" })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            required: ["email", "name", "password"],
            properties: {
                email: { type: "string", example: "usuario@example.com" },
                name: { type: "string", example: "Juan Pérez" },
                password: { type: "string", example: "Password123!" },
                role: { type: "string", enum: ["VETERINARIAN", "OWNER"], example: "OWNER" },
                phone: { type: "string", example: "+573001234567" },
                address: { type: "string", example: "Calle 10 # 20-30" },
                clinicId: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
                specialty: { type: "string", example: "Medicina General" },
                image: { type: "string", format: "binary", description: "Imagen de perfil opcional" },
            },
        },
    })
    @ApiResponse({ status: 201, description: "Usuario registrado exitosamente con tokens.", type: AuthResponseDataDto })
    @ApiResponse({ status: 400, description: "Datos inválidos o correo ya registrado." })
    @Post("signup")
    @UseInterceptors(FileInterceptor("image"))
    async signup(
        @Body() body: SignUpDto,
        @UploadedFile() file?: Express.Multer.File,
        @Req() req?: Request,
    ) {
        let imageUrl = body.image;

        if (file) {
            const { fileUrl } = await new UploadFileCommand(
                file,
                UploadPlatformEnum.SUPABASE,
                FolderUploadTypes.USERS,
            ).execute(body.email);
            imageUrl = fileUrl;
        }

        const ipAddress = req?.ip;
        const userAgent = req?.headers?.["user-agent"];

        return this.signUpUseCase.execute({
            email: body.email,
            name: body.name,
            password: body.password,
            image: imageUrl,
            role: body.role,
            phone: body.phone,
            address: body.address,
            clinicId: body.clinicId,
            specialty: body.specialty,
            ipAddress,
            userAgent,
        });
    }

    @Public()
    @ApiOperation({ summary: "Completar registro de usuario asignando rol (VETERINARIAN u OWNER) y perfil" })
    @ApiResponse({ status: 200, description: "Registro completado exitosamente con nuevos tokens.", type: AuthResponseDataDto })
    @ApiResponse({ status: 400, description: "Datos inválidos o incompletos." })
    @Post("complete-registration")
    async completeRegistration(
        @Body() body: CompleteRegistrationDto,
        @CurrentUser() user?: any,
        @Req() req?: Request,
    ) {
        const userId = body.userId || user?.id || user?.userId;
        const ipAddress = req?.ip;
        const userAgent = req?.headers?.["user-agent"];

        return this.completeRegistrationUseCase.execute({
            userId,
            role: body.role,
            phone: body.phone,
            address: body.address,
            clinicId: body.clinicId,
            specialty: body.specialty,
            ipAddress,
            userAgent,
        });
    }

    @Public()
    @ApiOperation({ summary: "Renovar tokens de autenticación usando refreshToken" })
    @ApiResponse({ status: 200, description: "Tokens renovados exitosamente.", type: AuthResponseDataDto })
    @ApiResponse({ status: 401, description: "Refresh token inválido o expirado." })
    @Post("refresh")
    async refresh(@Body() body: RefreshTokenDto) {
        return this.refreshTokenUseCase.execute({
            refreshToken: body.refreshToken,
        });
    }

    @Public()
    @ApiOperation({ summary: "Login provider (OAuth)" })
    @ApiResponse({ status: 200, description: "Operación exitosa.", type: AuthResponseDataDto })
    @ApiResponse({ status: 400, description: "Solicitud inválida." })
    @Post("provider")
    async loginProvider(@Body() params: AuthenticateParamsDto) {
        return this.authenticateUseCase.execute(params);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Obtener perfil y rol del usuario autenticado" })
    @ApiResponse({ status: 200, description: "Perfil obtenido exitosamente.", type: UserAuthProfileDto })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @Get("me")
    async getProfile(@CurrentUser() user: any) {
        return this.getProfileUseCase.execute(user?.id || user?.userId);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Cerrar sesión e invalidar tokens" })
    @ApiResponse({ status: 200, description: "Sesión cerrada exitosamente." })
    @ApiResponse({ status: 401, description: "No autorizado." })
    @Post("logout")
    async logout(
        @CurrentUser() user: any,
        @Body() body?: Partial<RefreshTokenDto>,
    ) {
        return this.logoutUseCase.execute({
            refreshToken: body?.refreshToken,
            userId: user?.id || user?.userId,
        });
    }
}