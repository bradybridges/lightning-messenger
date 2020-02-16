import React from 'react';
import { shallow } from 'enzyme';
import ComposeMessageForm from './ComposeMessageForm';

describe('ComposeMessageForm', () => {
  let wrapper;
  const mockUpdateConversation = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <ComposeMessageForm 
        to="receiver" 
        from="sender" 
        mockUpdateConversation={mockUpdateConversation}
      />
    );
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should have state containing a property of message', () => {
    expect(wrapper.state('message')).toEqual('');
  });

  it('handleChange should update with a given message', () => {
    const mockMessage = 'Hello there';
    wrapper.instance().handleChange(mockMessage);
    expect(wrapper.state('message')).toEqual(mockMessage);
  });

  it('sendMessage should do nothing if there is no message to send', () => {
    wrapper.instance().sendMessage();
    expect(mockUpdateConversation).not.toHaveBeenCalled();
  });
});