import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NetrixLogo } from '../components/common/NetrixLogo';
import { StatusBadge } from '../components/common/StatusBadge';

describe('Component Unit Tests', () => {
  it('renders NetrixLogo with branding text and tagline', () => {
    render(<NetrixLogo showText={true} showTagline={true} />);
    expect(screen.getByText('NETRIX')).toBeInTheDocument();
    expect(screen.getByText(/Connect Beyond Limits/i)).toBeInTheDocument();
  });

  it('renders StatusBadge with correct label and indicators', () => {
    const { rerender } = render(<StatusBadge status="online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();

    rerender(<StatusBadge status="busy" label="In Support Session" />);
    expect(screen.getByText('In Support Session')).toBeInTheDocument();
  });
});
