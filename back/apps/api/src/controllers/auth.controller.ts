import { AuthService } from '@domain/user/auth.service';
import { JwtAuthGuard } from '@domain/user/guards/jwt-auth.guard';
import { UserService } from '@domain/user/user.service';
import { Controller, Get, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { TransportService } from '@transport/transport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly transportService: TransportService,
  ) {}

  @Post('/login')
  async login(@Request() req, @Res() res: Response) {
    const { username, password } = req.body;

    const user = await this.authService.getUserFromUsername(username.trim());

    if ( !user ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'invalid_username',
        message: 'Not valid username',
      });
    }

    const userData = this.authService.validate(user, password);

    if ( !userData ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'invalid_password',
        message: 'Not valid password',
      });
    }

    return res.status(HttpStatus.OK).json({
      access_token: userData.token,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Request() req, @Res() res: Response) {
    const user = await this.userService.findOne({ _id: req.user.id });

    return user
      ? res.status(HttpStatus.OK).json(user['toResponse']())
      : res.sendStatus(HttpStatus.UNAUTHORIZED);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Res() res: Response) {
    return res.sendStatus(HttpStatus.OK);
  }

  @Post('/password')
  async password(@Request() req, @Res() res: Response) {
    const { username } = req.body;

    const user = await this.authService.getUserFromUsername(username.trim());
    if ( user ) {
      this.transportService.send('password:recover', { user });
    }

    return res.sendStatus(HttpStatus.OK);
  }
}
