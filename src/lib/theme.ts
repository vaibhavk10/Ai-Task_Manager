export const toggleTheme = (isDark: boolean) => {
  // Update HTML class
  document.documentElement.classList.toggle('dark', isDark);
  
  // Update localStorage
  localStorage.setItem('darkMode', isDark.toString());
  
  // Update CSS variables
  if (isDark) {
    document.documentElement.style.setProperty('--background', '222.2 84% 4.9%');
    document.documentElement.style.setProperty('--foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--card', '222.2 84% 4.9%');
    document.documentElement.style.setProperty('--card-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--popover', '222.2 84% 4.9%');
    document.documentElement.style.setProperty('--popover-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--primary', '217.2 91.2% 59.8%');
    document.documentElement.style.setProperty('--primary-foreground', '222.2 47.4% 11.2%');
    document.documentElement.style.setProperty('--secondary', '217.2 32.6% 17.5%');
    document.documentElement.style.setProperty('--secondary-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--muted', '217.2 32.6% 17.5%');
    document.documentElement.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
    document.documentElement.style.setProperty('--accent', '217.2 32.6% 17.5%');
    document.documentElement.style.setProperty('--accent-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--destructive', '0 62.8% 30.6%');
    document.documentElement.style.setProperty('--destructive-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--border', '217.2 32.6% 17.5%');
    document.documentElement.style.setProperty('--input', '217.2 32.6% 17.5%');
    document.documentElement.style.setProperty('--ring', '224.3 76.3% 48%');
  } else {
    document.documentElement.style.setProperty('--background', '0 0% 100%');
    document.documentElement.style.setProperty('--foreground', '222.2 84% 4.9%');
    document.documentElement.style.setProperty('--card', '0 0% 100%');
    document.documentElement.style.setProperty('--card-foreground', '222.2 84% 4.9%');
    document.documentElement.style.setProperty('--popover', '0 0% 100%');
    document.documentElement.style.setProperty('--popover-foreground', '222.2 84% 4.9%');
    document.documentElement.style.setProperty('--primary', '221.2 83.2% 53.3%');
    document.documentElement.style.setProperty('--primary-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--secondary', '210 40% 96.1%');
    document.documentElement.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%');
    document.documentElement.style.setProperty('--muted', '210 40% 96.1%');
    document.documentElement.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
    document.documentElement.style.setProperty('--accent', '210 40% 96.1%');
    document.documentElement.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%');
    document.documentElement.style.setProperty('--destructive', '0 84.2% 60.2%');
    document.documentElement.style.setProperty('--destructive-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--border', '214.3 31.8% 91.4%');
    document.documentElement.style.setProperty('--input', '214.3 31.8% 91.4%');
    document.documentElement.style.setProperty('--ring', '221.2 83.2% 53.3%');
  }
};

export const initializeTheme = () => {
  const savedTheme = localStorage.getItem('darkMode') === 'true';
  toggleTheme(savedTheme);
  return savedTheme;
}; 