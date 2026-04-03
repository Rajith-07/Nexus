/**
 * Generate avatar initials and a deterministic gradient color
 * based on the username string.
 */

const GRADIENTS = [
  'linear-gradient(135deg, #00C9A7, #0066FF)',
  'linear-gradient(135deg, #FF6B9D, #FF3366)',
  'linear-gradient(135deg, #FFB830, #FF6B00)',
  'linear-gradient(135deg, #A855F7, #6366F1)',
  'linear-gradient(135deg, #06B6D4, #3B82F6)',
  'linear-gradient(135deg, #10B981, #059669)',
  'linear-gradient(135deg, #F43F5E, #EC4899)',
  'linear-gradient(135deg, #8B5CF6, #6D28D9)',
];

export const getAvatarGradient = (username = '') => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

export const getInitials = (username = '') => {
  return username.slice(0, 2).toUpperCase() || '??';
};
