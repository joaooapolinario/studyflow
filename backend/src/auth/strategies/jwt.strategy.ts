import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Pega o token do Header "Authorization: Bearer ..."
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "sua_chave_secreta_super_dificil_de_adivinhar_123", // Fallback caso o env falhe
    });
  }

  async validate(payload: any) {
    // Isso injeta o objeto "user" dentro da requisição (req.user)
    return { userId: payload.sub, email: payload.email };
  }
}