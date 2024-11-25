import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';

import { HeaderSection } from './sections';
import FormBuilderTheme from '../../../../layouts/form-builder/theme/FormBuilder.Theme';
import { TabsComponent } from '../../../../components';
import { ScorecardTemplateTabs } from './tabs-data';
import './scorecard.builder.style.scss';
import sections from './data/SectionsData';
import blocksData from './data/BlocksData';
import { generateUUIDV4, showError, showSuccess } from '../../../../helpers';
import {
  ScoreCalculationTypeEnum,
  ScorecardAppereanceEnum,
  ScorecardFormAppereanceEnum,
} from '../../../../enums';
import { EvaluateDrawer } from './evaluate-drawer/EvaluateDrawer';
import { useQuery } from '../../../../hooks';
import {
  GPTGenerateQuestionnaire,
  ViewScorecardTemplate,
} from '../../../../services';
import i18next from 'i18next';
import { ChatGPTJobDetailsDialog } from '../../../evassess/templates/dialogs/ChatGPTJobDetails.Dialog';
import { useTranslation } from 'react-i18next';
import { Backdrop, CircularProgress } from '@mui/material';

const parentTranslationPath = 'Scorecard';
const translationPath = '';

const ScorecardBuilderPage = () => {
  const query = useQuery();
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);
  const [templatesTabsData] = useState(() => ScorecardTemplateTabs);
  const SectionsData = React.useMemo(() => Object.entries(sections), []);
  const BlocksData = React.useMemo(() => Object.entries(blocksData), []);
  const [headerHeight, setHeaderHeight] = useState();
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGlobalLoading, setIGlobalLoading] = useState([]);
  const [openChatGPTDialog, setOpenChatGPTDialog] = useState(false);
  const [gptDetails, setGPTDetails] = useState({
    job_title: '',
    year_of_experience: '',
    type: 'text',
    language: i18next.language,
    number_of_questions: 'one',
    isMultiple: false,
  });
  const [templateData, setTemplateData] = useState({
    ...(query.get('uuid') && {
      uuid: query.get('uuid'),
    }),
    source: query.get('source'),
    extraQueries: { jobUUID: query.get('job_uuid') },
    title: { en: 'Untitled' },
    code: '',
    status: true,
    description: { en: '' },
    template_labels: [],
    card_setting: {
      min_committee_members: 1,
      score_calculation_method: ScoreCalculationTypeEnum.default.key,
      score: {
        score_range: '',
        score_style: '',
      },
      range_labels: {
        min: '',
        med: '',
        max: '',
      },
      appearance: {
        submit_style: ScorecardAppereanceEnum.steps.key,
        form_appearance: ScorecardFormAppereanceEnum.sideDrawer.key,
      },
    },
    sections: [],
    task_status_uuid: '',
  });
  const [dataSectionContainers, setDataSectionContainers] = useState([]);
  const [dataSectionItems, setDataSectionItems] = useState({});
  const onIsLoadingChanged = useCallback((newValue) => {
    setIsLoading(newValue);
  }, []);

  const handleAddSection = useCallback(() => {
    const newContainerId = generateUUIDV4();
    setDataSectionContainers((containers) => [...containers, newContainerId]);
    setDataSectionItems((items) => ({
      ...items,
      [newContainerId]: {
        ...SectionsData[0][1],
        id: generateUUIDV4(),
        blocks: [],
      },
    }));
    return newContainerId;
  }, [SectionsData]);
  const handleAddBlockFromEmpty = useCallback(() => {
    const newContainerId = generateUUIDV4();
    setDataSectionContainers((containers) => [...containers, newContainerId]);
    setDataSectionItems((items) => ({
      ...items,
      [newContainerId]: {
        ...SectionsData[0][1],
        id: generateUUIDV4(),
        blocks: [
          {
            ...blocksData.rating,
            id: generateUUIDV4(),
          },
        ],
      },
    }));
    return newContainerId;
  }, [SectionsData]);
  const handleChangeSubmitStyle = (val) => {
    setTemplateData((items) => ({
      ...items,
      card_setting: {
        ...items.card_setting,
        appearance: {
          ...items.card_setting.appearance,
          submit_style: val,
        },
      },
    }));
  };

  const calculateWeight = () => {
    const temp = Object.values(dataSectionItems || {}).filter((item) =>
      (item.blocks || []).some((blockItem) => blockItem?.type === 'rating'),
    );
    if (dataSectionContainers.length === 0 || temp.length === 0) return [];
    else {
      let localData = { ...dataSectionItems };
      dataSectionContainers.forEach((containerID) => {
        const localeBlocks = localData?.[containerID]?.blocks;
        const ratingBlocks = (localeBlocks || []).filter(
          (item) => item.type === 'rating',
        );
        if (ratingBlocks.length > 0) {
          const sectionWeight = parseFloat((100 / temp.length).toFixed(1));
          const blockWeight = parseFloat(
            (sectionWeight / ratingBlocks.length).toFixed(1),
          );
          localData[containerID] = {
            ...localData[containerID],
            weight: sectionWeight,
            blocks: localeBlocks.map((item) => ({
              ...item,
              weight: item.type === 'rating' ? blockWeight : '',
            })),
          };
        }
      });

      setDataSectionItems(localData);
    }
  };
  const ratingSections = useMemo(() => {
    const temp = Object.values(dataSectionItems || {}).filter((item) =>
      (item.blocks || []).some((blockItem) => blockItem.type === 'rating'),
    );
    if (dataSectionContainers.length === 0 || temp.length === 0) return [];
    else {
      let filterdData = [];
      dataSectionContainers.forEach((containerID) => {
        const localeBlocks = dataSectionItems?.[containerID]?.blocks;
        const ratingBlocks = (localeBlocks || []).filter(
          (item) => item.type === 'rating',
        );
        if (ratingBlocks.length > 0)
          filterdData.push({
            ...dataSectionItems[containerID],
            containerID,
            blocks: ratingBlocks,
          });
      });
      return filterdData;
    }
  }, [dataSectionContainers, dataSectionItems]);
  const handleSettingChange = ({ parent, id, val }) => {
    setTemplateData((items) => ({
      ...items,
      card_setting: {
        ...items.card_setting,
        ...(parent && {
          [parent]: {
            ...items.card_setting[parent],
            [id]: val,
          },
        }),
        ...(!parent
          && id && {
          [id]: val,
        }),
      },
    }));
    if (
      id === 'score_calculation_method'
      && val === ScoreCalculationTypeEnum.weight.key
    )
      calculateWeight();
  };
  const handleWeightChange = ({ type, containerID, blockID, val }) => {
    if (blockID && containerID && type === 'block') {
      let localeBlocks = [...(dataSectionItems[containerID].blocks || [])];
      const blockIndex = localeBlocks.findIndex((item) => item.id === blockID);
      if (blockIndex !== -1) {
        localeBlocks[blockIndex].weight = val || 0;
        setDataSectionItems((items) => ({
          ...items,
          [containerID]: {
            ...items[containerID],
            blocks: localeBlocks,
          },
        }));
      }
    } else
      setDataSectionItems((items) => ({
        ...items,
        [containerID]: {
          ...items[containerID],
          weight: val || 0,
        },
      }));
  };
  const handleTemplateGeneral = ({ val, lang, name }) => {
    if (lang)
      setTemplateData((items) => ({
        ...items,
        [name]: { ...items[name], [lang]: val },
      }));
    else
      setTemplateData((items) => ({
        ...items,
        [name]: val,
      }));
  };
  const memoizedSections = useMemo(() => {
    if (!dataSectionContainers.length) return [];
    else
      return dataSectionContainers.map((containerID) => ({
        ...dataSectionItems[containerID],
        description: Object.values(
          dataSectionItems?.[containerID]?.description || {},
        )?.some((item) => !!item)
          ? dataSectionItems?.[containerID]?.description
          : null,
        blocks:
          dataSectionItems?.[containerID]?.blocks?.map((block) => ({
            ...block,
            description: Object.values(block?.description || {})?.some(
              (item) => !!item,
            )
              ? block?.description
              : null,
          })) || [],
      }));
  }, [dataSectionContainers, dataSectionItems]);

  const viewScorecardTemplate = useCallback(
    async (uuid) => {
      setIGlobalLoading((items) => [...items, 'get-template']);
      const response = await ViewScorecardTemplate({ uuid });
      setIGlobalLoading((items) => items.filter((item) => item !== 'get-template'));
      if (response.status === 200 && response?.data?.results) {
        const data = response?.data?.results || {};
        const localeSections = data?.sections || [];
        let sectionsIds = (localeSections || []).map((item) => item.id);
        let temp = {};
        sectionsIds.forEach((containerID, index) => {
          temp[containerID] = {
            ...sections.section,
            ...localeSections[index],
            blocks:
              localeSections[index]?.blocks?.map((block) => ({
                ...blocksData[block.type],
                ...block,
              })) || [],
          };
        });
        setDataSectionContainers(sectionsIds);
        setDataSectionItems(temp);
        setTemplateData((items) => ({ ...items, ...data }));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t],
  );

  useEffect(() => {
    if (templateData?.uuid) viewScorecardTemplate(templateData?.uuid);
  }, [templateData?.uuid, viewScorecardTemplate]);

  const gptGenerateQuestion = useCallback(
    async (val, callBack, canRegenerate = true) => {
      try {
        handleCloseGPTDialog();
        setIGlobalLoading((items) => [
          ...items,
          val.isMultiple ? val.containerId : val.blockID,
        ]);
        const res = await GPTGenerateQuestionnaire({
          ...val,
          number_of_questions: val.isMultiple ? val.number_of_questions : 'one',
        });
        setIGlobalLoading((items) =>
          items.filter(
            (item) => item !== (val.isMultiple ? val.containerId : val.blockID),
          ),
        );
        if (res && res.status === 200) {
          let localeQuestions = [];
          let results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptGenerateQuestion(val, callBack, false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res, {
                type: 'warning',
              });
              return;
            }
          if (
            (!val.isMultiple || val.number_of_questions === 'one')
            && results?.question
          )
            results = [results];
          if (results?.length > 0)
            results.forEach((item) => {
              localeQuestions.push({
                title: item?.question || '',
                options: (item?.answers?.length ? item.answers : item.options) || [],
              });
            });

          showSuccess(t(`Shared:success-get-gpt-help`));
          callBack(localeQuestions, val.language);
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        setIGlobalLoading((items) =>
          items.filter(
            (item) => item !== (val.isMultiple ? val.containerId : val.blockID),
          ),
        );
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [t],
  );

  const handelGetQuestionsThroughGPT = useCallback(
    (val) => {
      setGPTDetails((items) => ({ ...items, ...val, callBack: null }));
      gptGenerateQuestion(val, val.callBack);
    },
    [gptGenerateQuestion],
  );
  const handleCloseGPTDialog = () => {
    setOpenChatGPTDialog(false);
    setGPTDetails((items) => ({ ...items, callBack: null }));
  };

  const handleOpenChatGPTDialog = ({ containerId, blockID, type }) => {
    setGPTDetails((items) => ({
      ...items,
      containerId,
      blockID,
      isMultiple: !blockID,
      number_of_questions: blockID ? 'one' : items?.number_of_questions,
      type: type === 'dropdown' ? 'checkbox' : 'text',
      callBack: (q, lang) => {
        if (q[0])
          if (blockID) {
            let localBlocks = [...(dataSectionItems?.[containerId]?.blocks || [])];
            const blockIndex = localBlocks.findIndex((item) => item.id === blockID);
            if (blockIndex !== -1) {
              localBlocks[blockIndex] = {
                ...localBlocks[blockIndex],
                title: {
                  ...localBlocks[blockIndex].title,
                  [lang]: q[0].title,
                },
                ...(type === 'dropdown'
                  && q[0]?.options.length > 0 && {
                  options: q[0].options,
                }),
              };
              setDataSectionItems((items) => ({
                ...items,
                [containerId]: {
                  ...items[containerId],
                  blocks: localBlocks,
                },
              }));
            }
          } else
            setDataSectionItems((items) => ({
              ...items,
              [containerId]: {
                ...items[containerId],
                blocks: q.map((item) => ({
                  ...blocksData.rating,
                  id: generateUUIDV4(),
                  title: {
                    ...blocksData.rating.title,
                    [lang]: item.title,
                  },
                })),
              },
            }));
      },
    }));
    setOpenChatGPTDialog(true);
  };

  const isDesicionExist = useMemo(
    () =>
      (memoizedSections || []).some(
        (sec) =>
          sec?.blocks?.length
          && (sec.blocks || []).some((block) => block?.type === 'decision'),
      ),
    [memoizedSections],
  );

  return (
    <>
      <ThemeProvider theme={FormBuilderTheme}>
        <div className="score-card-wrapper page-wrapper p-0">
          <Backdrop
            className="spinner-wrapper"
            style={{ zIndex: 9999 }}
            open={isGlobalLoading.includes('get-template')}
          >
            <CircularProgress color="inherit" size={50} />
          </Backdrop>
          <HeaderSection
            parentTranslationPath={parentTranslationPath}
            templateData={templateData}
            headerHeight={headerHeight}
            setHeaderHeight={setHeaderHeight}
            setIsPreview={setIsPreview}
            ratingSections={ratingSections}
            sections={memoizedSections}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsOpenSideMenu={setIsOpenSideMenu}
            activeTab={activeTab}
            setIsSubmitted={setIsSubmitted}
          />
          <div className="main-scorecard-tabs">
            <TabsComponent
              wrapperClasses="px-0"
              data={templatesTabsData}
              currentTab={activeTab}
              labelInput="label"
              idRef="TemplatesTabsRef"
              isWithLine
              isPrimary
              onTabChanged={(event, currentTab) => {
                setActiveTab(currentTab);
              }}
              isDisabled={isLoading}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              dynamicComponentProps={{
                isLoading,
                onIsLoadingChanged,
                parentTranslationPath,
                translationPath,
                templateData,
                setTemplateData,
                headerHeight,
                setHeaderHeight,
                dataSectionContainers,
                setDataSectionContainers,
                dataSectionItems,
                setDataSectionItems,
                SectionsData,
                BlocksData,
                handleAddSection,
                handleChangeSubmitStyle,
                calculateWeight,
                ratingSections,
                handleSettingChange,
                handleWeightChange,
                handleTemplateGeneral,
                isOpenSideMenu,
                handleOpenChatGPTDialog,
                isGlobalLoading,
                handleAddBlockFromEmpty,
                isDesicionExist,
                isSubmitted,
              }}
            />
          </div>
        </div>
        {openChatGPTDialog && (
          <ChatGPTJobDetailsDialog
            isOpen={openChatGPTDialog}
            state={gptDetails}
            setState={setGPTDetails}
            onClose={() => {
              handleCloseGPTDialog();
            }}
            onSave={(val) => {
              handelGetQuestionsThroughGPT(val);
            }}
            isLoading={isLoading}
            isMultiple={gptDetails.isMultiple}
            isJobTitleRequired
            isWithQuestionsNumber={gptDetails.isMultiple}
            isWithlanguage
            isYearsHalf={true}
          />
        )}
      </ThemeProvider>
      <EvaluateDrawer
        drawerOpen={isPreview || false}
        isPreview={true}
        closeHandler={() => {
          setIsPreview(false);
        }}
        labels={templateData.template_labels || []}
        title={templateData.title || {}}
        description={templateData.description || {}}
        submitStyle={
          templateData?.card_setting?.appearance?.submit_style
          || ScorecardAppereanceEnum.steps.key
        }
        sections={memoizedSections}
        globalSetting={templateData?.card_setting || {}}
      />
    </>
  );
};

export default ScorecardBuilderPage;
