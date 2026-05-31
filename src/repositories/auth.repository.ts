import { AppDataSource } from '../config/database';
import { Organization } from '../entities/Organization';
import { RefreshToken } from '../entities/RefreshToken';
import { User } from '../entities/User';
import { UserRole } from '../entities/enum';



export class AuthRepository {
  private userRepo = AppDataSource.getRepository(User);
  private orgRepo = AppDataSource.getRepository(Organization);
  private tokenRepo = AppDataSource.getRepository(RefreshToken);

  findUserByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        organizationId: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  createOrganization(name: string) {
    const organization = this.orgRepo.create({ name });
    return this.orgRepo.save(organization);
  }

  createUser(input: {
    organizationId: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }) {
    const user = this.userRepo.create({
      ...input,
      role: input.role ?? UserRole.MEMBER,
    });
    return this.userRepo.save(user);
  }

  saveRefreshToken(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    const token = this.tokenRepo.create({
      ...input,
      revokedAt: null,
    });
    return this.tokenRepo.save(token);
  }

  findRefreshTokenByHash(tokenHash: string) {
    return this.tokenRepo.findOne({
      where: { tokenHash },
      relations: { user: true },
    });
  }

  revokeRefreshToken(tokenHash: string) {
    return this.tokenRepo.update({ tokenHash }, { revokedAt: new Date() });
  }
}