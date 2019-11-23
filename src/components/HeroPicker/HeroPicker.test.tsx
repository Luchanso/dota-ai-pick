import React from 'react';
import { shallow } from 'enzyme';
import HeroPicker from './HeroPicker';

it('renders without crashing', () => {
  shallow(<HeroPicker />);
});
