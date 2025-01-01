import React, { useEffect } from 'react';
import { Switch, useColorMode } from '@chakra-ui/react';

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Chakra's color mode management

  // Sync Chakra's color mode with Tailwind CSS's class-based dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colorMode]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{colorMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
      <Switch
        size="lg"
        isChecked={colorMode === 'dark'}
        onChange={toggleColorMode}
        colorScheme="blue"
      />
    </div>
  );
};

export default ThemeToggle;
