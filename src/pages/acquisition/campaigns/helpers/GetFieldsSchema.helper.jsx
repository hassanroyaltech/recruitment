import * as yup from 'yup';
import { DynamicFormTypesEnum } from '../../../../enums';
import { emailExpression, urlExpression } from '../../../../utils';

export const GetFieldsSchemaHelper = (
  fields,
  t,
  translationPath = 'ReviewDynamicForm.',
) => {
  const shape = {};
  Object.entries(fields).forEach(([key, fieldVal]) => {
    if (fieldVal.isActive)
      shape[key] = yup.object().shape({
        validation: yup.string(),
        current_value: (() => {
          let localeSchema = yup;
          const localEnumType = Object.values(DynamicFormTypesEnum).find(
            (item) => item.key === fieldVal.type,
          );
          if (!localEnumType) return localeSchema.string().nullable();
          if (localEnumType.schemaType === 'string')
            localeSchema = localeSchema.string().matches(
              (fieldVal?.regex?.length > 0
                && fieldVal.regex.map((reg) => {
                  let localeRegEx = reg;
                  if (localeRegEx.startsWith('/'))
                    localeRegEx = localeRegEx.slice(1);
                  if (localeRegEx.endsWith('/'))
                    localeRegEx = localeRegEx.slice(0, -1);
                  return localeRegEx;
                }))
                || [],
              {
                message: `${t(`${translationPath}please-insert`)} "${
                  fieldVal.title
                }" RegExp: ${(fieldVal.regex || []).join(',')}`,
                excludeEmptyString: true,
              },
            );
          if (localEnumType.schemaType === 'number') {
            localeSchema = localeSchema.number();
            if (fieldVal.less_than && fieldVal.affectedByField) {
              const affectedItem = fieldVal.affectedByField;
              localeSchema = localeSchema.test(
                'value-greater-than',
                `${t(`${translationPath}please-insert-a-value-greater-than`)} "${
                  affectedItem.title || null
                }"`,
                () => affectedItem.current_value < fieldVal.current_value,
              );
            }
          }
          if (localEnumType.schemaType === 'array')
            localeSchema = localeSchema.array().nullable();
          if (fieldVal.origin_vonq_type === 'AUTOCOMPLETE')
            localeSchema = yup.object().nullable();
          if (fieldVal.type === DynamicFormTypesEnum.email.key)
            localeSchema = yup
              .string()
              .nullable()
              .matches(emailExpression, {
                message: t('Shared:invalid-email'),
                excludeEmptyString: true,
              });
          if (fieldVal.type === DynamicFormTypesEnum.url.key)
            localeSchema = yup
              .string()
              .nullable()
              .matches(urlExpression, {
                message: t('Shared:invalid-url'),
                excludeEmptyString: true,
              });

          if (fieldVal.validation === 'required')
            localeSchema = localeSchema.required(t('Shared:this-field-is-required'));

          return localeSchema.nullable();
        })(),
      });
  });

  return yup.object().shape(shape);
};
