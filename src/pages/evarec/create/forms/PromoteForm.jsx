// React and reactstrap
import React, { useState } from 'react';
import { Card } from 'reactstrap';

// Loader
// import Loader from 'components/Elevatus/Loader';

// Premium card
// import { commonAPI } from 'api/common';
import { CheckboxesComponent } from '../../../../components';
import { useTranslation } from 'react-i18next';
// import PremiumCard from '../../PremiumCard';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

/**
 * The promote step that allows us to push job posts and applications to
 * third parties.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function PromoteForm({ form }) {
  const { t } = useTranslation(parentTranslationPath);

  // const [loading, setLoading] = useState(false);
  // const [premiums, setPremiums] = useState([]);
  const [update, setUpdate] = useState(false);

  /**
   * Handler to set the fields in teh form
   * @param field
   * @returns {function(*): void}
   */
  const onSetFormField = (field) => (value) => {
    form[field] = value;
    setUpdate(!update);
  };
  // /**
  //  * Get List of providers
  //  *
  //  */
  // const getProvidersList = () => {
  //   // declare icon to make the icon loading until the API request is completed.
  //   const icon = document.getElementById('refresh');
  //   if (icon) icon.className = 'fas fa-redo fa-spin text-primary mr-2';
  //
  //   setLoading(true);
  //   commonAPI.getCompanyProvider('job').then((res) => {
  //     setPremiums(
  //       res.data.results.map((ele, index) => ({
  //         id: ele.provider,
  //         title: ele.provider,
  //         status: ele.status,
  //         plan: '$499 / 30 days',
  //         icon: ele.image,
  //         description: ele.content,
  //       })),
  //     );
  //     if (icon) icon.className = 'fas fa-redo text-primary mr-2';
  //   });
  //   setLoading(false);
  // };
  //
  // // Get the premium list
  // useEffect(() => {
  //   // getPremiums();
  //   getProvidersList();
  // }, []);

  // /**
  //  * Handler for selecting premium job boards
  //  * @param id
  //  */
  // const handleSelectPremium = (id) => {
  //   if (!form) return;
  //   if (!form.premiums) form.premiums = [];
  //   if (form.premiums.indexOf(id) !== -1)
  //     form.premiums.splice(form.premiums.indexOf(id), 1);
  //   else form.premiums.push(id);
  //
  //   setUpdate(!update);
  // };

  /**
   * Return JSX
   */
  return (
    <Card className="step-card">
      <h6 className="h6">{t(`${translationPath}promote-preferences`)}</h6>
      <div
        className="mt-3 mb-2 h6 font-weight-normal text-gray"
        style={{ opacity: 0.66 }}
      >
        {t(`${translationPath}promote-description`)}
      </div>
      <div className="mt-4 mb-2 d-inline-flex-v-center flex-row">
        <div className="text-gray">
          {t(`${translationPath}feature-job-post-on-top-of-the-career-page`)}
        </div>
        <div className="px-3">
          <CheckboxesComponent
            idRef="featureJobPostRef"
            singleChecked={form?.featureJobPost || false}
            onSelectedCheckboxChanged={() =>
              onSetFormField('featureJobPost')(!form.featureJobPost)
            }
          />
        </div>
      </div>
      {/* <div className="mt-4 mb-2 d-inline-flex-v-center flex-row">
        <div className="text-gray">
          {t(`${translationPath}promote-second-description`)}
        </div>
        <div className="px-3">
          <CheckboxesComponent
            idRef="freeJobBoardRef"
            singleChecked={form?.freeJobBoard || false}
            onSelectedCheckboxChanged={() => onSetFormField('freeJobBoard')(!form?.freeJobBoard)}
          />
        </div>
      </div> */}
      <hr className="mx--5" />
      {/* {premiums.length !== 0 && ( */}
      {/*  <div> */}
      {/*    <Row> */}
      {/*      <Col xs="12" className="d-flex flex-row justify-content-between"> */}
      {/*        <h6 className="h6">{t(`${translationPath}premium-portals`)}</h6> */}
      {/*        <div className="d-flex flex-row text-gray font-14 align-items-center"> */}
      {/*          <button */}
      {/*            type="button" */}
      {/*            className="close" */}
      {/*            data-dismiss="modal" */}
      {/*            aria-hidden="true" */}
      {/*            onClick={getProvidersList} */}
      {/*          > */}
      {/*            <i */}
      {/*              className="fas fa-redo text-primary mr-2" */}
      {/*              aria-hidden="true" */}
      {/*              id="refresh" */}
      {/*            /> */}
      {/*          </button> */}
      {/*        </div> */}
      {/*      </Col> */}
      {/*    </Row> */}

      {/*    <div className="text-gray"> */}
      {/*      {t(`${translationPath}promote-third-description`)} */}
      {/*      {' '} */}
      {/*      <br /> */}
      {/*      {' '} */}
      {/*      {t(`${translationPath}promote-forth-description`)} */}
      {/*    </div> */}
      {/*  </div> */}
      {/* )} */}
      {/* {loading ? ( */}
      {/*  <Loader className="mt-3" /> */}
      {/* ) : ( */}
      {/*  <Row className="mx--2"> */}
      {/*    {premiums?.map((item, index) => ( */}
      {/*      <Col xs="12" sm="6" md="4" className="mt-3 px-2" key={index}> */}
      {/*        <PremiumCard */}
      {/*          isSelected={form?.premiums && form.premiums.indexOf(item.id) !== -1} */}
      {/*          setSelected={() => handleSelectPremium(item.id)} */}
      {/*          item={item} */}
      {/*        /> */}
      {/*      </Col> */}
      {/*    ))} */}
      {/*  </Row> */}
      {/* )} */}
    </Card>
  );
}
