import React, { Component } from 'react';
import { CardBody } from 'reactstrap';
import axios from 'axios';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';

const questionnairesMockData = [
  {
    uuid: 'abc61f6f-f746-4c3d-8523-b10099a2a46b',
    questionnaire: 'VA Questionnaire',
    question: {
      _id: '5f0c0560a8a8ad7e556d8263',
      prep_assessment_questionnaire_uuid: '75df3693-075f-42a0-b5ab-0c815ca1c806',
      title: 'Introduce yourself in 45 seconds',
      description: 'this is a desc of text question',
      is_required: false,
      order: 1,
      data: [],
      type: 1,
      uuid: 'fd138888-cdb3-48c1-9936-fae0ee88a2a8',
      updated_at: '2020-07-13 06:55:28',
      created_at: '2020-07-13 06:55:28',
    },
    answer: 'My name is suha im a Back end Developer on Elevatus',
    media: null,
  },
  {
    uuid: 'ab053379-8591-4fa8-bb3d-337bd825cd32',
    questionnaire: 'VA Questionnaire',
    question: {
      _id: '5f0c0560a8a8ad7e556d8264',
      prep_assessment_questionnaire_uuid: '75df3693-075f-42a0-b5ab-0c815ca1c806',
      title: 'upload your resume',
      description: null,
      is_required: false,
      order: 1,
      data: [],
      type: 6,
      uuid: 'c8b8b7e5-590f-4d08-962c-e53f869883cb',
      updated_at: '2020-07-13 06:55:28',
      created_at: '2020-07-13 06:55:28',
    },
    answer: null,
    media: {
      original: {
        uuid: 'c3e7a376-73c2-45a8-b076-c73e3211c0c1',
        url: 'https://elevatus-test.s3.eu-west-2.amazonaws.com/career_portal/2020/07/c3e7a376-73c2-45a8-b076-c73e3211c0c1/original/L9Wk5KU8sTsCjymzvE64yuElbUkp8Q3R9viublL1.jpeg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATOUKQY5AG4XVGZH4%2F20200813%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200813T102509Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=4ef7416ca745caf7f6ba781ff4465d8f54f70623f5e81d4f75f36723a92089ff',
        type: 'image',
        created: '2020-07-13T08:37:34.659000Z',
        status: 'done',
      },
      related: [
        {
          media:
            'https://elevatus-test.s3.eu-west-2.amazonaws.com/career_portal/2020/07/c3e7a376-73c2-45a8-b076-c73e3211c0c1/processed/xsmall-C5nwiWN6XGxhE0UJjxMZnL4jSXOeus0BowDO7ylv.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATOUKQY5AG4XVGZH4%2F20200813%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200813T102510Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=0ca5600f2a8fa69520201865ce6c69c9b198f547e85354a2843c45028817fe38',
          type: 'image',
        },
        {
          media:
            'https://elevatus-test.s3.eu-west-2.amazonaws.com/career_portal/2020/07/c3e7a376-73c2-45a8-b076-c73e3211c0c1/processed/small-b9BRiqto55ROiu0uFOfIIgB6LPZfS1XqNBpfP0ws.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATOUKQY5AG4XVGZH4%2F20200813%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200813T102510Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=cef45563c813606dd8fe05d4a91ebc4faa8bfaaf723b2fc6aa1a493433f4f518',
          type: 'image',
        },
        {
          media:
            'https://elevatus-test.s3.eu-west-2.amazonaws.com/career_portal/2020/07/c3e7a376-73c2-45a8-b076-c73e3211c0c1/processed/medium-INL4qOcsS1usHBwEJVPx07BwgpXPElSjzovJHUPM.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATOUKQY5AG4XVGZH4%2F20200813%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200813T102510Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=bfe508e58d49b3b03307cdb4cb6760acbb1e87e616c10369121e7169871003b4',
          type: 'image',
        },
        {
          media:
            'https://elevatus-test.s3.eu-west-2.amazonaws.com/career_portal/2020/07/c3e7a376-73c2-45a8-b076-c73e3211c0c1/processed/large-QQcmGs9oXWjDr9vG7FG7jHoqHbQwybCeGlX4Xx4F.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATOUKQY5AG4XVGZH4%2F20200813%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200813T102510Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=b83eedccfcb67338157fdb0fed510804e32e6ca0d866c69f0eed6a88bb2bdef2',
          type: 'image',
        },
        {
          media:
            'https://elevatus-test.s3.eu-west-2.amazonaws.com/career_portal/2020/07/c3e7a376-73c2-45a8-b076-c73e3211c0c1/processed/xlarge-AeeXhtrPA4CwdCCe8aFWv682jyTsbWEHa27hXsOY.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATOUKQY5AG4XVGZH4%2F20200813%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200813T102510Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Signature=4861c084c2ebc76cf732050e63a035705c005d6c7e40fd06f66ff6138da9ffe5',
          type: 'image',
        },
      ],
    },
  },
];

export class QuestionnaireView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      no_options: false,
      questionnaires: questionnairesMockData,
      questionnaire: 1,
      user: JSON.parse(localStorage.getItem('user'))?.results,
    };
  }

  getQuestionnaires = async () => {
    const { user } = this.state;
    await axios
      .get(urls.evassess.VIEW_QUESTIONNAIRE, {
        headers: generateHeaders(),
        params: {
          uuid: this.props.candidate?.candidate?.information?.uuid,
        },
      })
      .then((res) => {
        this.setState({
          questionnaires: res.data.results.data,
        });
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  componentDidMount() {
    this.getQuestionnaires();
  }

  handleViewQuestionnaire = (e) => {
    this.setState({
      questionnaire: parseInt(e.currentTarget.value),
    });

    // Call Candidate Questionnaire API
  };

  render() {
    return (
      <React.Fragment>
        {/* <Row>
          <Col xl={6} lg={6} md={6} xs={12}>
            <FormGroup>
              <label className='form-control-label' htmlFor='select-2'>
                Select Questionnaire
              </label>
              <Input
                className='form-control-alternative'
                id='pipeline-language'
                type='select'
                value={this.state.questionnaire}
                onChange={this.handleViewQuestionnaire}
              >
                {this.state.questionnaires?.length
                  ? this.state.questionnaires.map((questionnaire, i) => (
                      <option key={i} value={questionnaire.uuid}>
                        {questionnaire.title}
                      </option>
                    ))
                  : null}
              </Input>
            </FormGroup>
          </Col>
        </Row> */}
        <CardBody
          className="text-center border border-primary rounded p-3 questionnaire-view"
          style={{
            width: 'fit-content',
            minWidth: '60%',
          }}
        >
          <div className="d-flex flex-column aling-items-start">
            {this.state.questionnaires?.length
              ? this.state.questionnaires.map((item, index) => (
                <React.Fragment key={index}>
                  {index ? (
                    <hr
                      className="my-3"
                      style={{
                        marginLeft: 60,
                        marginRight: 40,
                      }}
                    />
                  ) : null}

                  <div className="d-flex flex-row">
                    <h6 className="h6 text-gray" style={{ width: 40 }}>
                        Q{index + 1}
                    </h6>
                    <h6 className="h6 text-gray">{item.question?.title || ''}</h6>
                  </div>
                  {item.answer && (
                    <div
                      style={{ margin: '0px 40px' }}
                      className="text-black text-left"
                    >
                      {item.answer || ''}
                    </div>
                  )}
                  {item.media ? (
                    <div
                      className="d-flex flex-row align-items-center media-items flex-wrap"
                      style={{ margin: '0px 40px' }}
                    >
                      {item.media.original ? (
                        <div className="media-item mr-4-reversed">
                          <img
                            className="d-inline-block w-100 h-100"
                            alt="..."
                            src={
                              item.media.original?.url
                                || require('assets/img/theme/team-4.jpg')
                            }
                          />
                        </div>
                      ) : null}
                      {item.media.related?.map((mediaItem, index) => (
                        <div className="media-item mr-4-reversed my-2" key={index}>
                          <img
                            className="d-inline-block w-100 h-100"
                            alt="..."
                            src={
                              mediaItem.media
                                || require('assets/img/theme/team-4.jpg')
                            }
                          />
                        </div>
                      )) || null}
                    </div>
                  ) : null}
                </React.Fragment>
              ))
              : null}
          </div>
        </CardBody>
      </React.Fragment>
    );
  }
}
