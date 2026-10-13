import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Public } from "@/common/presentation/decorators";

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Public()
  @ApiOperation({ summary: "Health check / Saludo de la API" })
  @ApiResponse({ status: 200, description: "Servicio en funcionamiento" })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
