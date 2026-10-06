import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SorobanContractUI } from '../SorobanContractUI';

describe('SorobanContractUI', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <SorobanContractUI contractId="CACQQJZZWWQ3U6TYTNG46J6D6Z7XUYZN32I5V6UUTP6R457N75XYIWTF" />
    );
    
    expect(getByText(/Soroban Contract:/)).toBeTruthy();
    expect(getByPlaceholderText('e.g. increment')).toBeTruthy();
    expect(getByText('Simulate Invocation')).toBeTruthy();
  });
});
