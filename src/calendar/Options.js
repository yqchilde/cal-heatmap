import { select } from 'd3-selection';
import { merge } from 'lodash-es';
import moment from 'moment-timezone';

import { validateSelector, validateDomainType } from '../utils/validator';
import { TOP, RIGHT, BOTTOM, LEFT } from '../constant';
import { expandMarginSetting } from '../function';

const ALLOWED_DATA_TYPES = ['json', 'csv', 'tsv', 'txt'];
const DEFAULT_LEGEND_MARGIN = 10;

/**
 * Convert a string to an array like [singular-form, plural-form]
 *
 * @param  {string|array} value Date to convert
 * @return {array}       An array like [singular-form, plural-form]
 */
function expandItemName(value) {
  if (typeof value === 'string') {
    return [value, value + (value !== '' ? 's' : '')];
  }

  if (Array.isArray(value)) {
    if (value.length === 1) {
      return [value[0], `${value[0]}s`];
    }
    if (value.length > 2) {
      return value.slice(0, 2);
    }

    return value;
  }

  return ['item', 'items'];
}

/**
 * Return the optimal subDomain for the specified domain
 *
 * @param  {string} domain a domain name
 * @return {string}        the subDomain name
 */
function getOptimalSubDomain(domain) {
  switch (domain) {
    case 'year':
      return 'month';
    case 'month':
      return 'day';
    case 'week':
      return 'day';
    case 'day':
      return 'hour';
    default:
      return 'minute';
  }
}

export default class Options {
  constructor(calendar) {
    this.calendar = calendar;

    this.options = {
      // selector string of the container to append the graph to
      // Accept any string value accepted by document.querySelector or CSS3
      // or an Element object
      itemSelector: '#cal-heatmap',

      // Whether to paint the calendar on init()
      // Used by testsuite to reduce testing time
      paintOnLoad: true,

      // ================================================
      // DOMAIN
      // ================================================

      // Number of domain to display on the graph
      range: 12,

      // Size of each cell, in pixel
      cellSize: 10,

      // Padding between each cell, in pixel
      cellPadding: 2,

      // For rounded subdomain rectangles, in pixels
      cellRadius: 0,

      domainGutter: 2,

      domainMargin: [0, 0, 0, 0],

      domain: 'hour',

      subDomain: 'minute',

      domainTemplates: null,

      // Number of columns to split the subDomains to
      // If not null, will takes precedence over rowLimit
      colLimit: null,

      // Number of rows to split the subDomains to
      // Will be ignored if colLimit is not null
      rowLimit: null,

      // First day of the week is Monday
      // 0 to start the week on Sunday
      weekStartOnMonday: true,

      // Show week name when showing full month
      dayLabel: false,

      // Start date of the graph
      // @default now
      start: new Date(),

      minDate: null,

      maxDate: null,

      // ================================================
      // DATA
      // ================================================

      // Data source
      // URL, where to fetch the original datas
      data: '',

      // Data type
      // Default: json
      dataType: ALLOWED_DATA_TYPES[0],

      // Payload sent when using POST http method
      // Leave to null (default) for GET request
      // Expect a string, formatted like "a=b;c=d"
      dataPostPayload: null,

      // Additional headers sent when requesting data
      // Expect an object formatted like:
      // { 'X-CSRF-TOKEN': 'token' }
      dataRequestHeaders: null,

      // Whether to consider missing date:value from the datasource
      // as equal to 0, or just leave them as missing
      considerMissingDataAsZero: false,

      // Load remote data on calendar creation
      // When false, the calendar will be left empty
      loadOnInit: true,

      // Timezone of the calendar
      // When null, will default to browser local timezone
      timezone: null,

      // Calendar orientation
      // false: display domains side by side
      // true : display domains one under the other
      verticalOrientation: false,

      // Domain dynamic width/height
      // The width on a domain depends on the number of
      domainDynamicDimension: true,

      // Domain Label properties
      label: {
        // valid: top, right, bottom, left
        position: 'bottom',

        // Valid: left, center, right
        // Also valid are the direct svg values: start, middle, end
        align: 'center',

        // By default, there is no margin/padding around the label
        offset: {
          x: 0,
          y: 0,
        },

        rotate: null,

        // Used only on vertical orientation
        width: 100,

        // Used only on horizontal orientation
        height: null,
      },

      // ================================================
      // LEGEND
      // ================================================

      // Threshold for the legend
      legend: [10, 20, 30, 40],

      // Whether to display the legend
      displayLegend: true,

      legendCellSize: 10,

      legendCellPadding: 2,

      legendMargin: [0, 0, 0, 0],

      // Legend vertical position
      // top: place legend above calendar
      // bottom: place legend below the calendar
      legendVerticalPosition: 'bottom',

      // Legend horizontal position
      // accepted values: left, center, right
      legendHorizontalPosition: 'left',

      // Legend rotation
      // accepted values: horizontal, vertical
      legendOrientation: 'horizontal',

      // Objects holding all the heatmap different colors
      // null to disable, and use the default css styles
      //
      // Examples:
      // legendColors: {
      //    min: "green",
      //    max: "red",
      //    empty: "#ffffff",
      //    base: "grey",
      //    overflow: "red"
      // }
      legendColors: null,

      // ================================================
      // HIGHLIGHT
      // ================================================

      // List of dates to highlight
      // Valid values:
      // - []: don't highlight anything
      // - "now": highlight the current date
      // - an array of Date objects: highlight the specified dates
      highlight: [],

      // ================================================
      // TEXT FORMATTING / i18n
      // ================================================

      // Name of the items to represent in the calendar
      itemName: ['item', 'items'],

      // Formatting of the domain label
      // @default: null, will use the formatting according to domain type
      // Accept a string used as specifier by timeFormat()
      // or a function
      //
      // Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
      // for accepted date formatting used by timeFormat()
      domainLabelFormat: null,

      // Formatting of the title displayed when hovering a subDomain cell
      subDomainTitleFormat: {
        empty: '{date}',
        filled: '{count} {name} {connector} {date}',
      },

      // Formatting of the {date} used in subDomainTitleFormat
      // @default: null, will use the formatting according to subDomain type
      // Accept a string used as specifier by timeFormat()
      // or a function
      //
      // Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
      // for accepted date formatting used by timeFormat()
      subDomainDateFormat: null,

      // Formatting of the text inside each subDomain cell
      // @default: null, no text
      // Accept a string used as specifier by timeFormat()
      // or a function
      //
      // Refer to https://github.com/mbostock/d3/wiki/Time-Formatting
      // for accepted date formatting used by timeFormat()
      subDomainTextFormat: null,

      // Formatting of the title displayed when hovering a legend cell
      legendTitleFormat: {
        lower: 'less than {min} {name}',
        inner: 'between {down} and {up} {name}',
        upper: 'more than {max} {name}',
      },

      // Animation duration, in ms
      animationDuration: 500,

      nextSelector: false,

      previousSelector: false,

      itemNamespace: 'cal-heatmap',

      tooltip: false,

      // ================================================
      // EVENTS CALLBACK
      // ================================================

      // Callback when clicking on a time block
      onClick: null,

      // Callback when hovering on a time block
      onMouseOver: null,

      // Callback when hovering on a time block
      onMouseOut: null,

      // Callback after painting the empty calendar
      // Can be used to trigger an API call, once the calendar is ready to be filled
      afterLoad: null,

      // Callback after loading the next domain in the calendar
      afterLoadNextDomain: null,

      // Callback after loading the previous domain in the calendar
      afterLoadPreviousDomain: null,

      // Callback after finishing all actions on the calendar
      onComplete: null,

      onResize: null,

      // Callback after fetching the datas, but before applying them to the calendar
      // Used mainly to convert the datas if they're not formatted like expected
      // Takes the fetched "data" object as argument, must return a json object
      // formatted like {timestamp:count, timestamp2:count2},
      afterLoadData: (data) => data,

      // Callback triggered after calling and completing update().
      afterUpdate: null,

      // Callback triggered after calling next().
      // The `status` argument is equal to true if there is no
      // more next domain to load
      //
      // This callback is also executed once, after calling previous(),
      // only when the max domain is reached
      onMaxDomainReached: null,

      // Callback triggered after calling previous().
      // The `status` argument is equal to true if there is no
      // more previous domain to load
      //
      // This callback is also executed once, after calling next(),
      // only when the min domain is reached
      onMinDomainReached: null,

      // Callback when hovering over a time block
      onTooltip: (title) => title,
    };
  }

  set(key, value) {
    if (!this.options.hasOwnProperty(key) || this.options[key] === value) {
      return false;
    }

    this.options[key] = value;

    return true;
  }

  #validate() {
    const { options } = this;

    // Fatal errors
    // Stop script execution on error
    validateDomainType(this.calendar.domainTemplate, this.options);
    validateSelector(options.itemSelector, false, 'itemSelector');

    if (!ALLOWED_DATA_TYPES.includes(options.dataType)) {
      throw new Error(
        `The data type '${options.dataType}' is not valid data type`,
      );
    }

    if (select(options.itemSelector).empty()) {
      throw new Error(
        `The node '${options.itemSelector}' specified in itemSelector does not exist`,
      );
    }

    try {
      validateSelector(options.nextSelector, true, 'nextSelector');
      validateSelector(options.previousSelector, true, 'previousSelector');
    } catch (error) {
      console.log(error.message);
      return false;
    }

    // If other settings contains error, will fallback to default

    if (!options.hasOwnProperty('subDomain')) {
      options.subDomain = getOptimalSubDomain(options.domain);
    }

    if (
      typeof options.itemNamespace !== 'string' ||
      options.itemNamespace === ''
    ) {
      console.log(
        'itemNamespace can not be empty, falling back to cal-heatmap',
      );
      options.itemNamespace = 'cal-heatmap';
    }

    return true;
  }

  #parseRowLimit(value) {
    if (value > 0 && this.options.colLimit > 0) {
      console.log(
        'colLimit and rowLimit are mutually exclusive, rowLimit will be ignored',
      );
      return null;
    }
    return value > 0 ? value : null;
  }

  /**
   * Fine-tune the label alignement depending on its position
   *
   * @return void
   */
  #autoAlignLabel() {
    // Auto-align label, depending on it's position
    if (
      !this.options.hasOwnProperty('label') ||
      (this.options.hasOwnProperty('label') &&
        !this.options.label.hasOwnProperty('align'))
    ) {
      switch (this.options.label.position) {
        case 'left':
          this.options.label.align = 'right';
          break;
        case 'right':
          this.options.label.align = 'left';
          break;
        default:
          this.options.label.align = 'center';
      }

      if (this.options.label.rotate === 'left') {
        this.options.label.align = 'right';
      } else if (this.options.label.rotate === 'right') {
        this.options.label.align = 'left';
      }
    }

    if (
      !this.options.hasOwnProperty('label') ||
      (this.options.hasOwnProperty('label') &&
        !this.options.label.hasOwnProperty('offset'))
    ) {
      if (
        this.options.label.position === 'left' ||
        this.options.label.position === 'right'
      ) {
        this.options.label.offset = {
          x: 10,
          y: 15,
        };
      }
    }
  }

  init(settings) {
    this.options = merge(this.options, settings);

    const { options } = this;

    this.calendar.domainTemplate.init(options.domainTemplates);
    this.#validate();

    options.subDomainDateFormat =
      typeof options.subDomainDateFormat === 'string' ||
      typeof options.subDomainDateFormat === 'function'
        ? options.subDomainDateFormat
        : this.calendar.domainTemplate.at(options.subDomain).format.date;
    options.domainLabelFormat =
      typeof options.domainLabelFormat === 'string' ||
      typeof options.domainLabelFormat === 'function'
        ? options.domainLabelFormat
        : this.calendar.domainTemplate.at(options.domain).format.legend;
    options.subDomainTextFormat =
      (typeof options.subDomainTextFormat === 'string' &&
        options.subDomainTextFormat !== '') ||
      typeof options.subDomainTextFormat === 'function'
        ? options.subDomainTextFormat
        : null;
    options.domainMargin = expandMarginSetting(options.domainMargin);
    options.legendMargin = expandMarginSetting(options.legendMargin);
    options.itemName = expandItemName(options.itemName);
    options.colLimit = options.colLimit > 0 ? options.colLimit : null;
    options.rowLimit = this.#parseRowLimit(options.rowLimit);

    this.#autoAlignLabel();

    options.verticalDomainLabel =
      options.label.position === 'top' || options.label.position === 'bottom';

    options.domainVerticalLabelHeight =
      options.label.height ?? Math.max(25, options.cellSize * 2);
    options.domainHorizontalLabelWidth = 0;

    if (options.domainLabelFormat === '' && options.label.height === null) {
      options.domainVerticalLabelHeight = 0;
    }

    if (!options.verticalDomainLabel) {
      options.domainVerticalLabelHeight = 0;
      options.domainHorizontalLabelWidth = options.label.width;
    }

    this.set('timezone', options.timezone ?? moment.tz.guess());
    moment.tz.setDefault(options.timezone);

    if (options.legendMargin === [0, 0, 0, 0]) {
      switch (options.legendVerticalPosition) {
        case 'top':
          options.legendMargin[BOTTOM] = DEFAULT_LEGEND_MARGIN;
          break;
        case 'bottom':
          options.legendMargin[TOP] = DEFAULT_LEGEND_MARGIN;
          break;
        case 'middle':
        case 'center':
          options.legendMargin[
            options.legendHorizontalPosition === 'right' ? LEFT : RIGHT
          ] = DEFAULT_LEGEND_MARGIN;
          break;
        default:
      }
    }
  }
}