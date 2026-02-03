export interface IHashService {
  /**
   * Gera um hash da senha
   */
  hash(password: string): Promise<string>;

  /**
   * Compara uma senha com um hash
   */
  compare(password: string, hash: string): Promise<boolean>;
}
