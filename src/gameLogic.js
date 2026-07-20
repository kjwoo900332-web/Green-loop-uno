// ===== Green Loop - SDGs UNO 게임 로직 =====

export const COLORS = ["green", "blue", "yellow", "red"];

export const COLOR_LABEL = {
  green: "환경 (SDGs 13·14·15)",
  blue: "사회 (SDGs 1·3·4)",
  yellow: "거버넌스 (SDGs 16·17)",
  red: "경제 (SDGs 8·9·12)"
};

export const COLOR_HEX = {
  green: "#2E7D32",
  blue: "#1565C0",
  yellow: "#F9A825",
  red: "#C62828",
  wild: "#212121"
};

// 카드 1장당 절감되는 CO2 (g) - 재생지 카드 실물 1장 대체 기준 추정치
const CO2_PER_CARD_G = 4.5;

// ---- 덱 생성 ----
export function createDeck() {
  const deck = [];
  let id = 0;

  COLORS.forEach((color) => {
    deck.push({ id: `c${id++}`, color, type: "number", value: 0 });
    for (let n = 1; n <= 9; n++) {
      deck.push({ id: `c${id++}`, color, type: "number", value: n });
      deck.push({ id: `c${id++}`, color, type: "number", value: n });
    }
    ["skip", "reverse", "draw2"].forEach((type) => {
      deck.push({ id: `c${id++}`, color, type });
      deck.push({ id: `c${id++}`, color, type });
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ id: `c${id++}`, color: "wild", type: "wild" });
    deck.push({ id: `c${id++}`, color: "wild", type: "wild4" });
    deck.push({ id: `c${id++}`, color: "wild", type: "greenaction" });
    deck.push({ id: `c${id++}`, color: "wild", type: "quiz" });
    deck.push({ id: `c${id++}`, color: "wild", type: "carbonneutral" });
  }

  return shuffle(deck);
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const CARD_LABEL = {
  skip: "재활용 (Skip)",
  reverse: "순환 (Reverse)",
  draw2: "오염+2 (Draw2)",
  wild: "정책전환 (Wild)",
  wild4: "탄소폭탄 (Wild+4)",
  greenaction: "그린액션",
  quiz: "SDGs퀴즈",
  carbonneutral: "탄소중립"
};

// 카드가 현재 판(top 카드, 현재 색상) 위에 낼 수 있는지 확인
export function canPlay(card, topCard, currentColor) {
  if (card.type === "wild" || card.type === "wild4") return true;
  if (card.color === "wild") return true;
  if (card.color === currentColor) return true;
  if (topCard.type === "number" && card.type === "number") {
    return card.value === topCard.value;
  }
  if (card.type === topCard.type && card.type !== "number") return true;
  return false;
}

export function handCardValue(card) {
  if (card.type === "number") return card.value;
  if (card.type === "wild" || card.type === "wild4") return 50;
  return 20;
}

export function calcCO2SavedGrams(totalCardsUsedInGame) {
  return Math.round(totalCardsUsedInGame * CO2_PER_CARD_G);
}

export function nextPlayerIndex(currentIndex, playerCount, direction, skipCount = 1) {
  let idx = currentIndex;
  for (let i = 0; i < skipCount; i++) {
    idx = (idx + direction + playerCount) % playerCount;
  }
  return idx;
}

export function makeInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
