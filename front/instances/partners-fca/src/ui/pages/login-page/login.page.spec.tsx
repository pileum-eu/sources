import { render } from '@testing-library/react';

import { LoginPage } from './login.page';

describe('LoginPage', () => {
  it('should match the snapshot', () => {
    const { container } = render(<LoginPage />);

    expect(container).toMatchSnapshot();
  });
});
