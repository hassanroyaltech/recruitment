import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent, DialogComponent } from '../../../components';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

export const MatchEvaRec = ({
  isOpen,
  onClose,
  jobs,
  onApply,
  selectedJob,
  mode,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [selected, setSelected] = useState(selectedJob || null);

  return (
    <DialogComponent
      dialogContent={
        <div className="d-flex-column-center px-3">
          <h3 className="h3 font-weight-bold">
            {mode === 'search-database'
              ? t(`${translationPath}match-candidates-via-EVA-REC`)
              : t(`${translationPath}match-CVs-via-EVA-REC`)}
          </h3>
          <div className="font-weight-normal text-gray text-center">
            {t(
              `${translationPath}choose-a-vacancy-from-the-following-list-below-or-search-by-reference-number`,
            )}
          </div>
          <div className="mt-3 mb-3 w-100">
            <AutocompleteComponent
              value={selected || {}}
              idRef="rmsSelectIdRef"
              themeClass="theme-solid"
              disableClearable={!selected}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) => option.label || ''}
              inputPlaceholder="search-by-title-or-reference-number"
              isOptionEqualToValue={(option) =>
                selected && option.uuid === selected.uuid
              }
              data={
                (jobs && jobs.map((item) => ({ ...item, label: item.title }))) || []
              }
              onChange={(e, newValue) => {
                if (newValue)
                  setSelected({
                    uuid: newValue.uuid,
                    label: newValue.title,
                    title: newValue.reference_number,
                  });
                else setSelected(null);
              }}
            />
          </div>
        </div>
      }
      maxWidth="sm"
      isOpen={isOpen}
      onCloseClicked={onClose}
      onCancelClicked={onClose}
      saveIsDisabled={!selected}
      translationPath={translationPath}
      onSubmit={() => onApply(selected)}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

export default MatchEvaRec;
