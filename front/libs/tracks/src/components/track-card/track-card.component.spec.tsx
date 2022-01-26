import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';

import { EidasToLabel } from '../../enums';
import { TrackCardBadgeComponent } from './card-badge.component';
import { TrackCardContentComponent } from './card-content.component';
import { TrackCardHeaderComponent } from './card-header.component';
import { TrackCardComponent } from './track-card.component';

jest.mock('./card-badge.component');
jest.mock('./card-content.component');
jest.mock('./card-header.component');

describe('TrackCardComponent', () => {
  const options = {
    API_ROUTE_TRACKS: 'mock_API_ROUTE_TRACKS',
    API_ROUTE_USER_INFOS: 'mock_API_ROUTE_USER_INFOS',
    LUXON_FORMAT_DAY: 'DDD',
    LUXON_FORMAT_HOUR_MINS: 'T',
    LUXON_FORMAT_MONTH_YEAR: 'LLLL yyyy',
    LUXON_FORMAT_TIMEZONE: 'z',
  };
  const track = {
    accountId: 'mock-account-id',
    city: 'mock-city',
    country: 'mock-country',
    date: '2021-10-01T00:00:00.000+01:00',
    datetime: DateTime.fromObject({ day: 1, month: 10, year: 2021 }, { zone: 'Europe/Paris' }),
    datetimeId: 'mock-datetimeid',
    event: 'mock-event',
    spAcr: 'eidas1' as keyof typeof EidasToLabel,
    spId: 'mock-spid',
    spName: 'mock-spname',
    trackId: 'mock-track-id',
  };

  describe('Initial component render', () => {
    it('should render an accessible button element at container top level', () => {
      // given
      const { getByTestId } = render(<TrackCardComponent options={options} track={track} />);
      // when
      const element = getByTestId(track.trackId);
      // then
      expect(element).toBeInTheDocument();
      expect(element.tagName).toStrictEqual('BUTTON');
      expect(element.getAttribute('type')).toStrictEqual('button');
      expect(element.getAttribute('aria-expanded')).toStrictEqual('false');
      expect(element.getAttribute('aria-controls')).toStrictEqual(`card::a11y::${track.trackId}`);
    });

    it('should have called card badge component', () => {
      // then
      expect(TrackCardBadgeComponent).toHaveBeenCalled();
      expect(TrackCardBadgeComponent).toHaveBeenCalledWith(
        { fromFcPlus: true, type: track.event },
        {},
      );
    });

    it('should have called card header component', () => {
      // then
      expect(TrackCardHeaderComponent).toHaveBeenCalled();
      expect(TrackCardHeaderComponent).toHaveBeenCalledWith(
        {
          datetime: track.datetime,
          identityProviderName: track.spName,
          opened: false,
          options,
        },
        {},
      );
    });

    it('should have called card content component', () => {
      // then
      expect(TrackCardContentComponent).toHaveBeenCalled();
      expect(TrackCardContentComponent).toHaveBeenCalledWith(
        {
          accessibleId: `card::a11y::${track.trackId}`,
          accountId: track.accountId,
          datetime: track.datetime,
          opened: false,
          options,
          spAcr: track.spAcr,
        },
        {},
      );
    });
  });

  it('When user click the button, should toggle the card content (expand)', () => {
    // given
    const { getByTestId } = render(<TrackCardComponent options={options} track={track} />);
    // when
    const element = getByTestId(track.trackId);
    // then
    userEvent.click(element);
    expect(element.getAttribute('aria-expanded')).toStrictEqual('true');
    expect(TrackCardHeaderComponent).toHaveBeenCalled();
    expect(TrackCardHeaderComponent).toHaveBeenCalledWith(
      expect.objectContaining({ opened: true }),
      {},
    );
    expect(TrackCardContentComponent).toHaveBeenCalled();
    expect(TrackCardContentComponent).toHaveBeenCalledWith(
      expect.objectContaining({ opened: true }),
      {},
    );
    // then
    userEvent.click(element);
    expect(element.getAttribute('aria-expanded')).toStrictEqual('false');
    expect(TrackCardHeaderComponent).toHaveBeenCalled();
    expect(TrackCardHeaderComponent).toHaveBeenCalledWith(
      expect.objectContaining({ opened: false }),
      {},
    );
    expect(TrackCardContentComponent).toHaveBeenCalled();
    expect(TrackCardContentComponent).toHaveBeenCalledWith(
      expect.objectContaining({ opened: false }),
      {},
    );
  });
});