import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';

import { AlertComponent, AlertTypes } from '@fc/dsfr';
import { ServiceProviderItemComponent } from '@fc/service-providers';

import { transformServiceProvider } from '../../services';
import { ServiceProvidersListComponent } from './service-providers-list.component';

jest.mock('../../services');
jest.mock('@fc/dsfr');
jest.mock('@fc/service-providers');

describe('ServiceProvidersListComponent', () => {
  // given
  const storeProvidersFixtures = [
    {
      createdAt: expect.any(String),
      datapasses: [{ remoteId: 1234 }],
      id: 'mongo-uid-1',
      name: expect.any(String),
      organisation: { name: expect.any(String) },
      platform: { name: expect.any(String) },
      status: expect.any(String),
    },
    {
      createdAt: expect.any(String),
      datapasses: [{ remoteId: 5678 }],
      id: 'mongo-uid-2',
      name: expect.any(String),
      organisation: { name: expect.any(String) },
      platform: { name: expect.any(String) },
      status: expect.any(String),
    },
    {
      createdAt: expect.any(String),
      datapasses: [{ remoteId: 9101112 }],
      id: 'mongo-uid-3',
      name: expect.any(String),
      organisation: { name: expect.any(String) },
      platform: { name: expect.any(String) },
      status: expect.any(String),
    },
  ];

  const serviceProviderMock = {
    color: expect.any(String),
    createdAt: expect.any(String),
    datapassId: 'Datapass N°1234',
    id: 'mongo-uid-undefined',
    organisationName: expect.any(String),
    platformName: expect.any(String),
    spName: expect.any(String),
    status: expect.any(String),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mocked(transformServiceProvider)
      .mockReturnValueOnce({
        ...serviceProviderMock,
        datapassId: 'Datapass N°1234',
        id: 'mongo-uid-4',
      })
      .mockReturnValueOnce({
        ...serviceProviderMock,
        datapassId: 'Datapass N°5678',
        id: 'mongo-uid-5',
      })
      .mockReturnValueOnce({
        ...serviceProviderMock,
        datapassId: 'Datapass N°9101112',
        id: 'mongo-uid-6',
      });
  });

  it('should match the snapshot, when service providers state has no items', () => {
    // when
    const { container } = render(
      <ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={0} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when service providers state has items', () => {
    // when
    const { container } = render(
      <ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={3} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call AlertComponent with WARNING parameter', () => {
    // when
    render(<ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={0} />);

    // then
    expect(AlertComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        dataTestId: 'ServiceProvidersListComponent-alert',
        type: AlertTypes.WARNING,
      }),
      {},
    );
  });

  it('should call transformServiceProvider 3 times with parameters', () => {
    // when
    render(<ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={3} />);

    // then
    expect(transformServiceProvider).toHaveBeenCalledTimes(3);
    expect(transformServiceProvider).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ datapasses: [{ remoteId: 1234 }] }),
      0,
      storeProvidersFixtures,
    );
    expect(transformServiceProvider).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ datapasses: [{ remoteId: 5678 }] }),
      1,
      storeProvidersFixtures,
    );
    expect(transformServiceProvider).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ datapasses: [{ remoteId: 9101112 }] }),
      2,
      storeProvidersFixtures,
    );
  });

  it('should call ServiceProviderItemComponent 3 times with parameters', () => {
    // when
    render(<ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={3} />);

    // then
    expect(ServiceProviderItemComponent).toHaveBeenCalledTimes(3);
    expect(ServiceProviderItemComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ datapassId: 'Datapass N°1234' }),
      {},
    );
    expect(ServiceProviderItemComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ datapassId: 'Datapass N°5678' }),
      {},
    );
    expect(ServiceProviderItemComponent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ datapassId: 'Datapass N°9101112' }),
      {},
    );
  });
});