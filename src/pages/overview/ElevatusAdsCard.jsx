import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'Overview';
export default function ElevatusAdsCard(props) {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <Card className="elevatus-ads-card">
      <CardBody className="text-white">
        <h5 className="h5 text-white">{t(`${translationPath}ads-elevatus`)}</h5>
        {props.ads.map((element, index) => (
          <div key={index}>
            <p className="font-14 font-weight-bold">{element.content}</p>
            <a className="show-more h5 text-white" href={element.url}>
              {t(`${translationPath}show-more`)}
            </a>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
