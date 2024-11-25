const rulesOperations = {
  equal: (ruleVal, effectedFieldVal) => ruleVal === effectedFieldVal,
  contains: (ruleVal, effectedFieldVal) =>
    (effectedFieldVal || []).includes(ruleVal),
  notempty: (ruleVal, effectedFieldVal) => !!effectedFieldVal,
  selected_option_show_contains: (ruleVal, effectedFieldVal) => !!effectedFieldVal,
  in: (ruleVal, effectedFieldVal) => (ruleVal || []).includes(effectedFieldVal),
};

export const GetIsFieldDisplayedHelper = (fields, field) => {
  let isFieldDisplayed = true;
  if (field.display_rules && field.display_rules?.show?.length > 0) {
    const rules = field.display_rules?.show || [];
    rules.forEach((rule) => {
      const effectedFiled = fields.find((item) => rule.facet === item.index);
      if (effectedFiled && isFieldDisplayed)
        isFieldDisplayed = rulesOperations[rule.op](
          rule.value,
          effectedFiled.current_value,
        );
    });
  }

  return isFieldDisplayed;
};
