export const calculateProgress = (roleCount: number, totalUsers: number): number => {
  if (totalUsers === 0) return 0;
  
  const percentage = (roleCount / totalUsers) * 100;


  return Math.min(percentage / 100, 1);
};