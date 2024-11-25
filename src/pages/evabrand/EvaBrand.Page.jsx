import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../hooks';
import HeaderBarSection from './sections/header-bar/HeaderBar.Section';
import { MenuManagementSection, SectionsPainterSection } from './sections';
import './EvaBrand.Style.scss';
import { EvaBrandSectionsEnum, SystemActionsEnum } from '../../enums';
import {
  HeaderSectionDialog,
  MediaAndTextSectionDialog,
  OpeningsSectionDialog,
  SectionsAddDialog,
  GridsSectionDialog,
  GallerySectionDialog,
  TeamMembersSectionDialog,
  SliderSectionDialog,
  LocationSectionDialog,
  QuotesSectionDialog,
  PartnersSectionDialog,
  SuccessStoriesSectionDialog,
  FooterSectionDialog,
  SectionsDeleteDialog,
  MenuSectionDialog,
  JobCategoriesSectionDialog,
} from './dialogs';
import {
  EvaBrandMakeDefault,
  EvaBrandSectionToggle,
  EvaBrandTogglePublished,
  GetAllEvaBrandSections,
  GetEvaBrandLanguageStatus,
  UpdateEvaBrandSectionsOrder,
} from '../../services';
import { showError, showSuccess } from '../../helpers';
import { PopoverComponent } from '../../components';

const parentTranslationPath = 'EvaBrand';
const translationPath = '';
const EvaBrandPage = () => {
  // hook to translate page
  const { t } = useTranslation(parentTranslationPath);
  // custom hook to update page title
  useTitle(t(`${translationPath}eva-brand`));
  const [isLoading, setIsLoading] = useState(false);
  const [isShowCategory, setIsShowCategory] = useState(false);
  const [isLoadingPartial, setIsLoadingPartial] = useState(false);
  const [activeSectionType, setActiveSectionType] = useState(null);
  const [isOpenAddSectionsDialog, setIsOpenAddSectionsDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [language, setLanguage] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [languages] = useState(
    () => JSON.parse(localStorage.getItem('user'))?.results?.language,
  );
  const [sections, setSections] = useState([]);
  // function to handle drag end (reorder sections)
  const onDragEndHandler = async (dropEvent) => {
    if (!dropEvent.destination) return;
    if (dropEvent.destination.droppableId !== dropEvent.source.droppableId) return;
    const localSections = [...sections];
    const localDestinationEnum = Object.values(EvaBrandSectionsEnum).find(
      (item) => item.key === localSections[dropEvent.destination.index].type,
    );
    if (!localDestinationEnum) return;
    if (!localDestinationEnum.isDraggable) return;
    localSections.splice(
      dropEvent.destination.index,
      0,
      localSections.splice(dropEvent.source.index, 1)[0],
    );
    const saveDto = {
      language_uuid: (language && language.id) || null,
      sections: localSections.map((item) => ({ uuid: item.uuid })),
    };
    setIsLoadingPartial(true);
    const response = await UpdateEvaBrandSectionsOrder(saveDto);
    setIsLoadingPartial(false);
    if (response && response.status === 201) {
      setSections(localSections);
      showSuccess(t(`${translationPath}sections-order-updated-successfully`));
    } else showError(t(`${translationPath}sections-order-update-failed`), response);
  };
  // function to open add sections dialog open
  const addSectionsClicked = () => {
    setIsOpenAddSectionsDialog(true);
  };

  // function to delete specific section
  /**
     @param section
     */
  const onDeleteHandler = (section) => {
    setActiveItem(section);
    setIsOpenDeleteDialog(true);
  };
  // this function is temporary which update language from childs
  const onLanguageChangeHandler = (newLanguage) => {
    setLanguage(newLanguage);
  };
  // method to handle hide or show for section
  const onSectionHideHandler = async (currentSection) => {
    setIsLoadingPartial(true);
    const response = await EvaBrandSectionToggle({
      section_uuid: currentSection.uuid,
    });
    setIsLoadingPartial(false);
    if (response && response.status === 200)
      setSections((items) => {
        const localItems = [...items];
        const sectionIndex = localItems.findIndex(
          (item) => item.uuid === currentSection.uuid,
        );
        if (sectionIndex !== -1) {
          localItems[sectionIndex].is_hidden = !localItems[sectionIndex].is_hidden;
          showSuccess(
            t(
              `${translationPath}${
                (localItems[sectionIndex].is_hidden
                  && 'section-becomes-hidden-successfully')
                || 'section-becomes-visible-successfully'
              }`,
            ),
          );
        }
        return localItems;
      });
    else showError(t(`${translationPath}section-update-failed`), response);
  };
  /**
     * function to handle section selected action from child(section painter)
     @param key
     @param section
     @param typeEnum
     */
  const onSectionActionClicked = (key, section, typeEnum) => {
    if (key === SystemActionsEnum.edit.key) {
      setActiveSectionType(typeEnum);
      setActiveItem(section);
    } else if (key === SystemActionsEnum.delete.key) onDeleteHandler(section);
    else if (SystemActionsEnum.view.key) onSectionHideHandler(section);
  };
  // function to close management dialog without reload data
  const isOpenChanged = () => {
    setActiveSectionType(null);
    setActiveItem(null);
  };

  // method to handle get for sections main data by language uuid
  const getAllEvaBrandSections = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllEvaBrandSections({
      language_uuid: (language && language.id) || null,
    });
    setIsLoading(false);
    if (response && response.status === 201) setSections(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [language, t]);

  // function to handle reload sections & close management dialog
  const onSaveHandler = useCallback(() => {
    isOpenChanged();
    getAllEvaBrandSections();
  }, [getAllEvaBrandSections]);

  /**
     @param event
     @param newValue
     @description method to change section language status to published or not
     */
  const onIsPublishedChangedHandler = async (event, newValue) => {
    setIsLoadingPartial(true);
    const response = await EvaBrandTogglePublished({ language_uuid: language.id });
    setIsLoadingPartial(false);
    if (response && response.status === 200) {
      showSuccess(
        (newValue
          && t(`${translationPath}language-become-published-successfully`))
          || t(`${translationPath}language-become-unpublished-successfully`),
      );
      setIsPublished(newValue);
    } else showError(t(`${translationPath}language-update-failed`), response);
  };

  /**
     @param event
     @param newValue
     @description method to change default language
     */
  const onIsDefaultChangedHandler = async (event, newValue) => {
    setIsLoadingPartial(true);
    const response = await EvaBrandMakeDefault({ language_uuid: language.id });
    setIsLoadingPartial(false);
    if (response && response.status === 200) {
      showSuccess(t(`${translationPath}default-language-updated-successfully`));
      setIsDefault(newValue);
    } else
      showError(t(`${translationPath}default-language-update-failed`), response);
  };
  /**
     @description method to get current status for the selected language (is published & is default)
     */
  const getEvaBrandLanguageStatus = useCallback(async () => {
    setIsLoadingPartial(true);
    const response = await GetEvaBrandLanguageStatus({ language_uuid: language.id });
    setIsLoadingPartial(false);
    if (response && response.status === 200) {
      setIsPublished(response.data.results.is_published || false);
      setIsDefault(response.data.results?.is_default || false);
      setIsShowCategory(response.data.results?.show_category || false);
    } else showError(t(`${translationPath}failed-to-get-saved-data`), response);
  }, [language, t]);
  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is attach the popover with its opener button
   */
  const menuToggleHandler = (event) => {
    setPopoverAttachedWith(event.target);
  };

  // function to get dialog based on selected section type
  const getActiveSectionDialog = useCallback(() => {
    const dialogsParams = {
      language_uuid: (language && language.id) || null,
      language,
      sections,
      activeItem,
      onSave: onSaveHandler,
      isOpen: true,
      isOpenChanged,
      parentTranslationPath,
    };
    if (activeSectionType && activeSectionType.key === EvaBrandSectionsEnum.Menu.key)
      return <MenuSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.Header.key
    )
      return <HeaderSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.MediaAndTextSection.key
    )
      return <MediaAndTextSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.OpeningsSection.key
    )
      return <OpeningsSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.GridSection.key
    )
      return <GridsSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.GallerySection.key
    )
      return <GallerySectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.TeamMembersSection.key
    )
      return <TeamMembersSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.SliderSection.key
    )
      return <SliderSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.LocationSection.key
    )
      return <LocationSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.QuotesSection.key
    )
      return <QuotesSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.PartnersSection.key
    )
      return <PartnersSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.SuccessStoriesSection.key
    )
      return <SuccessStoriesSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.JobCategoriesSection.key
    )
      return <JobCategoriesSectionDialog {...dialogsParams} />;
    if (
      activeSectionType
      && activeSectionType.key === EvaBrandSectionsEnum.Footer.key
    )
      return <FooterSectionDialog {...dialogsParams} />;
    return null;
  }, [language, sections, activeItem, onSaveHandler, activeSectionType]);
  useEffect(() => {
    if (language) getAllEvaBrandSections();
  }, [getAllEvaBrandSections, language]);
  useEffect(() => {
    if (languages && languages.length > 0) setLanguage(languages[0]);
  }, [languages]);

  useEffect(() => {
    if (language) getEvaBrandLanguageStatus();
  }, [getEvaBrandLanguageStatus, language]);

  return (
    <div className="eva-brand-wrapper page-wrapper">
      <PopoverComponent
        idRef="MenuManagementSectionPopoverRef"
        attachedWith={popoverAttachedWith}
        popoverClasses="menu-management-section-popover-wrapper"
        handleClose={() => setPopoverAttachedWith(null)}
        component={
          <MenuManagementSection
            menu={sections}
            onActionClickedHandler={onSectionActionClicked}
            onDragEnd={onDragEndHandler}
            addSectionsClicked={addSectionsClicked}
            isLoadingPartial={isLoadingPartial}
            isLoading={isLoading}
            parentTranslationPath={parentTranslationPath}
          />
        }
      />
      <div className="eve-brand-section-wrapper">
        {/* this is the section that include actions at the top of the page */}
        <HeaderBarSection
          addSectionsClicked={addSectionsClicked}
          menuToggleHandler={menuToggleHandler}
          onLanguageChange={onLanguageChangeHandler}
          language={language}
          languages={languages}
          isLoading={isLoading}
          isLoadingPartial={isLoadingPartial}
          isPublished={isPublished}
          isDefault={isDefault}
          isShowCategory={isShowCategory}
          onIsPublishedChangedHandler={onIsPublishedChangedHandler}
          onIsDefaultChangedHandler={onIsDefaultChangedHandler}
          // onSave={() => getAllEvaBrandSections()}
          parentTranslationPath={parentTranslationPath}
        />
        <SectionsPainterSection
          sections={sections}
          isLoadingPartial={isLoadingPartial}
          isLoading={isLoading}
          onDragEnd={onDragEndHandler}
          onSectionActionClicked={onSectionActionClicked}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
      {isOpenAddSectionsDialog && (
        <SectionsAddDialog
          sections={sections}
          isOpen={isOpenAddSectionsDialog}
          onSave={(newSelectedType) => {
            setActiveSectionType(newSelectedType);
            setIsOpenAddSectionsDialog(false);
          }}
          isOpenChanged={() => {
            setIsOpenAddSectionsDialog(false);
            setActiveSectionType(null);
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenDeleteDialog && (
        <SectionsDeleteDialog
          activeItem={activeItem}
          isOpen={isOpenDeleteDialog}
          onSave={() => {
            getAllEvaBrandSections();
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {activeSectionType && getActiveSectionDialog()}
    </div>
  );
};

export default EvaBrandPage;
