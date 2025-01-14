import { ConfigService } from '@fc/config';
import * as httpClient from '@fc/http-client';

import { ServiceProvidersActionTypes, ServiceProvidersOptions } from '../enums';
import {
  serviceProviderEditFailed,
  serviceProviderEditSuccessed,
  serviceProvidersFailed,
  serviceProvidersSuccessed,
  serviceProviderViewFailed,
  serviceProviderViewSuccessed,
} from './actions';
import {
  requestServiceProviderEdit,
  requestServiceProviders,
  requestServiceProviderView,
} from './side-effects';

jest.mock('./actions');
jest.mock('@fc/config');
jest.mock('@fc/http-client');

describe('side-effects', () => {
  // given
  const dispatchMock = jest.fn();
  const configServiceEndpoint = 'any-url-endpoint';
  const itemsMock = [expect.any(Object), expect.any(Object), expect.any(Object)];
  const dataMock = { meta: { total: 100 }, payload: itemsMock };
  const responseMock = {
    config: expect.any(Object),
    data: dataMock,
    headers: expect.any(Object),
    status: expect.any(Object),
    statusText: expect.any(String),
  };
  const actionMock = {
    payload: { items: itemsMock, totalItems: 100 },
    type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_SUCCESSED,
  };

  const configServiceEditEndpoint = 'any-url-endpoint/44/edit';
  const configServiceViewEndpoint = 'any-url-endpoint/44/view';
  const itemMock = expect.any(Object);
  const dataItemMock = {
    payload: expect.any(Object),
    type: expect.any(String),
  };
  const responseItemMock = {
    config: expect.any(Object),
    data: dataItemMock,
    headers: expect.any(Object),
    status: expect.any(Object),
    statusText: expect.any(String),
  };
  const actionEditMock = {
    payload: itemMock,
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_SUCCESSED,
  };
  const actionViewMock = {
    payload: itemMock,
    type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_SUCCESSED,
  };

  describe('Service providers list tests', () => {
    describe('requestServiceProviders when promise is resolved', () => {
      beforeEach(() => {
        jest.mocked(httpClient.get).mockResolvedValueOnce(responseMock);
        jest.mocked(serviceProvidersSuccessed).mockReturnValueOnce(actionMock);
        jest
          .mocked(ConfigService.get)
          .mockReturnValueOnce({ endpoints: { serviceProviders: configServiceEndpoint } });
      });

      it('should call ConfigService with parameters', async () => {
        // given
        const action = {
          type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
        };

        // when
        await requestServiceProviders(action, dispatchMock);

        // then
        expect(ConfigService.get).toHaveBeenCalledWith(ServiceProvidersOptions.CONFIG_NAME);
      });

      it('should call httpClient with parameters', async () => {
        // given
        const action = {
          type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
        };

        // when
        await requestServiceProviders(action, dispatchMock);

        // then
        expect(httpClient.get).toHaveBeenCalledWith(configServiceEndpoint);
      });

      it('should call the dispatch callback function with parameters', async () => {
        // given
        const action = {
          type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
        };

        // when
        await requestServiceProviders(action, dispatchMock);

        // then
        expect(serviceProvidersSuccessed).toHaveBeenCalledWith({
          items: dataMock.payload,
          totalItems: dataMock.meta.total,
        });
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
      });
    });

    describe('requestServiceProviders when promise is rejected', () => {
      beforeEach(() => {
        jest.mocked(httpClient.get).mockRejectedValueOnce(new Error(expect.any(String)));
        jest.mocked(serviceProvidersFailed).mockReturnValueOnce({ type: 'any-event-type' });
      });

      it('should dispatch serviceProvidersFailed action', async () => {
        // given
        const action = {
          type: ServiceProvidersActionTypes.SERVICE_PROVIDERS_REQUESTED,
        };

        // when
        await requestServiceProviders(action, dispatchMock);

        // then
        expect(dispatchMock).toHaveBeenCalledWith({ type: 'any-event-type' });
      });
    });
  });

  describe('Service providers details edit tests', () => {
    describe('requestServiceProviderEdit when promise is resolved', () => {
      beforeEach(() => {
        jest.mocked(httpClient.get).mockResolvedValueOnce(responseItemMock);
        jest.mocked(serviceProviderEditSuccessed).mockReturnValueOnce(actionEditMock);
        jest
          .mocked(ConfigService.get)
          .mockReturnValueOnce({ endpoints: { serviceProviders: configServiceEndpoint } });
      });

      it('should call ConfigService with parameters', async () => {
        // given
        const actionEdit = {
          payload: { id: '44' },
          type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_REQUESTED,
        };

        // when
        await requestServiceProviderEdit(actionEdit, dispatchMock);

        // then
        expect(ConfigService.get).toHaveBeenCalledWith(ServiceProvidersOptions.CONFIG_NAME);
      });

      it('should call httpClient with parameters', async () => {
        // given
        const actionEdit = {
          payload: { id: '44' },
          type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_REQUESTED,
        };

        // when
        await requestServiceProviderEdit(actionEdit, dispatchMock);

        // then
        expect(httpClient.get).toHaveBeenCalledWith(configServiceEditEndpoint);
      });

      it('should call the dispatch callback function with parameters', async () => {
        // given
        const actionEdit = {
          payload: { id: '44' },
          type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_REQUESTED,
        };

        // when
        await requestServiceProviderEdit(actionEdit, dispatchMock);

        // then
        expect(serviceProviderEditSuccessed).toHaveBeenCalledWith({
          item: dataItemMock.payload,
        });
        expect(dispatchMock).toHaveBeenCalledWith(actionEditMock);
      });
    });

    describe('requestServiceProviderEdit when promise is rejected', () => {
      beforeEach(() => {
        jest.mocked(httpClient.get).mockRejectedValueOnce(new Error(expect.any(String)));
        jest.mocked(serviceProviderEditFailed).mockReturnValueOnce({ type: 'any-event-type' });
      });

      it('should dispatch serviceProviderEditFailed action', async () => {
        // given
        const action = {
          payload: { id: '44' },
          type: ServiceProvidersActionTypes.SERVICE_PROVIDER_UPDATE_FAILED,
        };

        // when
        await requestServiceProviderEdit(action, dispatchMock);

        // then
        expect(dispatchMock).toHaveBeenCalledWith({ type: 'any-event-type' });
      });
    });
  });

  describe('Service providers details view tests', () => {
    describe('requestServiceProviderView when promise is resolved', () => {
      beforeEach(() => {
        jest.mocked(httpClient.get).mockResolvedValueOnce(responseItemMock);
        jest.mocked(serviceProviderViewSuccessed).mockReturnValueOnce(actionViewMock);
        jest
          .mocked(ConfigService.get)
          .mockReturnValueOnce({ endpoints: { serviceProviders: configServiceEndpoint } });
      });

      it('should call ConfigService with parameters', async () => {
        // given
        const actionView = {
          payload: { id: '44' },
          type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_REQUESTED,
        };

        // when
        await requestServiceProviderView(actionView, dispatchMock);

        // then
        expect(ConfigService.get).toHaveBeenCalledWith(ServiceProvidersOptions.CONFIG_NAME);
      });

      it('should call httpClient with parameters', async () => {
        // given
        const actionView = {
          payload: { id: '44' },
          type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_REQUESTED,
        };

        // when
        await requestServiceProviderView(actionView, dispatchMock);

        // then
        expect(httpClient.get).toHaveBeenCalledWith(configServiceViewEndpoint);
      });

      it('should call the dispatch callback function with parameters', async () => {
        // given
        const actionView = {
          payload: { id: '44' },
          type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_REQUESTED,
        };

        // when
        await requestServiceProviderView(actionView, dispatchMock);

        // then
        expect(serviceProviderViewSuccessed).toHaveBeenCalledWith({
          item: dataItemMock.payload,
        });
        expect(dispatchMock).toHaveBeenCalledWith(actionViewMock);
      });
    });

    describe('requestServiceProviderView when promise is rejected', () => {
      beforeEach(() => {
        jest.mocked(httpClient.get).mockRejectedValueOnce(new Error(expect.any(String)));
        jest.mocked(serviceProviderViewFailed).mockReturnValueOnce({ type: 'any-event-type' });
      });

      it('should dispatch serviceProviderViewFailed action', async () => {
        // given
        const action = {
          payload: { id: '44' },
          type: ServiceProvidersActionTypes.SERVICE_PROVIDER_READ_FAILED,
        };

        // when
        await requestServiceProviderView(action, dispatchMock);

        // then
        expect(dispatchMock).toHaveBeenCalledWith({ type: 'any-event-type' });
      });
    });
  });
});
