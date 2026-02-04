import { IProductRepository } from '@/domain/repositories/product.repository';

export interface GetBrandSuggestionsDTO {
  query: string;
  limit?: number;
}

export class GetBrandSuggestionsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: GetBrandSuggestionsDTO): Promise<{ suggestions: string[] }> {
    if (!dto.query || dto.query.trim().length < 2) {
      return { suggestions: [] };
    }

    const limit = Math.min(dto.limit || 10, 20);
    const suggestions = await this.productRepository.searchBrandSuggestions(
      dto.query.trim(),
      limit
    );

    return { suggestions };
  }
}
