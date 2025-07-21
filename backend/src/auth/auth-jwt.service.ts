import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as process from 'node:process';
import { lastValueFrom, map } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

@Injectable()
export class AuthJwtService {
  constructor(private readonly httpService: HttpService) {}

  public async verifyAccessToken(accessToken: string) {
    const jsonWebKeys: Array<JsonWebKey> = await this.getJsonWebKeySet();

    const decoded = jwt.decode(accessToken, { complete: true });
    if (!decoded) throw new Error('Failed to decode JWT token');
    const { header, payload } = decoded;
    if (!header.kid)
      throw new Error("The 'kid' property is missing in the JWT header");

    const publicKey: string | undefined | Buffer = this.findPublicKey(
      header.kid,
      jsonWebKeys,
    );
    if (!publicKey) return;
    try {
      jwt.verify(accessToken, publicKey, { algorithms: ['HS256', 'RS256'] });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.FORBIDDEN);
    }
    return payload;
  }

  async getJsonWebKeySet(): Promise<Array<JsonWebKey>> {
    let response = { keys: [] };
    try {
      response = await lastValueFrom(
        this.httpService
          .get(
            process.env.CCID_JWKS_URL ??
              'https://ccid.o.kg/realms/master/protocol/openid-connect/certs',
          )
          .pipe(
            map((response) => {
              return response.data;
              9;
            }),
          ),
      );
    } catch (e) {
      throw new HttpException(e.message, e.response.status);
    }
    if (!response || !response.keys || response.keys.length == 0) return [];

    return response.keys;
  }

  private findPublicKey(
    kid: string,
    jsonWebKeys: Array<any>,
  ): string | undefined | Buffer {
    const foundIndex = jsonWebKeys.findIndex(
      (jsonWebKey) => jsonWebKey.kid === kid,
    );

    if (foundIndex === -1) return;

    const x509Certificate = `\n-----BEGIN CERTIFICATE-----\n${jsonWebKeys[foundIndex].x5c[0]}\n-----END CERTIFICATE-----`;
    return crypto
      .createPublicKey(x509Certificate)
      .export({ type: 'spki', format: 'pem' });
  }
}
