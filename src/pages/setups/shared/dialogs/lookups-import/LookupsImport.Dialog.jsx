import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { DialogComponent, TabsComponent } from '../../../../../components';
import { array, object } from 'yup';
import { ButtonBase } from '@mui/material';
import { LookupsImportEnum } from '../../../../../enums';
import { SetupsReducer, SetupsReset } from '../../helpers';
import {
  ValidateOrImportBulkLookups,
  ValidateOrImportLookups,
} from '../../../../../services';
import { LookupsImportTabs } from './tabs-data/LookupsImport.Tabs';
// import './LookupsImport.Style.scss';

export const LookupImportDialog = memo(
  ({
    isOpen,
    isOpenChanged,
    onSave,
    enumItem,
    parentTranslationPath = 'SetupsPage',
    translationPath,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [lookupsImportTabs] = useState(
      LookupsImportTabs.filter(
        (item, index) => enumItem.isBulk === item.isBulk || index === 0,
      ),
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState();
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState(0);
    // const [validatedItem, setValidatedItem] = useState(null);
    const stateInitRef = useRef({
      file: null,
      file_uuid: null,
      model: enumItem.key,
      is_validate: true,
    });

    const [state, setState] = useReducer(
      SetupsReducer,
      stateInitRef.current,
      SetupsReset,
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to return the array of object for tables columns
     */
    const getTableHeaderByCol = useMemo(
      () =>
        ({ col }) => {
          if (col) {
            const localColumns = Object.entries(col).map(([key, value]) => ({
              key,
              label: value,
              input: key,
              isSortable: false,
              isSearchable: false,
            }));
            const extraColumns = [
              {
                key: 'process',
                label: t('process'),
                input: 'action',
              },
              {
                key: 'error',
                label: t('failed-reasons'),
                input: 'errors',
                component: (row) =>
                  row.errors
                  && row.errors.length > 0 && (
                    <ul className="c-error pl-3-reversed">
                      {row.errors.map((item) => (
                        <li key={`errorsKey${row.uuid}${item}`}>{item}</li>
                      ))}
                    </ul>
                  ),
              },
            ];
            return [...localColumns, ...extraColumns];
          }
          return [];
        },
      [t],
    );

    /**
     * @param newValue
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is sent new value for state from child
     */
    const onStateChanged = (newValue) => {
      setState(newValue);
    };

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to get form errors
     */
    const getErrors = useCallback(async () => {
      const result = await getErrorByName(
        {
          current: object().shape({
            file: array().nullable().required(t('Shared:this-field-is-required')),
          }),
        },
        state,
      );
      setErrors(result);
    }, [state, t]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to handle saving
     */
    const saveHandler = async (event) => {
      event.preventDefault();
      setIsSubmitted(true);
      if (Object.keys(errors).length > 0) return;

      setIsLoading(true);
      const response = await (enumItem.isBulk
        ? ValidateOrImportBulkLookups
        : ValidateOrImportLookups)(state);
      setIsLoading(false);
      if (response && (response.status === 200 || response.status === 201)) {
        // if (action === 'validate') setValidatedItem(response.data);
        // else {
        if (onSave) onSave();
        isOpenChanged();
        showSuccess(t('file-imported-successfully'));
      } else showError(t('file-import-failed'), response);
    };

    // this to call error's updater when state changed
    useEffect(() => {
      void getErrors();
    }, [getErrors, state]);

    return (
      <DialogComponent
        maxWidth="md"
        isConfirm
        titleText={`import-${enumItem.value}`}
        dialogContent={
          <div className="lookups-import-dialog-content-wrapper d-flex-h-center fa-start flex-wrap">
            <div className="description-text mb-3">
              <span>{t('click')}</span>
              <a
                download
                target="_blank"
                href={`https://static-elevatus.s3.eu-west-2.amazonaws.com/Imports/${enumItem.url}`}
                rel="noreferrer"
                className="c-black fw-bold px-1"
              >
                {t('here')}
              </a>
              <span>{t('to-download-template')}</span>
            </div>
            <TabsComponent
              isPrimary
              isWithLine
              labelInput="label"
              tabsContentClasses="w-100"
              idRef="lookupsImportTabsRef"
              currentTab={activeTab}
              data={lookupsImportTabs}
              onTabChanged={(event, currentTab) => {
                setActiveTab(currentTab);
              }}
              parentTranslationPath={parentTranslationPath}
              dynamicComponentProps={{
                enumItem,
                // validatedItem,
                getTableHeaderByCol,
                state,
                errors,
                onStateChanged,
                isSubmitted,
                parentTranslationPath,
                // translationPath,
              }}
            />
          </div>
        }
        isOpen={isOpen}
        dialogActions={
          <div className="my-1 save-cancel-wrapper">
            <ButtonBase className="btns theme-outline mx-2" onClick={isOpenChanged}>
              <span>{t('Shared:cancel')}</span>
            </ButtonBase>
            {/*<ButtonBase*/}
            {/*  className="btns theme-outline mx-2"*/}
            {/*  onClick={saveHandler('validate')}*/}
            {/*  disabled={isLoading}*/}
            {/*>*/}
            {/*  <span>{t(`validate`)}</span>*/}
            {/*</ButtonBase>*/}
            {activeTab === 0 && (
              <ButtonBase
                className="btns theme-solid  mx-2"
                onClick={saveHandler}
                disabled={isLoading}
              >
                <span>{t(`import`)}</span>
              </ButtonBase>
            )}
          </div>
        }
        onCloseClicked={isOpenChanged}
        // onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    );
  },
);

LookupImportDialog.displayName = 'LookupImportDialog';

LookupImportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string.isRequired,
  enumItem: PropTypes.oneOf(Object.values(LookupsImportEnum)).isRequired,
};
