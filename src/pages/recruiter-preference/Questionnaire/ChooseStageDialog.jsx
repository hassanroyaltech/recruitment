import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SharedAutocompleteControl } from '../../setups/shared';
import { DialogComponent } from '../../../components';

const translationPath = 'Questionnaire.';
const mainParentTranslationPath = 'RecruiterPreferences';

const ChooseStageDialog = ({ isOpen, onClose, onSave, data }) => {
  const { t } = useTranslation(mainParentTranslationPath);
  const [selectedStage, setSelectedStage] = useState(data?.stage_uuid);

  const handleSave = () => {
    onSave((selectedStage !== 'dont-move' && selectedStage) || null);
  };

  const getMoveToOptions = useCallback(() => {
    const localStages = [...(data.stages?.filter((a) => a.type !== 1) || [])];
    localStages.push({
      uuid: 'dont-move',
      title: t(`${translationPath}dont-move`),
    });
    return localStages.filter((a) => a.type !== 1);
  }, [data.stages, t]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={t(`${translationPath}general-logic`)}
      contentClasses="px-0"
      dialogContent={
        <div>
          <div className="text-gray font-14 px-3">
            {t(`${translationPath}general-logic-description`)}
          </div>
          <SharedAutocompleteControl
            editValue={selectedStage}
            labelValue={t(`${translationPath}move-applicant-upon-completing-to`)}
            placeholder={t(`${translationPath}select-stage`)}
            isTwoThirdsWidth
            stateKey="stage_uuid"
            onValueChanged={({ value }) => {
              setSelectedStage(value);
            }}
            getOptionLabel={(option) => option.title} // check which one should be used
            initValues={getMoveToOptions()}
            initValuesKey="uuid"
            initValuesTitle="title"
          />
        </div>
      }
      wrapperClasses="lookups-management-dialog-wrapper"
      isOpen={isOpen}
      isEdit={(data?.stage_uuid && true) || undefined}
      onSubmit={handleSave}
      saveText={t(`${translationPath}continue`)}
      onCloseClicked={onClose}
      onCancelClicked={onClose}
    />
  );
};
export default ChooseStageDialog;
