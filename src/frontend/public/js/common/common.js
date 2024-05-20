/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
$("#btn-collapse").click(() => {
  const leffSide = $(".left-container");
  const rightSide = $(".right-container");
  const collapsed = leffSide.attr("class").includes("collapsed");
  if (collapsed) {
    leffSide.removeClass("collapsed");
    rightSide.removeClass("collapsed");
  } else {
    leffSide.addClass("collapsed");
    rightSide.addClass("collapsed");
  }
});

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.parseDate = function (input, ajustHour) {
  const years = this.getFullYear();
  const months =
    this.getMonth() + 1 < 10
      ? "0" + (this.getMonth() + 1)
      : this.getMonth() + 1;
  const days = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
  const h = this.getHours() + (ajustHour ? 1 : 0);
  const hours = h < 10 ? "0" + h : h;
  const minutes =
    this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
  const seconds =
    this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
  if (input) return years + "-" + months + "-" + days;
  return `${days}/${months}/${years} ${hours}:${minutes}:${seconds}`;
};

Date.prototype.differenceParsed = function (date) {
  let diffInMilliSeconds = Math.abs(this - date) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = "";
  if (days > 0) difference += days === 1 ? `${days} d ` : `${days} d `;

  difference += hours === 0 || hours === 1 ? `${hours} h ` : `${hours} h `;

  difference += minutes === 0 || hours === 1 ? `${minutes} m` : `${minutes} m`;

  return difference;
};

/* Search field */

export const searchFieldData = {
  methods: {
    searchFieldSelectItem: function (item, type) {
      this.handleSearchSelection(item, type);
    },
    searchFieldFocus: function (evt, type) {
      this.searchFieldShowList(type);
    },
    searchFieldBlur: function (evt, type) {
      this.searchFieldHideList(type);
      const text = evt.target.value;
      if (text == "") this.handleSearchSelection(null, type);
    },
    searchFieldKeyUp: function (evt, type) {
      if (!this.searchFieldIsShowed(type)) this.searchFieldShowList(type);
    },
  },
};
