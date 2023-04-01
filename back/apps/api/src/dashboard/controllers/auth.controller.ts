import { AdminService } from '@domain/user/admin.service';
import { AuthService } from '@domain/user/auth.service';
import { JwtAuthGuard } from '@domain/user/guards/jwt-auth.guard';
import { UserService } from '@domain/user/user.service';
import { Controller, Get, HttpStatus, Post, Res, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';

@Controller('dashboard/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  @Post('/login')
  async login(@Request() req, @Res() res: Response) {
    const { email, password } = req.body;

    const admin = await this.adminService.findOne({ email });
    if ( !admin ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'invalid_email',
        message: 'Not valid email',
      });
    }

    const adminData = this.authService.validate(admin, password);
    if ( !adminData ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: 'invalid_password',
        message: 'Not valid password',
      });
    }

    return res.status(HttpStatus.OK).json({
      access_token: adminData.token,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Request() req, @Res() res: Response) {
    const admin = await this.adminService.findOne({ _id: req.user.id });

    return admin
      ? res.status(HttpStatus.OK).json({ admin: admin['toResponse']() })
      : res.sendStatus(HttpStatus.UNAUTHORIZED);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Res() res: Response) {
    return res.sendStatus(HttpStatus.OK);
  }
}
