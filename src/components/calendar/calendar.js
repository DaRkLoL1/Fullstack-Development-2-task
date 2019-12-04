import 'air-datepicker';

export default class Calendar {
  constructor(datepicker, index) {
    this.$datepicker = $(datepicker);
    this.index = index;
    this.createDatepicker();
    this.addButtons();
  }

  createDatepicker() {
    this.defaultParameters = {
      range: true,
      offset: 16,
      prevHtml: '<i class="material-icons">arrow_back</i>',
      nextHtml: '<i class="material-icons">arrow_forward</i>',
      navTitles: {
        days: 'MM yyyy',
      },
    };

    if (this.$datepicker.hasClass('js-calendar_type_dropdown')) {
      this.createDropdownDatepicker();
    } else if (this.$datepicker.hasClass('js-calendar_type_filter')) {
      this.createFilterDatepicker();
    } else {
      this.createInlineDatepicker();
    }

    this.setDate();
  }

  createDropdownDatepicker() {
    const $left = this.$datepicker.find('.js-calendar__left-input .js-text-field');
    const $right = this.$datepicker.find('.js-calendar__right-input .js-text-field');

    const dropdownParameters = {
      ...this.defaultParameters,
      altField: $right,
      altFieldDateFormat: '',
      onSelect(formattedDate) {
        const arrDates = formattedDate.split(',');

        if (arrDates.length === 1) {
          $left.val(arrDates[0]);
          $right.val('');
        } else {
          $left.val(arrDates[0]);
          $right.val(arrDates[1]);
        }
      },
    };

    this.calendar = $left.datepicker(dropdownParameters).data('datepicker');

    this.setMethodShow();
  }

  createFilterDatepicker() {
    const $textField = this.$datepicker.find('.js-text-field');

    const FilterParameters = {
      ...this.defaultParameters,
      multipleDatesSeparator: ' - ',
      dateFormat: 'dd M',
    };

    this.calendar = $textField.datepicker(FilterParameters).data('datepicker');
    this.calendar.$datepicker.addClass('datepicker_width_small');

    this.setMethodShow();
  }

  createInlineDatepicker() {
    this.calendar = this.$datepicker.datepicker(this.defaultParameters).data('datepicker');
  }

  setDate() {
    const dates = this.$datepicker.data('dates');

    if (dates.length) {
      if (dates.length === 1) {
        this.calendar.selectDate(new Date(dates[0]));
      } else {
        this.calendar.selectDate([new Date(dates[0]), new Date(dates[1])]);
      }
    }
  }

  setMethodShow() {
    if (this.$datepicker.hasClass('js-calendar_type_dropdown')) {
      this.$datepicker.find('.js-calendar__input').on(`click.input${this.index}`, this.handleShowCalendarClick.bind(this));
    } else {
      this.$datepicker.on(`click.calendar${this.index}`, this.handleShowCalendarClick.bind(this));
    }
  }

  handleShowCalendarClick() {
    this.calendar.show();
  }

  addButtons() {
    const $buttons = this.$datepicker.find('.js-calendar__buttons');
    const $clear = this.$datepicker.find('.js-calendar__clear-button');
    const $apply = this.$datepicker.find('.js-calendar__apply-button');

    this.addHandleButtons($clear, $apply);

    this.calendar.$datepicker.append($buttons);
  }

  addHandleButtons($clear, $apply) {
    $clear.on(`click.clearButton${this.index}`, this.handleButtonClearClick.bind(this));

    $apply.on(`click.applyButton${this.index}`, this.handleButtonApplyClick.bind(this));
  }

  handleButtonClearClick() {
    this.calendar.clear();
  }

  handleButtonApplyClick() {
    this.calendar.hide();
  }
}
