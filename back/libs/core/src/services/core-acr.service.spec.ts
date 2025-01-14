import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcProviderService } from '@fc/oidc-provider';

import { CoreInvalidAcrException, CoreLowAcrException } from '../exceptions';
import { CoreAcrService } from './core-acr.service';

describe('CoreAcrService', () => {
  let service: CoreAcrService;

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
  };

  const oidcAcrServiceMock = {
    isAcrValid: jest.fn(),
  };

  const oidcProviderServiceMock = {
    abortInteraction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreAcrService,
        LoggerService,
        OidcProviderService,
        OidcAcrService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(OidcAcrService)
      .useValue(oidcAcrServiceMock)
      .compile();

    service = module.get<CoreAcrService>(CoreAcrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkIfAcrIsValid()', () => {
    beforeEach(() => {
      oidcAcrServiceMock.isAcrValid.mockReturnValueOnce(true);
    });

    it('should succeed if acr value is accepted', () => {
      // Given
      const received = 'eidas3';
      const requested = 'eidas3';
      // When
      const call = () => service.checkIfAcrIsValid(received, requested);
      // Then
      expect(call).not.toThrow();
      expect(loggerServiceMock.trace).not.toHaveBeenCalled();
    });

    it('should throw if requested is empty', () => {
      // Given
      const received = 'eidas3';
      const requested = '';
      // When
      const call = () => service['checkIfAcrIsValid'](received, requested);
      // Then
      expect(call).toThrow(CoreInvalidAcrException);
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(0);
    });

    it('should throw if received is empty', () => {
      // Given
      const received = '';
      const requested = 'eidas2';
      // When
      const call = () => service['checkIfAcrIsValid'](received, requested);
      // Then
      expect(call).toThrow(CoreInvalidAcrException);

      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(0);
    });

    it('should throw if requested is undefined', () => {
      // Given
      const received = 'eidas3';
      const requested = undefined;
      // When
      const call = () => service['checkIfAcrIsValid'](received, requested);
      // Then
      expect(call).toThrow(CoreInvalidAcrException);

      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(0);
    });

    it('should throw if received is undefined', () => {
      // Given
      const received = undefined;
      const requested = 'eidas2';
      // When
      const call = () => service['checkIfAcrIsValid'](received, requested);
      // Then
      expect(call).toThrow(CoreInvalidAcrException);

      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(0);
    });

    it('should throw if requested is null', () => {
      // Given
      const received = 'eidas3';
      const requested = null;
      // When
      const call = () => service['checkIfAcrIsValid'](received, requested);
      // Then
      expect(call).toThrow(CoreInvalidAcrException);

      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(0);
    });

    it('should throw if received is null', () => {
      // Given
      const received = null;
      const requested = 'eidas2';
      // When
      const call = () => service['checkIfAcrIsValid'](received, requested);
      // Then
      expect(call).toThrow(CoreInvalidAcrException);

      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(0);
    });

    it('should throw if acr is not valid', () => {
      // Given
      oidcAcrServiceMock.isAcrValid.mockReset().mockReturnValueOnce(false);

      const received = 'eidas1';
      const requested = 'eidas2';
      // When
      const call = () => service['checkIfAcrIsValid'](received, requested);
      // Then
      expect(call).toThrow(CoreLowAcrException);
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
    });
  });

  describe('rejectInvalidAcr()', () => {
    it('should return false if allowedAcrValues contains current acr value', async () => {
      // when
      const result = await service.rejectInvalidAcr(
        'any_eidas_level',
        ['any_eidas_level'],
        { res: {}, req: {} },
      );
      // then
      expect(result).toBeFalsy();
    });

    it('should return true if allowedAcrValues do not contains current acr value', async () => {
      // when
      const result = await service.rejectInvalidAcr(
        'acr_value_not_contained',
        ['any_eidas_level1', 'any_eidas_level2'],
        { res: {}, req: {} },
      );
      // then
      expect(result).toBeTruthy();
    });

    it('should should have called oidcProvider.abortInteraction() with params', async () => {
      const res = Symbol('ctx.res');
      const req = Symbol('ctx.res');
      const currentAcrValue = 'acr_value_not_contained';
      const allowedAcrValues = ['any_eidas_level1', 'any_eidas_level2'].join(
        ',',
      );

      const error = 'invalid_acr';
      const errorDescription = `acr_value is not valid, should be equal one of these values, expected ${allowedAcrValues}, got ${currentAcrValue}`;

      // when
      await service.rejectInvalidAcr(
        'acr_value_not_contained',
        ['any_eidas_level1', 'any_eidas_level2'],
        { res, req },
      );
      // then
      expect(oidcProviderServiceMock.abortInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.abortInteraction).toHaveBeenCalledWith(
        req,
        res,
        error,
        errorDescription,
      );
    });
  });
});
