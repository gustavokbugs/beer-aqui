import { IUserRepository } from '@/domain/repositories/user.repository';
import { User, UserRole } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email';
import { PrismaService } from '../database/prisma.service';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.reconstitute({
      id: user.id,
      name: user.name,
      email: Email.create(user.email),
      passwordHash: user.passwordHash,
      role: user.role as UserRole,
      isAdultConfirmed: user.isAdultConfirmed,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined,
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!user) return null;

    return User.reconstitute({
      id: user.id,
      name: user.name,
      email: Email.create(user.email),
      passwordHash: user.passwordHash,
      role: user.role as UserRole,
      isAdultConfirmed: user.isAdultConfirmed,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined,
    });
  }

  async save(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email.getValue(),
        passwordHash: user.passwordHash,
        role: user.role,
        isAdultConfirmed: user.isAdultConfirmed,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt ?? null,
      },
    });

    return User.reconstitute({
      id: created.id,
      name: created.name,
      email: Email.create(created.email),
      passwordHash: created.passwordHash,
      role: created.role as UserRole,
      isAdultConfirmed: created.isAdultConfirmed,
      emailVerified: created.emailVerified,
      emailVerifiedAt: created.emailVerifiedAt ?? undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      deletedAt: created.deletedAt ?? undefined,
    });
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email.getValue(),
        passwordHash: user.passwordHash,
        role: user.role,
        isAdultConfirmed: user.isAdultConfirmed,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt ?? null,
        updatedAt: new Date(),
        deletedAt: user.deletedAt ?? null,
      },
    });

    return User.reconstitute({
      id: updated.id,
      name: updated.name,
      email: Email.create(updated.email),
      passwordHash: updated.passwordHash,
      role: updated.role as UserRole,
      isAdultConfirmed: updated.isAdultConfirmed,
      emailVerified: updated.emailVerified,
      emailVerifiedAt: updated.emailVerifiedAt ?? undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      deletedAt: updated.deletedAt ?? undefined,
    });
  }
}
