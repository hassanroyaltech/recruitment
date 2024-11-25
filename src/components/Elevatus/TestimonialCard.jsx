import React from 'react';
import { Card, CardBody, Row } from 'reactstrap';
import img from '../../../../assets/img/icons/common/github.svg';

export function TestimonialCard() {
  return (
    <Card>
      <CardBody>
        <li>
          <Row>
            <div className="col-sm-1 col-xs-3 d-flex align-items-center">
              <img alt="..." src={img} className="img-circle" />
            </div>
            <div className="col-sm-11 col-xs-9 testi_detail_div">
              <a href="..." className="float-right text-danger" data-id="0">
                <i className="fas fa-times" />{' '}
              </a>
              <p className="m-0">Yacoub Zureikat</p>
              <p className="m-0">Managing Partner</p>
              <p className="m-0">
                <i className="fa fa-quote-left" />I love working with Yacoub since
                its me myself and I
              </p>
            </div>
          </Row>
        </li>
      </CardBody>
    </Card>
  );
}
