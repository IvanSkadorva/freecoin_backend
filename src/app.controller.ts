import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Chain, owner, user } from './blockchain/blockchain';

@Controller('wallet')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':amount')
  getMoney(@Param() params): Chain {
    owner.sendMoney(params.amount, user.publicKey);
    return Chain.instance;
  }

  @Post(':amount')
  sendMoney(@Param() params): Chain {
    user.sendMoney(params.amount, owner.publicKey);
    return Chain.instance;
  }

  @Get('chain')
  getChain(): Chain {
    return Chain.instance;
  }
}
