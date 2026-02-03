import { PrismaService } from './database/prisma.service';
import { BcryptHashService } from './services/bcrypt-hash.service';
import { JwtTokenService } from './services/jwt-token.service';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaVendorRepository } from './repositories/prisma-vendor.repository';
import { PrismaProductRepository } from './repositories/prisma-product.repository';
import { PrismaAdRepository } from './repositories/prisma-ad.repository';

// Use Cases - Auth
import { RegisterUserUseCase } from '@/application/use-cases/auth/register-user.use-case';
import { AuthenticateUserUseCase } from '@/application/use-cases/auth/authenticate-user.use-case';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/refresh-token.use-case';
import { ConfirmEmailUseCase } from '@/application/use-cases/auth/confirm-email.use-case';
import { RequestPasswordResetUseCase } from '@/application/use-cases/auth/request-password-reset.use-case';
import { ResetPasswordUseCase } from '@/application/use-cases/auth/reset-password.use-case';

// Use Cases - Vendor
import { CreateVendorUseCase } from '@/application/use-cases/vendor/create-vendor.use-case';
import { UpdateVendorUseCase } from '@/application/use-cases/vendor/update-vendor.use-case';
import { GetVendorProfileUseCase } from '@/application/use-cases/vendor/get-vendor-profile.use-case';
import { SearchNearbyVendorsUseCase } from '@/application/use-cases/vendor/search-nearby-vendors.use-case';
import { VerifyVendorUseCase } from '@/application/use-cases/vendor/verify-vendor.use-case';

// Use Cases - Product
import { CreateProductUseCase } from '@/application/use-cases/product/create-product.use-case';
import { UpdateProductUseCase } from '@/application/use-cases/product/update-product.use-case';
import { UpdateProductPriceUseCase } from '@/application/use-cases/product/update-product-price.use-case';
import { ToggleProductStatusUseCase } from '@/application/use-cases/product/toggle-product-status.use-case';
import { DeleteProductUseCase } from '@/application/use-cases/product/delete-product.use-case';
import { ListVendorProductsUseCase } from '@/application/use-cases/product/list-vendor-products.use-case';
import { GetProductDetailsUseCase } from '@/application/use-cases/product/get-product-details.use-case';
import { SearchProductsUseCase } from '@/application/use-cases/product/search-products.use-case';
import { SearchProductsByBrandUseCase } from '@/application/use-cases/product/search-products-by-brand.use-case';

// Use Cases - Ad
import { CreateAdUseCase } from '@/application/use-cases/ad/create-ad.use-case';
import { ListActiveAdsUseCase } from '@/application/use-cases/ad/list-active-ads.use-case';
import { CancelAdUseCase } from '@/application/use-cases/ad/cancel-ad.use-case';
import { ExpireAdsUseCase } from '@/application/use-cases/ad/expire-ads.use-case';

/**
 * Container de Injeção de Dependências
 * Centraliza a criação e configuração de todas as dependências da aplicação
 */
export class DIContainer {
  // Singleton instances
  private static prismaService: PrismaService;
  private static hashService: BcryptHashService;
  private static tokenService: JwtTokenService;

  // Repositories
  private static userRepository: PrismaUserRepository;
  private static vendorRepository: PrismaVendorRepository;
  private static productRepository: PrismaProductRepository;
  private static adRepository: PrismaAdRepository;

  // Use Cases - Auth
  private static registerUserUseCase: RegisterUserUseCase;
  private static authenticateUserUseCase: AuthenticateUserUseCase;
  private static refreshTokenUseCase: RefreshTokenUseCase;
  private static confirmEmailUseCase: ConfirmEmailUseCase;
  private static requestPasswordResetUseCase: RequestPasswordResetUseCase;
  private static resetPasswordUseCase: ResetPasswordUseCase;

  // Use Cases - Vendor
  private static createVendorUseCase: CreateVendorUseCase;
  private static updateVendorUseCase: UpdateVendorUseCase;
  private static getVendorProfileUseCase: GetVendorProfileUseCase;
  private static searchNearbyVendorsUseCase: SearchNearbyVendorsUseCase;
  private static verifyVendorUseCase: VerifyVendorUseCase;

  // Use Cases - Product
  private static createProductUseCase: CreateProductUseCase;
  private static updateProductUseCase: UpdateProductUseCase;
  private static updateProductPriceUseCase: UpdateProductPriceUseCase;
  private static toggleProductStatusUseCase: ToggleProductStatusUseCase;
  private static deleteProductUseCase: DeleteProductUseCase;
  private static listVendorProductsUseCase: ListVendorProductsUseCase;
  private static getProductDetailsUseCase: GetProductDetailsUseCase;
  private static searchProductsUseCase: SearchProductsUseCase;
  private static searchProductsByBrandUseCase: SearchProductsByBrandUseCase;

  // Use Cases - Ad
  private static createAdUseCase: CreateAdUseCase;
  private static listActiveAdsUseCase: ListActiveAdsUseCase;
  private static cancelAdUseCase: CancelAdUseCase;
  private static expireAdsUseCase: ExpireAdsUseCase;

  // ========== Infrastructure Services ==========

  static getPrismaService(): PrismaService {
    if (!this.prismaService) {
      this.prismaService = PrismaService.getInstance();
    }
    return this.prismaService;
  }

  static getHashService(): BcryptHashService {
    if (!this.hashService) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
      this.hashService = new BcryptHashService(saltRounds);
    }
    return this.hashService;
  }

  static getTokenService(): JwtTokenService {
    if (!this.tokenService) {
      const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
      const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
      const accessTokenExpiration = process.env.JWT_ACCESS_EXPIRATION || '15m';
      const refreshTokenExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';

      this.tokenService = new JwtTokenService(
        accessTokenSecret,
        refreshTokenSecret,
        accessTokenExpiration,
        refreshTokenExpiration
      );
    }
    return this.tokenService;
  }

  // ========== Repositories ==========

  static getUserRepository(): PrismaUserRepository {
    if (!this.userRepository) {
      this.userRepository = new PrismaUserRepository(this.getPrismaService());
    }
    return this.userRepository;
  }

  static getVendorRepository(): PrismaVendorRepository {
    if (!this.vendorRepository) {
      this.vendorRepository = new PrismaVendorRepository(this.getPrismaService());
    }
    return this.vendorRepository;
  }

  static getProductRepository(): PrismaProductRepository {
    if (!this.productRepository) {
      this.productRepository = new PrismaProductRepository(this.getPrismaService());
    }
    return this.productRepository;
  }

  static getAdRepository(): PrismaAdRepository {
    if (!this.adRepository) {
      this.adRepository = new PrismaAdRepository(this.getPrismaService());
    }
    return this.adRepository;
  }

  // ========== Use Cases - Auth ==========

  static getRegisterUserUseCase(): RegisterUserUseCase {
    if (!this.registerUserUseCase) {
      this.registerUserUseCase = new RegisterUserUseCase(
        this.getUserRepository(),
        this.getHashService(),
        this.getTokenService()
      );
    }
    return this.registerUserUseCase;
  }

  static getAuthenticateUserUseCase(): AuthenticateUserUseCase {
    if (!this.authenticateUserUseCase) {
      this.authenticateUserUseCase = new AuthenticateUserUseCase(
        this.getUserRepository(),
        this.getHashService(),
        this.getTokenService()
      );
    }
    return this.authenticateUserUseCase;
  }

  static getRefreshTokenUseCase(): RefreshTokenUseCase {
    if (!this.refreshTokenUseCase) {
      this.refreshTokenUseCase = new RefreshTokenUseCase(
        this.getUserRepository(),
        this.getTokenService()
      );
    }
    return this.refreshTokenUseCase;
  }

  static getConfirmEmailUseCase(): ConfirmEmailUseCase {
    if (!this.confirmEmailUseCase) {
      this.confirmEmailUseCase = new ConfirmEmailUseCase(
        this.getUserRepository(),
        this.getTokenService()
      );
    }
    return this.confirmEmailUseCase;
  }

  static getRequestPasswordResetUseCase(): RequestPasswordResetUseCase {
    if (!this.requestPasswordResetUseCase) {
      this.requestPasswordResetUseCase = new RequestPasswordResetUseCase(
        this.getUserRepository(),
        this.getTokenService()
      );
    }
    return this.requestPasswordResetUseCase;
  }

  static getResetPasswordUseCase(): ResetPasswordUseCase {
    if (!this.resetPasswordUseCase) {
      this.resetPasswordUseCase = new ResetPasswordUseCase(
        this.getUserRepository(),
        this.getTokenService(),
        this.getHashService()
      );
    }
    return this.resetPasswordUseCase;
  }

  // ========== Use Cases - Vendor ==========

  static getCreateVendorUseCase(): CreateVendorUseCase {
    if (!this.createVendorUseCase) {
      this.createVendorUseCase = new CreateVendorUseCase(
        this.getVendorRepository(),
        this.getUserRepository()
      );
    }
    return this.createVendorUseCase;
  }

  static getUpdateVendorUseCase(): UpdateVendorUseCase {
    if (!this.updateVendorUseCase) {
      this.updateVendorUseCase = new UpdateVendorUseCase(this.getVendorRepository());
    }
    return this.updateVendorUseCase;
  }

  static getGetVendorProfileUseCase(): GetVendorProfileUseCase {
    if (!this.getVendorProfileUseCase) {
      this.getVendorProfileUseCase = new GetVendorProfileUseCase(this.getVendorRepository());
    }
    return this.getVendorProfileUseCase;
  }

  static getSearchNearbyVendorsUseCase(): SearchNearbyVendorsUseCase {
    if (!this.searchNearbyVendorsUseCase) {
      this.searchNearbyVendorsUseCase = new SearchNearbyVendorsUseCase(
        this.getVendorRepository()
      );
    }
    return this.searchNearbyVendorsUseCase;
  }

  static getVerifyVendorUseCase(): VerifyVendorUseCase {
    if (!this.verifyVendorUseCase) {
      this.verifyVendorUseCase = new VerifyVendorUseCase(
        this.getVendorRepository(),
        this.getUserRepository()
      );
    }
    return this.verifyVendorUseCase;
  }

  // ========== Use Cases - Product ==========

  static getCreateProductUseCase(): CreateProductUseCase {
    if (!this.createProductUseCase) {
      this.createProductUseCase = new CreateProductUseCase(
        this.getProductRepository(),
        this.getVendorRepository()
      );
    }
    return this.createProductUseCase;
  }

  static getUpdateProductUseCase(): UpdateProductUseCase {
    if (!this.updateProductUseCase) {
      this.updateProductUseCase = new UpdateProductUseCase(
        this.getProductRepository(),
        this.getVendorRepository()
      );
    }
    return this.updateProductUseCase;
  }

  static getUpdateProductPriceUseCase(): UpdateProductPriceUseCase {
    if (!this.updateProductPriceUseCase) {
      this.updateProductPriceUseCase = new UpdateProductPriceUseCase(
        this.getProductRepository(),
        this.getVendorRepository()
      );
    }
    return this.updateProductPriceUseCase;
  }

  static getToggleProductStatusUseCase(): ToggleProductStatusUseCase {
    if (!this.toggleProductStatusUseCase) {
      this.toggleProductStatusUseCase = new ToggleProductStatusUseCase(
        this.getProductRepository(),
        this.getVendorRepository()
      );
    }
    return this.toggleProductStatusUseCase;
  }

  static getDeleteProductUseCase(): DeleteProductUseCase {
    if (!this.deleteProductUseCase) {
      this.deleteProductUseCase = new DeleteProductUseCase(
        this.getProductRepository(),
        this.getVendorRepository()
      );
    }
    return this.deleteProductUseCase;
  }

  static getListVendorProductsUseCase(): ListVendorProductsUseCase {
    if (!this.listVendorProductsUseCase) {
      this.listVendorProductsUseCase = new ListVendorProductsUseCase(
        this.getProductRepository()
      );
    }
    return this.listVendorProductsUseCase;
  }

  static getGetProductDetailsUseCase(): GetProductDetailsUseCase {
    if (!this.getProductDetailsUseCase) {
      this.getProductDetailsUseCase = new GetProductDetailsUseCase(
        this.getProductRepository(),
        this.getVendorRepository()
      );
    }
    return this.getProductDetailsUseCase;
  }

  static getSearchProductsUseCase(): SearchProductsUseCase {
    if (!this.searchProductsUseCase) {
      this.searchProductsUseCase = new SearchProductsUseCase(this.getProductRepository());
    }
    return this.searchProductsUseCase;
  }

  static getSearchProductsByBrandUseCase(): SearchProductsByBrandUseCase {
    if (!this.searchProductsByBrandUseCase) {
      this.searchProductsByBrandUseCase = new SearchProductsByBrandUseCase(
        this.getProductRepository()
      );
    }
    return this.searchProductsByBrandUseCase;
  }

  // ========== Use Cases - Ad ==========

  static getCreateAdUseCase(): CreateAdUseCase {
    if (!this.createAdUseCase) {
      this.createAdUseCase = new CreateAdUseCase(
        this.getAdRepository(),
        this.getProductRepository()
      );
    }
    return this.createAdUseCase;
  }

  static getListActiveAdsUseCase(): ListActiveAdsUseCase {
    if (!this.listActiveAdsUseCase) {
      this.listActiveAdsUseCase = new ListActiveAdsUseCase(this.getAdRepository());
    }
    return this.listActiveAdsUseCase;
  }

  static getCancelAdUseCase(): CancelAdUseCase {
    if (!this.cancelAdUseCase) {
      this.cancelAdUseCase = new CancelAdUseCase(
        this.getAdRepository(),
        this.getProductRepository(),
        this.getVendorRepository()
      );
    }
    return this.cancelAdUseCase;
  }

  static getExpireAdsUseCase(): ExpireAdsUseCase {
    if (!this.expireAdsUseCase) {
      this.expireAdsUseCase = new ExpireAdsUseCase(this.getAdRepository());
    }
    return this.expireAdsUseCase;
  }

  // ========== Utility Methods ==========

  /**
   * Inicializa o banco de dados e todas as conexões
   */
  static async initialize(): Promise<void> {
    const prisma = this.getPrismaService();
    await prisma.connect();
  }

  /**
   * Encerra todas as conexões e limpa recursos
   */
  static async shutdown(): Promise<void> {
    if (this.prismaService) {
      await this.prismaService.disconnect();
    }
  }

  /**
   * Health check de todas as dependências críticas
   */
  static async healthCheck(): Promise<{
    database: boolean;
    services: boolean;
  }> {
    const prisma = this.getPrismaService();
    const databaseHealthy = await prisma.healthCheck();

    return {
      database: databaseHealthy,
      services: true, // Hash e Token services são sempre disponíveis
    };
  }
}
