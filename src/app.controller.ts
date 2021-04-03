import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Chain, owner, user } from './blockchain/blockchain';

@Controller('wallet')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':amount')
  getMoney(@Param() params): void {
    owner.sendMoney(params.amount, user.publicKey);
  }

  @Post(':amount')
  sendMoney(@Param() params): void {
    user.sendMoney(params.amount, owner.publicKey);
  }

  @Get('chain')
  getChain(): Chain {
    return Chain.instance;
  }
}
