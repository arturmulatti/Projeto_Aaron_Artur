const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

/**
 * Mapeia o tipo elemental do Pokémon para um atributo inicial no jogo.
 */
function resolveGameBonus(type) {
  const bonusByType = {
    fire: { code: "RANGE_UP", label: "+1 Alcance de Explosão" },
    electric: { code: "SPEED_UP", label: "+20% Velocidade" },
    water: { code: "BOMB_UP", label: "+1 Bomba Simultânea" },
    grass: { code: "BOMB_UP", label: "+1 Bomba Simultânea" }
  };

  return bonusByType[type] || { code: "BALANCED", label: "Status Equilibrado" };
}

/**
 * Busca um Pokémon na API pública e retorna apenas os dados
 * necessários para o jogo, totalmente isolado do DOM e do Canvas.
 */
export async function fetchPokemonCharacter(nameOrId) {
  const query = String(nameOrId || "").trim().toLowerCase();
  if (!query) {
    throw new Error("Digite o nome ou número de um Pokémon.");
  }

  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/${encodeURIComponent(query)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Pokémon "${nameOrId}" não encontrado.`);
      }
      throw new Error(`Erro ao consultar a PokéAPI (Status: ${response.status}).`);
    }

    const data = await response.json();
    const primaryType = data.types?.[0]?.type?.name || "normal";
    const spriteUrl =
      data.sprites?.front_default ||
      data.sprites?.other?.["official-artwork"]?.front_default ||
      "";

    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      type: primaryType,
      sprite: spriteUrl,
      bonus: resolveGameBonus(primaryType)
    };
  } catch (error) {
    console.error("Falha na requisição à PokéAPI:", error);

    if (error instanceof TypeError) {
      throw new Error("Sem conexão com a internet ou API indisponível.");
    }

    throw error;
  }
}