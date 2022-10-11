import React from 'react';

import { AlertComponent, AlertTypes } from '@fc/dsfr';
import { ServiceProvider, ServiceProviderItemComponent } from '@fc/service-providers';

import { ServiceProviderItem } from '../../interfaces';
import { transformServiceProvider } from '../../services';

export interface ServiceProvidersListComponentProps {
  items: ServiceProvider[];
  totalItems: number;
}

export const ServiceProvidersListComponent = React.memo(
  ({ items, totalItems }: ServiceProvidersListComponentProps) => {
    const showMessageBox = totalItems === 0;

    return (
      <React.Fragment>
        {showMessageBox && (
          <AlertComponent
            dataTestId="ServiceProvidersListComponent-alert"
            type={AlertTypes.WARNING}>
            <p className="fr-alert__title">Vous n&rsquo;avez pas de fournisseur de service</p>
            <p>
              Si vous aviez accès à un fournisseur de service, vos droits ont probablement été
              révoqués.
              <br />
              Rapprochez vous de l&rsquo;administrateur du service afin de les rétablir.
            </p>
          </AlertComponent>
        )}
        {!showMessageBox &&
          items &&
          items
            .map(transformServiceProvider)
            .map((item: ServiceProviderItem) => (
              <ServiceProviderItemComponent
                key={item.id}
                color={item.color}
                createdAt={item.createdAt}
                datapassId={item.datapassId}
                organisationName={item.organisationName}
                platformName={item.platformName}
                spName={item.spName}
                status={item.status}
              />
            ))}
      </React.Fragment>
    );
  },
);

ServiceProvidersListComponent.displayName = 'ServiceProvidersListComponent';