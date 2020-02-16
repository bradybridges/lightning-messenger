import React from 'react';
import { shallow } from 'enzyme';
import Conversation from './Conversation';
import Message from '../Message/Message';
import { mockMessages } from '../../mockMessages';

describe('Conversation', () => {
  let wrapper;
  const mockUpdateConverstaion = jest.fn();
  const mockUser = { email: 'test@test.com' };
  const from = 'yourfriend@test.com';
  beforeEach(() => {
    wrapper = shallow(
      <Conversation 
        from={from}
        user={mockUser}
        messages={mockMessages}
        updateConversation={mockUpdateConverstaion}
      />
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renderMessages should return an array of Message components', () => {
    const messages = wrapper.instance().renderMessages();
    expect(messages.length).toEqual(3);
  });
});