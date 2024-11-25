import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CheckboxesComponent } from '../../../../../components';
import './Properties.Style.scss';

export const PropertiesComponent = memo(
  ({
    properties,
    parentIndex,
    columns,
    getIsDisabled,
    isWithHeader,
    propertiesTitle,
    parentId,
    subParentId,
    onStateChanged,
    parentTranslationPath,
    isWithCheckAll,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    /**
     * @param key
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to get all checked items of properties - permissions
     */
    const getIsChecked = useMemo(
      () => (key) => properties.filter((item) => item[key]),
      [properties],
    );

    return (
      <div className="properties-items-wrapper">
        {isWithHeader && (
          <div className="properties-header-wrapper">
            <div className="properties-item-wrapper">
              {(parentTranslationPath && t(propertiesTitle)) || propertiesTitle}
            </div>
            {columns
              && columns.map((item, index) => (
                <div
                  key={`headerColumnsKey${parentIndex || 0}-${index + 1}`}
                  className="properties-item-wrapper"
                >
                  <span className={`${(!isWithCheckAll && 'mb-2') || ''}`}>
                    {(parentTranslationPath && t(item.title)) || item.title}
                  </span>
                  {isWithCheckAll && (
                    <span className="properties-check-all-wrapper">
                      <CheckboxesComponent
                        idRef={`checkAll${item.input}-${index + 1}`}
                        singleChecked={
                          properties
                          && getIsChecked(item.input).length === properties.length
                          && getIsChecked(item.input).length > 0
                        }
                        singleIndeterminate={
                          properties
                          && getIsChecked(item.input).length !== properties.length
                          && getIsChecked(item.input).length > 0
                        }
                        // label="create"
                        parentTranslationPath={parentTranslationPath}
                        onSelectedCheckboxClicked={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          let localProperties = [...(properties || [])];
                          if (
                            localProperties
                            && getIsChecked(item.input).length
                              === localProperties.length
                            && getIsChecked(item.input).length > 0
                          )
                            localProperties = localProperties.map((items) => ({
                              ...items,
                              [item.input]: false,
                            }));
                          else
                            localProperties = localProperties.map((items) => ({
                              ...items,
                              [item.input]: true,
                            }));
                          onStateChanged({
                            parentId: (subParentId && parentId) || undefined,
                            subParentId,
                            parentIndex:
                              parentIndex || parentIndex === 0
                                ? parentIndex
                                : undefined,
                            subParentIndex: undefined,
                            id: subParentId || parentId,
                            value: localProperties,
                          });
                        }}
                      />
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}
        {properties.map((element, index, items) => (
          <React.Fragment key={`propertiesKey${parentIndex || 0}-${index + 1}`}>
            <div
              className={`properties-item-wrapper${
                (isWithHeader && ' is-with-header') || ''
              }`}
            >
              <div className="properties-checkboxes-wrapper">
                <div className="properties-checkbox-item-wrapper">
                  <span className="title-wrapper">{element.title}</span>
                </div>
                {columns
                  && columns.map((column, columnIndex) => (
                    <div
                      key={`columnKey-${columnIndex + 1}-${parentIndex || 0}-${
                        index + 1
                      }`}
                      className="properties-checkbox-item-wrapper"
                    >
                      <CheckboxesComponent
                        idRef={`checkboxRef${columnIndex + 1}-${parentIndex || 0}-${
                          index + 1
                        }`}
                        isDisabled={
                          (getIsDisabled && getIsDisabled(element, index))
                          || (column.getIsDisabled
                            && column.getIsDisabled(element, index))
                          || (column.disabledInput && element[column.disabledInput])
                          || undefined
                        }
                        singleChecked={element[column.input] || false}
                        onSelectedCheckboxChanged={() =>
                          onStateChanged({
                            parentId,
                            subParentId,
                            parentIndex:
                              parentId && !subParentId && parentIndex === undefined
                                ? index
                                : parentIndex,
                            subParentIndex:
                              subParentId && parentIndex !== undefined
                                ? index
                                : undefined,
                            id: column.input,
                            value: !element[column.input],
                          })
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
            {index < items.length - 1 && (
              <span className={`separator-h${(!isWithHeader && ' my-2') || ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
);

PropertiesComponent.displayName = 'PropertiesComponent';

PropertiesComponent.propTypes = {
  properties: PropTypes.instanceOf(Array).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      input: PropTypes.string,
      title: PropTypes.string,
      isDisabled: PropTypes.bool,
      disabledInput: PropTypes.string,
      getIsDisabled: PropTypes.func,
    }),
  ),
  onStateChanged: PropTypes.func.isRequired,
  getIsDisabled: PropTypes.func,
  parentIndex: PropTypes.number,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  isWithHeader: PropTypes.bool,
  isWithCheckAll: PropTypes.bool,
  propertiesTitle: PropTypes.string,
  parentTranslationPath: PropTypes.string,
};

PropertiesComponent.defaultProps = {
  columns: [
    {
      input: 'create',
      title: 'create',
    },
    {
      input: 'edit',
      title: 'edit',
    },
    {
      input: 'delete',
      title: 'delete',
    },
    {
      input: 'view',
      title: 'view',
    },
    {
      input: 'publish',
      title: 'publish',
    },
  ],
  parentIndex: undefined,
  getIsDisabled: undefined,
  parentId: undefined,
  subParentId: undefined,
  isWithHeader: undefined,
  isWithCheckAll: undefined,
  propertiesTitle: undefined,
  parentTranslationPath: undefined,
};
