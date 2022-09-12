import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AccountContext, AccountInterface } from '@fc/account';

import { ServiceProvidersListComponent } from '../service-providers-list';
import { ServiceProvidersPageTitleComponent } from '../service-providers-page-title';
import { ServiceProvidersPage } from './service-providers.page';

jest.mock('react-redux');
jest.mock('@fc/partners');
jest.mock('../service-providers-list/service-providers-list.component');
jest.mock('../service-providers-page-title/service-providers-page-title.component');

describe('ServiceProvidersPage', () => {
  const accountContextMock = {
    connected: true,
  } as unknown as AccountInterface;

  beforeEach(() => {
    jest.clearAllMocks();

    mocked(useDispatch).mockReturnValueOnce(jest.fn());
  });

  it('should match the snapshot when user is connected', () => {
    // given
    mocked(useSelector).mockReturnValueOnce({ items: [], totalItems: 0 });

    // when
    const { container } = render(
      <AccountContext.Provider value={accountContextMock}>
        <ServiceProvidersPage />
      </AccountContext.Provider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when user is not connected', () => {
    // given
    mocked(useSelector).mockReturnValueOnce({ items: [], totalItems: 0 });

    // when
    const { container } = render(
      <AccountContext.Provider value={{ ...accountContextMock, connected: false }}>
        <ServiceProvidersPage />
      </AccountContext.Provider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call ServiceProvidersPageTitleComponent', () => {
    // given
    const totalItems = 3;
    const items = [expect.any(Object), expect.any(Object), expect.any(Object)];
    mocked(useSelector).mockReturnValue({ items, totalItems });

    // when
    render(
      <AccountContext.Provider value={accountContextMock}>
        <ServiceProvidersPage />
      </AccountContext.Provider>,
    );

    // then
    expect(ServiceProvidersPageTitleComponent).toHaveBeenCalledTimes(1);
    expect(ServiceProvidersPageTitleComponent).toHaveBeenCalledWith({ totalItems: 3 }, {});
  });

  it('should call ServiceProvidersListComponent with params', () => {
    // given
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: true });
    const totalItems = 3;
    const items = [expect.any(Object), expect.any(Object), expect.any(Object)];
    mocked(useSelector).mockReturnValue({ items, totalItems });

    // when
    render(
      <AccountContext.Provider value={accountContextMock}>
        <ServiceProvidersPage />
      </AccountContext.Provider>,
    );

    // then
    expect(ServiceProvidersListComponent).toHaveBeenCalledTimes(1);
    expect(ServiceProvidersListComponent).toHaveBeenCalledWith(
      {
        items,
        totalItems,
      },
      {},
    );
  });
});
