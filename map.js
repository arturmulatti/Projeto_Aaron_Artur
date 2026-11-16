export const TILE_SIZE = 48; // 15 * 48 = 720px | 13 * 48 = 624px

export const TILE_TYPES = {
  EMPTY: 0,          // Chão livre
  WALL: 1,           // Parede indestrutível
  DESTRUCTIBLE: 2,   // Bloco destrutível
  HIDDEN_POWERUP: 3  // Bloco destrutível com power-up escondido
};

/**
 * Matriz 15 colunas x 13 linhas.
 * Os 4 cantos possuem área livre em "L" (0) para o jogador e inimigos
 * não nascerem presos pela própria bomba.
 */
export const BASE_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 0, 2, 3, 2, 0, 2, 0, 2, 0, 0, 1],
  [1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1],
  [1, 2, 2, 3, 2, 2, 0, 2, 0, 2, 2, 3, 2, 2, 1],
  [1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1],
  [1, 2, 0, 2, 0, 3, 2, 2, 2, 3, 0, 2, 0, 2, 1],
  [1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1],
  [1, 2, 0, 2, 0, 3, 2, 2, 2, 3, 0, 2, 0, 2, 1],
  [1, 0, 1, 2, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0, 1],
  [1, 2, 2, 3, 2, 2, 0, 2, 0, 2, 2, 3, 2, 2, 1],
  [1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1],
  [1, 0, 0, 2, 0, 2, 3, 2, 0, 2, 0, 2, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

/**
 * Retorna uma cópia profunda da matriz para cada nova partida,
 * preservando o mapa original intacto para reinícios.
 */
export function createFreshMap() {
  return BASE_MAP.map((row) => [...row]);
}

/**
 * Verifica se uma célula (linha, coluna) bloqueia passagem.
 */
export function isSolidTile(grid, row, col) {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return true;
  }
  const tile = grid[row][col];
  return (
    tile === TILE_TYPES.WALL ||
    tile === TILE_TYPES.DESTRUCTIBLE ||
    tile === TILE_TYPES.HIDDEN_POWERUP
  );
}