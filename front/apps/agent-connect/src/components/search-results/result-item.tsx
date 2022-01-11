import './result-item.scss';

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { chosenIdentityProvider } from '../../redux/actions';
import { selectIdentityProviderInputs } from '../../redux/selectors';
import { IdentityProvider, RootState } from '../../types';

type SearchResultsProps = {
  identityProvider: IdentityProvider;
};

export const ResultItemComponent = React.memo(
  ({ identityProvider }: SearchResultsProps): JSX.Element => {
    const { name, uid } = identityProvider;

    const redirectToIdentityProviderInputs = useSelector((state: RootState) =>
      selectIdentityProviderInputs(state, uid),
    );

    const dispatch = useDispatch();
    const buttonClickHandler = useCallback(() => {
      const action = chosenIdentityProvider(uid);
      dispatch(action);
    }, [uid, dispatch]);

    return (
      <RedirectToIdpFormComponent id={`fca-search-idp-${uid}`}>
        {redirectToIdentityProviderInputs.map(([inputKey, inputValue]) => (
          <input key={inputKey} defaultValue={inputValue} name={inputKey} type="hidden" />
        ))}
        <button
          className="button-style fr-text-lg text-left"
          id={`idp-${uid}-button`}
          type="submit"
          onClick={buttonClickHandler}>
          {name}
        </button>
      </RedirectToIdpFormComponent>
    );
  },
);

ResultItemComponent.displayName = 'ResultItemComponent';
