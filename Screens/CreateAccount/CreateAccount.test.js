import React from 'react';
import { shallow } from 'enzyme';
import CreateAccount from './CreateAccount';

describe('CreateAccount', () => {
  const mockNavigate = {navigate: jest.fn()};
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CreateAccount navigation={mockNavigate} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('handleChange should update corresponding property in state with a value', () => {
    const expected = {
      email: 'test@test.com',
      password: 'password',
      passwordConfirm: 'password',
    };
    wrapper.instance().handleChange('email', 'test@test.com');
    wrapper.instance().handleChange('password', 'password');
    wrapper.instance().handleChange('passwordConfirm', 'password');
    expect(wrapper.state()).toEqual(expected);
  });
});