import api from "./axios";

// Get all published scenarios
export const getScenarios = async () => {
  const res = await api.get("/scenarios");
  return res.data;
};

// Get a single scenario by slug (e.g. 'doxxing')
export const getScenario = async (slug) => {
  const res = await api.get(`/scenarios/${slug}`);
  return res.data;
};

// Save a choice the user made
export const saveProgress = async (slug, { sceneId, choiceLabel, next }) => {
  const res = await api.post(`/scenarios/${slug}/progress`, {
    sceneId,
    choiceLabel,
    next,
  });
  return res.data;
};

// Mark the scenario as complete (pass badgeEarned: true if they took the safe path)
export const completeScenario = async (slug, badgeEarned = false) => {
  const res = await api.post(`/scenarios/${slug}/complete`, { badgeEarned });
  return res.data;
};

// Get all earned badges for the logged-in user
export const getUserBadges = async () => {
  const res = await api.get("/scenarios/user/badges");
  return res.data;
};
