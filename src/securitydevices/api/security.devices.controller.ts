import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SecurityDevicesService } from '../application/security.devices.service';
import { QueryAuthDevicesRepositories } from '../infrastructure/query.auth.devices.repositories';
import { Request } from 'express';
import { DeviceGuards } from '../application/adapters/guards/device.guards';
import { Cookies } from '../../types/decorator';
import { refreshType } from '../../auth/auth.types';
import { IdForReqDevices } from '../infrastructure/device.types';

@Controller('/security/devices')
export class SecurityDevicesController {
  constructor(
    protected securityDevicesService: SecurityDevicesService,
    protected queryAuthDevicesRepositories: QueryAuthDevicesRepositories,
  ) {}

  @UseGuards(DeviceGuards)
  @Get('/')
  async getAllDevices(
    @Req() req: Request,
    @Cookies('refreshToken') token: refreshType,
  ) {
    return this.queryAuthDevicesRepositories.getAllDeviceByUserId(
      req.device.userId,
    );
  }

  @HttpCode(204)
  @UseGuards(DeviceGuards)
  @Delete('/')
  async terminateAllExceptCurrentOne(
    @Req() req: Request,
    @Cookies('refreshToken') token: refreshType,
  ) {
    await this.securityDevicesService.terminateAllSessionExceptCurrent(
      req.device.userId,
      req.device.deviceId,
    );
  }

  @HttpCode(204)
  @UseGuards(DeviceGuards)
  @Delete('/:id')
  async terminateSpecifiedDevice(
    @Req() req: Request,
    @Param() param: IdForReqDevices,
    @Cookies('refreshToken') token: refreshType,
  ) {
    const isDeleted: string = await this.securityDevicesService.deleteDevice(
      req.device.userId,
      param.id,
    );

    if (isDeleted.toString() === 'not found') {
      throw new NotFoundException([
        {
          message: 'NOT FOUND',
          field: 'deviceId',
        },
      ]);
    }
    if (isDeleted.toString() === 'forbidden') {
      throw new ForbiddenException([
        {
          message: 'try to delete the deviceId of other user',
          field: 'deviceId',
        },
      ]);
    }
    return;
  }
}
