import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import PasswordReset from './PasswordReset';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><PasswordReset/></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
