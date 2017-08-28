'use strict';

/**
 * wraps angular's currency filter with an additional layer, in case the currency symbol is not available.
 */
angular.module('isoCurrency', ['isoCurrency.common'])
  .filter('isoCurrency', ['$filter', 'iso4217', function($filter, iso4217) {
    /**
     * transforms an amount into the right format and currency according to a passed currency code (3 chars).
     *
     * @param float amount
     * @param string currencyCode e.g. EUR, USD
     * @param number fraction User specified fraction size that overwrites default value
     * @return string
     */
    return function(amount, currencyCode, fraction) {
      if (!currencyCode) {
        return amount;
      }
      var currency = iso4217.getCurrencyByCode(currencyCode);
      if (!currency) {
        return amount;
      }

      if (typeof currency === "function") return currency(amount);

      var fractionSize = (fraction === void 0) ? currency.fraction : fraction;
      var currencyFilter = $filter('currency');

      /*
         Based on the feedback from multiple users, the parenthesis construct wasn't as commonly understood
         as the minus symbol.
         */
      if(amount < 0){
        return currencyFilter(amount, currency.symbol || (currencyCode + ' '), fractionSize).replace("(", "-").replace(")", "");
      }
      return currencyFilter(amount, currency.symbol || (currencyCode + ' '), fractionSize);
    };
  }]);
