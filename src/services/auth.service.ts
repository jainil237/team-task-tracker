import { AuthRepository } from '../repositories/auth.repository';
import { comparePassword, hashPassword } from '../utils/password';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { UserRole } from '../entities/enum';

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  async register(input: {
    name: string;
    email: string;
    password: string;
    organizationName: string;
  }) {
    const existing = await this.authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const organization = await this.authRepository.createOrganization(
      input.organizationName
    );

    const passwordHash = await hashPassword(input.password);

    const user = await this.authRepository.createUser({
      organizationId: organization.id,
      name: input.name,
      email: input.email,
      passwordHash,
      role: UserRole.ADMIN,
    });

    const basePayload = {
      sub: user.id,
      organizationId: user.organizationId,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(basePayload);
    const { token: refreshToken } = signRefreshToken(basePayload);
    const decoded = verifyRefreshToken(refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(decoded.exp * 1000),
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async login(input: { email: string; password: string }) {
    const user = await this.authRepository.findUserByEmail(input.email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const basePayload = {
      sub: user.id,
      organizationId: user.organizationId,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(basePayload);
    const { token: refreshToken } = signRefreshToken(basePayload);
    const decoded = verifyRefreshToken(refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(decoded.exp * 1000),
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken || storedToken.revokedAt) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    verifyRefreshToken(refreshToken);

    await this.authRepository.revokeRefreshToken(tokenHash);

    const user = storedToken.user;
    const basePayload = {
      sub: user.id,
      organizationId: user.organizationId,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(basePayload);
    const { token: newRefreshToken } = signRefreshToken(basePayload);
    const decoded = verifyRefreshToken(newRefreshToken);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(decoded.exp * 1000),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    await this.authRepository.revokeRefreshToken(hashToken(refreshToken));
    return { success: true };
  }
}