import { fetchPokemonCharacter } from "api.js";
import {
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  clearAllRecords
} from "storage.js";
import { createFreshMap } from "map.js";

let selectedCharacter = null;

// Alternância de telas via classe CSS (.active -> display: block | padrão -> display: none)
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// --- INTEGRAÇÃO COM POKÉAPI ---
async function handleSearchPokemon() {
  const input = document.getElementById("pokemon-input").value;
  const statusEl = document.getElementById("pokemon-status");
  const spriteEl = document.getElementById("pokemon-sprite");
  const infoEl = document.getElementById("pokemon-info");

  statusEl.textContent = "Buscando na PokéAPI...";
  spriteEl.hidden = true;
  infoEl.textContent = "";

  try {
    selectedCharacter = await fetchPokemonCharacter(input);
    statusEl.textContent = `${selectedCharacter.name} (#${selectedCharacter.id})`;
    spriteEl.src = selectedCharacter.sprite;
    spriteEl.hidden = false;
    infoEl.textContent = `Tipo: ${selectedCharacter.type.toUpperCase()} | Bônus: ${selectedCharacter.bonus.label}`;
  } catch (error) {
    selectedCharacter = null;
    statusEl.textContent = error.message;
  }
}

// --- RENDERIZAÇÃO DA TABELA CRUD ---
function renderRankingTable() {
  const tbody = document.getElementById("ranking-tbody");
  const records = getAllRecords();

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">Nenhum registro salvo ainda.</td></tr>`;
    return;
  }

  tbody.innerHTML = records
    .map(
      (rec, idx) => `
      <tr>
        <td>${idx + 1}º</td>
        <td>${rec.pokemonSprite ? `<img src="${rec.pokemonSprite}" width="40" alt="${rec.pokemonName}" />` : "-"}</td>
        <td>${rec.playerName}</td>
        <td>${rec.pokemonName}</td>
        <td><strong>${rec.score}</strong></td>
        <td>
          <button type="button" data-action="edit" data-id="${rec.id}">Editar Nome</button>
          <button type="button" class="danger" data-action="delete" data-id="${rec.id}">Excluir</button>
        </td>
      </tr>
    `
    )
    .join("");
}

// --- EVENTOS DE NAVEGAÇÃO E CRUD ---
document.getElementById("btn-fetch-pokemon").addEventListener("click", handleSearchPokemon);

document.getElementById("btn-start-game").addEventListener("click", () => {
  const playerName = document.getElementById("player-name").value.trim() || "Jogador 1";
  const currentMap = createFreshMap();

  document.getElementById("hud-player").textContent = playerName;
  document.getElementById("hud-bonus").textContent = selectedCharacter?.bonus.label || "Padrão";

  showScreen("game-screen");

  // Ponto de integração com o motor do jogo (game.js):
  console.log("Iniciar loop do Canvas com:", { playerName, selectedCharacter, currentMap });
});

document.getElementById("btn-open-ranking").addEventListener("click", () => {
  renderRankingTable();
  showScreen("ranking-screen");
});

document.getElementById("btn-back-menu").addEventListener("click", () => {
  showScreen("menu-screen");
});

document.getElementById("btn-exit-game").addEventListener("click", () => {
  // Exemplo de salvamento automático ao encerrar partida
  const playerName = document.getElementById("hud-player").textContent;
  const score = Number(document.getElementById("hud-score").textContent) || 0;

  createRecord({
    playerName,
    pokemonName: selectedCharacter?.name || "Pikachu",
    pokemonSprite: selectedCharacter?.sprite || "",
    score
  });

  renderRankingTable();
  showScreen("ranking-screen");
});

document.getElementById("crud-create-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = document.getElementById("crud-name");
  const scoreInput = document.getElementById("crud-score");

  createRecord({
    playerName: nameInput.value,
    pokemonName: selectedCharacter?.name || "Pikachu",
    pokemonSprite: selectedCharacter?.sprite || "",
    score: Number(scoreInput.value)
  });

  nameInput.value = "";
  scoreInput.value = "";
  renderRankingTable();
});

document.getElementById("ranking-tbody").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const { action, id } = btn.dataset;

  if (action === "delete") {
    deleteRecord(id);
    renderRankingTable();
  } else if (action === "edit") {
    const newName = prompt("Novo nome do jogador:");
    if (newName && newName.trim()) {
      updateRecord(id, { playerName: newName.trim() });
      renderRankingTable();
    }
  }
});

document.getElementById("btn-clear-ranking").addEventListener("click", () => {
  clearAllRecords();
  renderRankingTable();
});

// Carrega o personagem padrão ao abrir a página
handleSearchPokemon();