import React from 'react';
import Header from './header';

export default function Layout({ children }: LayoutProperty) {
  return (
    <div id="body" className="bg-amber-50">
      <Header></Header>
      <div className=" p-4 min-h-screen">
        <div>{children}</div>
      </div>
    </div>
  );
}

interface LayoutProperty {
  children?: React.JSX.Element | React.JSX.Element[];
  parentElement?: string;
}
