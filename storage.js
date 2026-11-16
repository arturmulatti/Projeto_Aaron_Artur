const STORAGE_KEY = "pokebomber_ranking_v1";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function saveAll(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * READ: Retorna todos os registros ordenados da maior para a menor pontuação.
 */
export function getAllRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.score - a.score)
      : [];
  } catch {
    return [];
  }
}

/**
 * CREATE: Adiciona um novo registro de partida/jogador no localStorage.
 */
export function createRecord({ playerName, pokemonName = "Pikachu", pokemonSprite = "", score = 0 }) {
  const records = getAllRecords();
  const newRecord = {
    id: generateId(),
    playerName: playerName.trim() || "Anônimo",
    pokemonName,
    pokemonSprite,
    score: Number(score) || 0,
    updatedAt: new Date().toISOString()
  };

  records.push(newRecord);
  saveAll(records);
  return newRecord;
}

/**
 * UPDATE: Atualiza o nome ou pontuação de um registro existente pelo ID.
 */
export function updateRecord(id, updates) {
  const records = getAllRecords();
  const index = records.findIndex((item) => item.id === id);

  if (index === -1) return null;

  records[index] = {
    ...records[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveAll(records);
  return records[index];
}

/**
 * DELETE: Remove um registro específico pelo ID.
 */
export function deleteRecord(id) {
  const filtered = getAllRecords().filter((item) => item.id !== id);
  saveAll(filtered);
}

/**
 * DELETE ALL: Limpa todo o ranking armazenado.
 */
export function clearAllRecords() {
  localStorage.removeItem(STORAGE_KEY);
}