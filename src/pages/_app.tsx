import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if the user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDarkMode ? 'dark' : 'light';
    setTheme(systemTheme);
    document.body.className = `body-${systemTheme}`;

    // Listen for changes in system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      document.body.className = `body-${newTheme}`;
    };

    // Add event listener for theme changes
    mediaQuery.addEventListener('change', handleChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <>
      <Navbar theme={theme} />
      <Component {...pageProps} theme={theme} />
      <Footer theme={theme} />
    </>
  );
};

export default MyApp;