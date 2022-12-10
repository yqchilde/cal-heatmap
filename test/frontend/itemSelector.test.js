import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('itemSelector', () => {
  let cal = null;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    cal = null;
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('renders the calendar inside the default itemSelector', () => {
    cal.init();
    expect(
      select('#cal-heatmap').select('.cal-heatmap-container').node(),
    ).not.toBeNull();
  });

  it('renders nothing when the itemSelector is not valid', () => {
    const html = select('body').html();

    ['.not-existing', null, false].forEach((selector) => {
      cal.init({ itemSelector: selector });
      expect(select('body').html()).toBe(html);
    });
  });

  it('renders the calendar inside the given itemSelector', () => {
    select('body').append('div').attr('class', 'test-selector');
    cal.init({ itemSelector: '.test-selector' });

    expect(select('#cal-heatmap').select('#cal-heatmap').node()).toBeNull();
    expect(
      select('.test-selector').select('.cal-heatmap-container').node(),
    ).not.toBeNull();
  });
});