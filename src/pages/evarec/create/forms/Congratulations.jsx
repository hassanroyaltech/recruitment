// React and reactstrap
import React, { Component } from 'react';
import { Button, Card, CardBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';

// Component to copy to clipboard
import CopyToClipboardInput from 'components/Elevatus/CopyToClipboardInput';
import i18next from 'i18next';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

/**
 * The Congratulations page
 * The final page in the process
 */
class Congratulations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.link,
      copied: false,
      action: this.props.type === 'create' ? 'created' : 'updated',
      // invitationBody: `
      // ${this.props.user.user.first_name} ${this.props.user.user.last_name} ${this.props.t(`${translationPath}application-description`)}.
      // <br />
      // <br />
      // ${this.props.t(`${translationPath}topic`)}: ${this.props.title}
      // <br />
      // <br />
      // ${this.props.t(`${translationPath}created-date`)}: ${this.props.time}
      // <br />
      // <br />
      // ${this.props.t(`${translationPath}application-link`)}: ${this.props.link}
      // <br />
      // <br />
      // ${this.props.t(`${translationPath}application-id`)}: ${this.props.id}
      // <br />
      // <br />
      // `,
    };
  }

  /**
   * Render JSX
   */
  render() {
    const { t } = this.props;
    return (
      <Card
        className="step-card d-flex flex-column align-items-center"
        style={{ paddingTop: 40, paddingBottom: 40 }}
      >
        <div
          style={{
            marginBottom: 30,
            fontSize: '100px',
            color: '#a5dc86',
            lineHeight: '1em',
          }}
        >
          <i className="far fa-check-circle" />
        </div>
        <h3 className="h3" style={{ color: '#a5dc86', marginBottom: 27 }}>
          {t(`${translationPath}congratulation`)}
        </h3>
        <p className="text-gray" style={{ marginBottom: 55, fontSize: '18px' }}>
          {t(`${translationPath}your-application-has-been`)} {this.state.action}{' '}
          {t(`${translationPath}successfully`)}
        </p>
        {this.props.link && (
          <>
            <div className="w-100" style={{ marginBottom: 30 }}>
              <CopyToClipboardInput link={this.props.link} />
            </div>
            <h6 className="h6">{t(`${translationPath}publish-post`)}</h6>
            <div className="mt-3 w-100 text-gray">
              <Card>
                <CardBody>
                  {/* <div dangerouslySetInnerHTML={{ __html: this.state.invitationBody }} /> */}
                  <div>
                    {(this.props.user.user.first_name
                      && (this.props.user.user.first_name[i18next.language]
                        || this.props.user.user.first_name.en))
                      || ''}{' '}
                    {(this.props.user.user.last_name
                      && (this.props.user.user.last_name[i18next.language]
                        || this.props.user.user.last_name?.en
                        || ''))
                      || ''}{' '}
                    {t(`${translationPath}application-description`)}.
                  </div>
                  <div>
                    {t(`${translationPath}topic`)}:{this.props.title}
                  </div>
                  <div>
                    {t(`${translationPath}created-date`)}:{this.props.time}
                  </div>
                  <div>
                    {t(`${translationPath}application-link`)}:{this.props.link}
                  </div>
                  <div>
                    {t(`${translationPath}application-id`)}:{this.props.id}
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        )}
        <Button
          color="primary"
          style={{ width: '220px' }}
          href="/recruiter/job/manage"
        >
          {t(`${translationPath}back-to-applications`)}
        </Button>
      </Card>
    );
  }
}

export default withTranslation(parentTranslationPath)(Congratulations);
