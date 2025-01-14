import { render } from '@testing-library/react';

import { AlertComponent, AlertTypes } from '@fc/dsfr';

import { transformServiceProvidersList } from '../../services';
import { ServiceProvidersListItemComponent } from '../service-providers-list-item';
import { ServiceProvidersListComponent } from './service-providers-list.component';

jest.mock('@fc/dsfr');
jest.mock('../../services');
jest.mock('../service-providers-list-item/service-providers-list-item.component');

describe('ServiceProvidersListComponent', () => {
  // given
  const storeProvidersFixtures = [
    {
      meta: {
        permissions: ['SERVICE_PROVIDER_EDIT'],
        urls: {
          edit: '/edit',
          view: '/view',
        },
      },
      payload: {
        createdAt: expect.any(String),
        datapasses: [{ remoteId: 1234 }],
        id: 'mongo-uid-1',
        name: expect.any(String),
        organisation: { name: expect.any(String) },
        platform: { name: expect.any(String) },
        status: expect.any(String),
      },
    },
    {
      meta: {
        permissions: ['SERVICE_PROVIDER_VIEW'],
        urls: {
          edit: '/edit',
          view: '/view',
        },
      },
      payload: {
        createdAt: expect.any(String),
        datapasses: [{ remoteId: 5678 }],
        id: 'mongo-uid-2',
        name: expect.any(String),
        organisation: { name: expect.any(String) },
        platform: { name: expect.any(String) },
        status: expect.any(String),
      },
    },
    {
      meta: {
        permissions: ['SERVICE_PROVIDER_EDIT', 'SERVICE_PROVIDER_VIEW'],
        urls: {
          edit: '/edit',
          view: '/view',
        },
      },
      payload: {
        createdAt: expect.any(String),
        datapasses: [{ remoteId: 9101112 }],
        id: 'mongo-uid-3',
        name: expect.any(String),
        organisation: { name: expect.any(String) },
        platform: { name: expect.any(String) },
        status: expect.any(String),
      },
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
    url: '/edit',
  };

  beforeEach(() => {
    jest
      .mocked(transformServiceProvidersList)
      .mockReturnValueOnce({
        ...serviceProviderMock,
        datapassId: 'Datapass N°1234',
        id: 'mongo-uid-4',
      })
      .mockReturnValueOnce({
        ...serviceProviderMock,
        datapassId: 'Datapass N°5678',
        id: 'mongo-uid-5',
        url: '/view',
      })
      .mockReturnValueOnce({
        ...serviceProviderMock,
        datapassId: 'Datapass N°9101112',
        id: 'mongo-uid-6',
        url: '/edit',
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

  it('should call transformServiceProvidersList 3 times with datapasses parameters', () => {
    // when
    render(<ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={3} />);

    // then
    expect(transformServiceProvidersList).toHaveBeenCalledTimes(3);
    expect(transformServiceProvidersList).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        payload: expect.objectContaining({ datapasses: [{ remoteId: 1234 }] }),
      }),
      0,
      storeProvidersFixtures,
    );
    expect(transformServiceProvidersList).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        payload: expect.objectContaining({ datapasses: [{ remoteId: 5678 }] }),
      }),
      1,
      storeProvidersFixtures,
    );
    expect(transformServiceProvidersList).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        payload: expect.objectContaining({ datapasses: [{ remoteId: 9101112 }] }),
      }),
      2,
      storeProvidersFixtures,
    );
  });

  it('should call ServiceProvidersListItemComponent 3 times with datapass parameters', () => {
    // when
    render(<ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={3} />);

    // then
    expect(ServiceProvidersListItemComponent).toHaveBeenCalledTimes(3);
    expect(ServiceProvidersListItemComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ datapassId: 'Datapass N°1234' }),
      {},
    );
    expect(ServiceProvidersListItemComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ datapassId: 'Datapass N°5678' }),
      {},
    );
    expect(ServiceProvidersListItemComponent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ datapassId: 'Datapass N°9101112' }),
      {},
    );
  });

  it('should call transformServiceProvidersList 3 times with permissions and url parameters', () => {
    // when
    render(<ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={3} />);

    // then
    expect(transformServiceProvidersList).toHaveBeenCalledTimes(3);
    expect(transformServiceProvidersList).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        meta: expect.objectContaining({
          permissions: ['SERVICE_PROVIDER_EDIT'],
          urls: expect.objectContaining({
            edit: '/edit',
            view: '/view',
          }),
        }),
      }),
      0,
      storeProvidersFixtures,
    );
    expect(transformServiceProvidersList).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        meta: expect.objectContaining({
          permissions: ['SERVICE_PROVIDER_VIEW'],
          urls: expect.objectContaining({
            edit: '/edit',
            view: '/view',
          }),
        }),
      }),
      1,
      storeProvidersFixtures,
    );
    expect(transformServiceProvidersList).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        meta: expect.objectContaining({
          permissions: ['SERVICE_PROVIDER_EDIT', 'SERVICE_PROVIDER_VIEW'],
          urls: expect.objectContaining({
            edit: '/edit',
            view: '/view',
          }),
        }),
      }),
      2,
      storeProvidersFixtures,
    );
  });

  it('should call ServiceProvidersListItemComponent 3 times with url parameters', () => {
    // when
    render(<ServiceProvidersListComponent items={storeProvidersFixtures} totalItems={3} />);

    // then
    expect(ServiceProvidersListItemComponent).toHaveBeenCalledTimes(3);
    expect(ServiceProvidersListItemComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ url: '/edit' }),
      {},
    );
    expect(ServiceProvidersListItemComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ url: '/view' }),
      {},
    );
    expect(ServiceProvidersListItemComponent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ url: '/edit' }),
      {},
    );
  });
});
