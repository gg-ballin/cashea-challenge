import { Priority } from '@/constants/types';

export function getRandomPriority(): Priority {
  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const randomIndex = Math.floor(Math.random() * priorities.length);
  return priorities[randomIndex];
}