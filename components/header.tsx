import Link from 'next/link';
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useEffect, useState } from 'react';

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageXOffset;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`p-4 max-w-[720px] mx-auto bg-white rounded shadow align-middle sticky top-0 z-50 transition-transform duration-300 ${isScrolled ? 'transform-translate-y-0' : 'transform-translate-y-0'}`}
    >
      <div>
        <Button
          id="fade-button"
          aria-controls={open ? 'fade-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Menu
        </Button>
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={handleClose}>
            <Link href="/">Home</Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link href="/find-the-cheese">Maze Game</Link>
          </MenuItem>
        </Menu>
      </div>
      <div className="container mx-auto py-4">
        <h1 className={`font-bold text-4xl text-center ${isScrolled ? 'opacity-100' : 'opacity-100'}`}>
          Jedi Software
        </h1>
      </div>
    </header>
  );
}
