import { getHighlightClassName } from '../function';

import {
  TOP, LEFT, X, Y,
} from '../constant';

const BASE_CLASSNAME = 'graph-subdomain-group';

export default class subDomainPainter {
  constructor(calendar) {
    this.calendar = calendar;
    this.root = null;
  }

  paint(root) {
    const { options } = this.calendar.options;
    this.root = root || this.root;

    const subDomainSvgGroup = this.root
      .selectAll(`.${BASE_CLASSNAME}`)
      .data(
        (d) => [d],
        (d) => d,
      )
      .join(
        (enter) => enter
          .append('svg')
          .attr('x', () => {
            let pos = options.domainMargin[LEFT];
            if (options.label.position === 'left') {
              pos += options.x.domainHorizontalLabelWidth;
            }
            return pos;
          })
          .attr('y', () => {
            let pos = options.domainMargin[TOP];
            if (options.label.position === 'top') {
              pos += options.x.domainVerticalLabelHeight;
            }
            return pos;
          })
          .attr('class', BASE_CLASSNAME),

        (update) => update
          .attr('x', () => {
            let pos = options.domainMargin[LEFT];
            if (options.label.position === 'left') {
              pos += options.x.domainHorizontalLabelWidth;
            }
            return pos;
          })
          .attr('y', () => {
            let pos = options.domainMargin[TOP];
            if (options.label.position === 'top') {
              pos += options.x.domainVerticalLabelHeight;
            }
            return pos;
          }),
      );

    const { eventEmitter } = this.calendar;

    const rect = subDomainSvgGroup
      .selectAll('g')
      .data((d) => this.calendar.domainCollection.get(d))
      .enter()
      .append('g');

    rect
      .append('rect')
      .attr('class', (d) => this.#getClassName(d))
      .attr('width', options.cellSize[X])
      .attr('height', options.cellSize[Y])
      .attr('x', (d) => this.#getX(d))
      .attr('y', (d) => this.#getY(d))
      .on('click', (ev, d) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        eventEmitter.emit('onClick', ev, new Date(d.t), d.v))
      .on('mouseover', (ev, d) => {
        if (options.tooltip) {
          this.calendar.calendarPainter.tooltip.show(ev.target);
        }
        return eventEmitter.emit('onMouseOver', ev, new Date(d.t), d.v);
      })
      .on('mouseout', (ev, d) => {
        if (options.tooltip) {
          this.calendar.calendarPainter.tooltip.hide();
        }

        return eventEmitter.emit('onMouseOut', ev, new Date(d.t), d.v);
      })
      .call((selection) => {
        if (options.cellRadius > 0) {
          selection
            .attr('rx', options.cellRadius)
            .attr('ry', options.cellRadius);
        }
      });

    this.#appendText(rect);
  }

  #getClassName(d) {
    const { options } = this.calendar.options;

    return `graph-rect${getHighlightClassName(
      this.calendar,
      d.t,
      options,
    )}${' hover_cursor'}`;
  }

  #appendText(elem) {
    const { options } = this.calendar.options;
    const formatter = options.formatter.subDomainLabel;

    if (!formatter) {
      return null;
    }

    return elem
      .append('text')
      .attr(
        'class',
        (d) => 'subdomain-text' +
          `${getHighlightClassName(this.calendar, d.t, options)}`,
      )
      .attr('x', (d) => this.#getX(d) + options.cellSize[X] / 2)
      .attr('y', (d) => this.#getY(d) + options.cellSize[Y] / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d, i, nodes) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        this.calendar.helpers.DateHelper.format(d.t, formatter, d.v, nodes[i]));
  }

  #getCoordinates(axis, d) {
    const { cellSize, cellPadding } = this.calendar.options.options;
    return d[axis] * (cellSize[axis === 'x' ? X : Y] + cellPadding);
  }

  #getX(d) {
    return this.#getCoordinates('x', d);
  }

  #getY(d) {
    return this.#getCoordinates('y', d);
  }
}
