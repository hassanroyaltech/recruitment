import React from 'react';
import classnames from 'classnames';
import { Card, CardBody } from 'reactstrap';

export default function OverviewStatCard(props) {
  const { title, number, icon, stats, darkMode } = props;
  return (
    <Card className={classnames('card-stats mb-0', darkMode && 'dark')}>
      <CardBody>
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-column align-items-start">
            <div className="title">{title}</div>
            <div className="total-number">{number}</div>
          </div>
          <div>{icon}</div>
        </div>
        <hr />
        <div className="d-flex flex-row justify-content-between">
          {stats.map((stat, index) => (
            <div className="stat-info" key={index}>
              <span className="stat-number">
                {stat.number}
                &nbsp;
              </span>
              {stat.title}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
