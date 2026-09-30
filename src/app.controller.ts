import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Health check / Saludo de la API' })
  @ApiResponse({ status: 200, description: 'Servicio en funcionamiento' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
